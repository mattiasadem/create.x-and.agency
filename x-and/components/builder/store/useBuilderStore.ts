import { create } from 'zustand';

export interface BuildStep {
    id: number;
    label: string;
    thoughts?: string[]; // Agent's detailed plan/thoughts for this step
    status: 'pending' | 'active' | 'complete';
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    image?: string;
    timestamp: Date;
}

interface BuilderState {
    // Project State
    files: Record<string, string>;
    setFiles: (files: Record<string, string>) => void;
    updateFile: (path: string, content: string) => void;

    // Build Process State
    isBuilding: boolean;
    setIsBuilding: (isBuilding: boolean) => void;
    steps: BuildStep[];
    setSteps: (steps: BuildStep[]) => void;
    addStep: (step: BuildStep) => void;
    updateStep: (id: number, updates: Partial<BuildStep>) => void;

    // Chat State
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;

    // UI State
    view: 'code' | 'preview' | 'split';
    setView: (view: 'code' | 'preview' | 'split') => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
    // Project State
    files: {},
    setFiles: (files) => set({ files }),
    updateFile: (path, content) =>
        set((state) => ({ files: { ...state.files, [path]: content } })),

    // Build Process State
    isBuilding: false,
    setIsBuilding: (isBuilding) => set({ isBuilding }),
    steps: [],
    setSteps: (steps) => set({ steps }),
    addStep: (step) => set((state) => ({ steps: [...state.steps, step] })),
    updateStep: (id, updates) =>
        set((state) => ({
            steps: state.steps.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

    // Chat State
    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

    // UI State
    view: 'preview',
    setView: (view) => set({ view }),
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
