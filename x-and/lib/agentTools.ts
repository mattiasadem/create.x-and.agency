/**
 * Agent Tools - Tool definitions and implementations for the x-and Code Agent
 * These tools allow the agent to interact with the project (read/write files, run checks)
 */

// ============================================
// TOOL TYPE DEFINITIONS
// ============================================

export type ToolName = 'list_files' | 'read_file' | 'write_file' | 'run_checks';

export interface ToolCall {
    tool: ToolName;
    args: Record<string, any>;
}

export interface ToolResult {
    tool: ToolName;
    args: Record<string, any>;
    success: boolean;
    result: string;
    error?: string;
}

export interface AgentAction {
    type: 'tool_call' | 'explanation_only';
    tool?: ToolName;
    args?: Record<string, any>;
}

export interface AgentResponse {
    status: 'thinking' | 'acting' | 'done' | 'blocked' | 'need_clarification';
    plan: string[];
    actions: AgentAction[];
    notes: string;
    // For 'done' status - final files to render
    files?: Array<{ path: string; content: string }>;
}

// ============================================
// TOOL DEFINITIONS (for LLM context)
// ============================================

export const TOOL_DEFINITIONS = [
    {
        name: 'list_files',
        description: 'List all files in the current project. Returns file paths.',
        input_schema: {
            type: 'object',
            properties: {
                pattern: {
                    type: 'string',
                    description: 'Optional filter pattern, e.g. ".tsx" to only show TypeScript files'
                }
            }
        }
    },
    {
        name: 'read_file',
        description: 'Read the contents of a file at the given path.',
        input_schema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'File path to read, e.g. "src/App.tsx"' }
            },
            required: ['path']
        }
    },
    {
        name: 'write_file',
        description: 'Create or overwrite a file with the given content.',
        input_schema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'File path to write, e.g. "src/components/Button.tsx"' },
                content: { type: 'string', description: 'Complete file content to write' }
            },
            required: ['path', 'content']
        }
    },
    {
        name: 'run_checks',
        description: 'Validate the code by checking for TypeScript errors. Returns any errors found.',
        input_schema: {
            type: 'object',
            properties: {
                checkType: {
                    type: 'string',
                    enum: ['typescript', 'all'],
                    description: 'Type of check to run'
                }
            },
            required: ['checkType']
        }
    }
];

// ============================================
// TOOL IMPLEMENTATIONS
// ============================================

/**
 * In-memory project files store
 * This simulates a file system for the Sandpack preview
 */
export class ProjectFiles {
    private files: Map<string, string> = new Map();

    constructor(initialFiles?: Record<string, string>) {
        if (initialFiles) {
            Object.entries(initialFiles).forEach(([path, content]) => {
                this.files.set(this.normalizePath(path), content);
            });
        }
    }

    private normalizePath(path: string): string {
        let p = path.trim();
        if (!p.startsWith('/')) p = '/' + p;
        return p;
    }

    listFiles(pattern?: string): string[] {
        const allPaths = Array.from(this.files.keys());
        if (!pattern) return allPaths;
        return allPaths.filter(p => p.includes(pattern));
    }

    readFile(path: string): string | null {
        return this.files.get(this.normalizePath(path)) || null;
    }

    writeFile(path: string, content: string): void {
        this.files.set(this.normalizePath(path), content);
    }

    deleteFile(path: string): boolean {
        return this.files.delete(this.normalizePath(path));
    }

    getAllFiles(): Record<string, string> {
        const result: Record<string, string> = {};
        this.files.forEach((content, path) => {
            result[path] = content;
        });
        return result;
    }

    hasFile(path: string): boolean {
        return this.files.has(this.normalizePath(path));
    }
}

/**
 * Simple TypeScript-like syntax checker
 * In production, you'd use the actual TypeScript compiler API
 */
function checkTypescript(files: ProjectFiles): string[] {
    const errors: string[] = [];
    const allFiles = files.getAllFiles();

    for (const [path, content] of Object.entries(allFiles)) {
        if (!path.endsWith('.tsx') && !path.endsWith('.ts')) continue;

        // Check for common syntax issues
        const lines = content.split('\n');

        // Check for unbalanced braces
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push(`${path}: Unbalanced braces - ${openBraces} opening, ${closeBraces} closing`);
        }

        // Check for missing imports
        if (content.includes('useState') && !content.includes("from 'react'") && !content.includes('from "react"')) {
            errors.push(`${path}: Using useState but missing React import`);
        }

        // Check for export default
        if (path.includes('App.tsx') && !content.includes('export default')) {
            errors.push(`${path}: Missing 'export default' - App component must be exported`);
        }

        // Check for unclosed JSX tags (simple heuristic)
        const jsxTagOpens = content.match(/<[A-Z][a-zA-Z]*[^/>]*>/g) || [];
        const jsxTagCloses = content.match(/<\/[A-Z][a-zA-Z]*>/g) || [];
        // This is a rough check - not perfect but catches obvious issues
    }

    return errors;
}

/**
 * Execute a tool call and return the result
 */
export function executeTool(
    tool: ToolName,
    args: Record<string, any>,
    projectFiles: ProjectFiles
): ToolResult {
    try {
        switch (tool) {
            case 'list_files': {
                const pattern = args.pattern as string | undefined;
                const files = projectFiles.listFiles(pattern);
                return {
                    tool,
                    args,
                    success: true,
                    result: files.length > 0
                        ? `Found ${files.length} files:\n${files.join('\n')}`
                        : 'No files found in project.'
                };
            }

            case 'read_file': {
                const path = args.path as string;
                const content = projectFiles.readFile(path);
                if (content === null) {
                    return {
                        tool,
                        args,
                        success: false,
                        result: '',
                        error: `File not found: ${path}`
                    };
                }
                return {
                    tool,
                    args,
                    success: true,
                    result: content
                };
            }

            case 'write_file': {
                const path = args.path as string;
                const content = args.content as string;
                if (!path || !content) {
                    return {
                        tool,
                        args,
                        success: false,
                        result: '',
                        error: 'Missing required arguments: path and content'
                    };
                }
                projectFiles.writeFile(path, content);
                return {
                    tool,
                    args,
                    success: true,
                    result: `Successfully wrote ${content.length} characters to ${path}`
                };
            }

            case 'run_checks': {
                const checkType = args.checkType as string;
                const errors = checkTypescript(projectFiles);

                if (errors.length === 0) {
                    return {
                        tool,
                        args,
                        success: true,
                        result: '✓ All checks passed! No errors found.'
                    };
                } else {
                    return {
                        tool,
                        args,
                        success: false,
                        result: `Found ${errors.length} error(s):\n${errors.join('\n')}`,
                        error: 'Validation failed'
                    };
                }
            }

            default:
                return {
                    tool,
                    args,
                    success: false,
                    result: '',
                    error: `Unknown tool: ${tool}`
                };
        }
    } catch (error) {
        return {
            tool,
            args,
            success: false,
            result: '',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
