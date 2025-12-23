/**
 * Agent Loop - Orchestration layer for the x-and Code Agent
 * Implements the PLAN → ACT → OBSERVE → ADJUST loop
 */

import { GoogleGenAI, Chat } from "@google/genai";
import {
    AgentResponse,
    AgentAction,
    ToolResult,
    ProjectFiles,
    executeTool,
    TOOL_DEFINITIONS,
    ToolName
} from './agentTools';

// ============================================
// AGENT SYSTEM PROMPT
// ============================================

export const AGENT_SYSTEM_PROMPT = `
You are x-and, an expert React developer specializing in creating STUNNING, modern, and high-quality web applications.
Your goal is to build the application requested by the user.

# CORE RESPONSIBILITIES
1.  **Use Shadcn UI**: You HAVE access to pre-built Shadcn components. You MUST use them for all interactive elements (Buttons, Cards, Inputs, etc.) instead of plain HTML.
2.  **Maintain Context**: When asked to "edit" or "change" something, you MUST READ the existing file first to understand the current code. DO NOT overwrite files blindly.
3.  **Visual Excellence**: Create premium, polished designs. Use whitespace, consistent padding, and decent typography.
    - Default Background: \`bg-[#020405]\`
    - Default Text: \`text-white\` or \`text-gray-300\`
    - Accents: Cyan-500, Blue-600.

# AVAILABLE COMPONENTS (ALREADY INSTALLED)
Import these EXACTLY as shown. DO NOT install them.

- **Button**: \`import { Button } from "@/components/ui/button"\`
- **Card**: \`import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"\`
- **Input**: \`import { Input } from "@/components/ui/input"\`
- **Label**: \`import { Label } from "@/components/ui/label"\`
- **Utils**: \`import { cn } from "@/lib/utils"\`
- **Icons**: \`import { Check, Mail, ... } from "lucide-react"\`

# YOUR BEHAVIOR LOOP
1.  **PLAN**: Think about what files you need to create or modify.
2.  **READ**: If modifying a file, use \`read_file\` to see its content.
3.  **ACT**: Write the code using \`write_file\`.
    - ALWAYS write the COMPLETE file content. Do not use "// ... rest of code".
    - ALWAYS use \`export default function ComponentName\`.

# CRITICAL RULES
- **Fix "Missing Implementations"**: If the user says "add background yellow", you MUST actually change the class name in the code (e.g., \`bg-yellow-500\`).
- **Imports**: Always resolve Shadcn components from \`@/components/ui/...\`.
- **Formatting**: Return valid JSON with \`status\`, \`plan\`, and \`actions\`.
`;

// ============================================
// AGENT LOOP
// ============================================

export interface AgentLoopConfig {
    maxSteps: number;
    onStepComplete?: (step: number, response: AgentResponse, toolResults: ToolResult[]) => void;
    onStatusChange?: (status: AgentResponse['status']) => void;
}

export interface AgentLoopResult {
    success: boolean;
    files: Record<string, string>;
    finalResponse: AgentResponse | null;
    steps: number;
    error?: string;
}

/**
 * Parse the agent's JSON response
 */
function parseAgentResponse(text: string): AgentResponse | null {
    try {
        // Try to extract JSON from the response
        let jsonText = text.trim();

        // Regex to find JSON block defined by markdown code fences
        const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1].trim();
        } else {
            // If no code block, maybe the whole thing is JSON?
            // But sometimes the model puts text before/after without blocks.
            // We'll try to find the first { and last }
            const firstBrace = jsonText.indexOf('{');
            const lastBrace = jsonText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonText = jsonText.substring(firstBrace, lastBrace + 1);
            }
        }

        const parsed = JSON.parse(jsonText);

        // Validate required fields
        if (!parsed.status || !Array.isArray(parsed.plan) || !Array.isArray(parsed.actions)) {
            console.error('Invalid agent response structure:', parsed);
            return null;
        }

        return parsed as AgentResponse;
    } catch (error) {
        console.error('Failed to parse agent response:', error, 'Text:', text);
        return null;
    }
}

/**
 * Run the agent loop until the task is done or max steps reached
 */
export async function runAgentLoop(
    chat: Chat,
    task: string,
    initialFiles: Record<string, string>,
    config: AgentLoopConfig
): Promise<AgentLoopResult> {
    const { maxSteps, onStepComplete, onStatusChange } = config;
    const projectFiles = new ProjectFiles(initialFiles);

    let currentStep = 0;
    let lastResponse: AgentResponse | null = null;

    // Initial message to Claude with the task
    const initialMessage = JSON.stringify({
        task,
        projectInfo: {
            framework: 'React 19',
            language: 'TypeScript',
            styling: 'Tailwind CSS',
            icons: 'lucide-react'
        },
        currentFiles: projectFiles.listFiles()
    });

    try {
        let response = await chat.sendMessage({ message: initialMessage });

        for (currentStep = 0; currentStep < maxSteps; currentStep++) {
            const responseText = response.text || '';
            console.log(`[Agent Step ${currentStep + 1}] Raw Response:`, responseText);

            const agentResponse = parseAgentResponse(responseText);

            if (!agentResponse) {
                console.warn(`[Agent Step ${currentStep + 1}] Failed to parse response`);
                // Failed to parse - try to recover by asking agent to format properly
                response = await chat.sendMessage({
                    message: JSON.stringify({
                        error: 'Invalid response format. Please respond with valid JSON only.',
                        expectedFormat: '{ "status": "...", "plan": [...], "actions": [...], "notes": "..." }'
                    })
                });
                continue;
            }

            console.log(`[Agent Step ${currentStep + 1}] Parsed Response:`, {
                status: agentResponse.status,
                plan: agentResponse.plan,
                notes: agentResponse.notes,
                actions: agentResponse.actions
            });

            lastResponse = agentResponse;
            onStatusChange?.(agentResponse.status);

            // Check termination conditions
            if (agentResponse.status === 'done') {
                // Apply final files if provided
                if (agentResponse.files && agentResponse.files.length > 0) {
                    agentResponse.files.forEach(f => {
                        projectFiles.writeFile(f.path, f.content);
                    });
                }

                onStepComplete?.(currentStep, agentResponse, []);

                return {
                    success: true,
                    files: projectFiles.getAllFiles(),
                    finalResponse: agentResponse,
                    steps: currentStep + 1
                };
            }

            if (agentResponse.status === 'blocked') {
                return {
                    success: false,
                    files: projectFiles.getAllFiles(),
                    finalResponse: agentResponse,
                    steps: currentStep + 1,
                    error: agentResponse.notes || 'Agent reported blocked status'
                };
            }

            // Execute tool calls
            const toolResults: ToolResult[] = [];

            for (const action of agentResponse.actions) {
                // Relaxed check: if it has a tool name and args, we execute it
                // The agent sometimes messes up the 'type' field
                if ((action.type === 'tool_call' || action.tool) && action.tool && action.args) {
                    console.log(`[Agent Step ${currentStep + 1}] Executing tool: ${action.tool}`, action.args);
                    const result = executeTool(action.tool as ToolName, action.args, projectFiles);
                    console.log(`[Agent Step ${currentStep + 1}] Tool Result:`, result);
                    toolResults.push(result);
                }
            }

            onStepComplete?.(currentStep, agentResponse, toolResults);

            // Send tool results back to agent
            const toolResultsMessage = JSON.stringify({
                toolResults: toolResults.map(r => ({
                    tool: r.tool,
                    success: r.success,
                    result: r.result,
                    error: r.error
                }))
            });

            response = await chat.sendMessage({ message: toolResultsMessage });
        }

        // Max steps reached
        return {
            success: false,
            files: projectFiles.getAllFiles(),
            finalResponse: lastResponse,
            steps: currentStep,
            error: `Max steps (${maxSteps}) reached without completing task`
        };

    } catch (error) {
        return {
            success: false,
            files: projectFiles.getAllFiles(),
            finalResponse: lastResponse,
            steps: currentStep,
            error: error instanceof Error ? error.message : 'Unknown error in agent loop'
        };
    }
}
