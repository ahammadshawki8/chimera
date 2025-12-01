# Chimera Frontend MCP Integration

## Overview
The frontend integrates with the backend MCP tools to provide a visual interface for memory management.

## Memory Management UI

### Memory List (`/memories`)
- Display all memories in current workspace
- Search memories by title/content
- Sort by recent, alphabetical
- Visual embedding signature display

### Memory Creation
- Manual creation via form
- Auto-extraction from conversations (on close)
- Import from URL (web scraping)
- Import from file (PDF, TXT, MD)

### Memory Injection
- Select memories from sidebar in chat
- Click to inject into current conversation
- Visual animation shows injection process
- Toggle active/inactive state

## API Integration

### Memory Store (`src/stores/memoryStore.ts`)
```typescript
interface MemoryState {
  memories: Memory[];
  loadMemories: (workspaceId: string) => Promise<void>;
  createMemory: (data: CreateMemoryData) => Promise<void>;
  searchMemories: (query: string) => Promise<Memory[]>;
}
```

### Chat Integration (`src/stores/chatStore.ts`)
```typescript
// Inject memory into conversation
injectMemory: async (conversationId: string, memoryId: string) => {
  await conversationApi.injectMemory(conversationId, memoryId);
}

// Toggle memory active state
toggleInjectedMemory: async (conversationId: string, memoryId: string) => {
  await conversationApi.toggleInjectedMemory(conversationId, memoryId);
}
```

## Visual Components

### MemoryInjectionAnimation
6-stage animation showing memory injection:
1. Initializing neural link
2. Extracting memory patterns
3. Encoding context vectors
4. Establishing synaptic bridge
5. Injecting memory fragments
6. Integration complete

### Memory Card
- Title and snippet preview
- Tags display
- Embedding visualization (waveform)
- Action buttons (edit, delete, inject)
