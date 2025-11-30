import type { Workspace, Memory, Conversation, Message, TeamMember, Integration, User, TimeSeriesData } from '../types';
import type { ActivityItem } from '../components/features/ActivityFeed';

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: 'user-1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@chimera.lab',
    avatar: undefined,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    name: 'Marcus Rodriguez',
    email: 'marcus.r@chimera.lab',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'user-3',
    name: 'Yuki Tanaka',
    email: 'yuki.t@chimera.lab',
    createdAt: new Date('2024-02-10'),
  },
];

// Dummy Workspaces
export const dummyWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'Project Chimera Alpha',
    description: 'Primary research workspace for multi-model cognitive fusion experiments',
    ownerId: 'user-1',
    members: [],
    stats: {
      totalMemories: 247,
      totalEmbeddings: 1893,
      totalConversations: 42,
      systemLoad: 67,
      lastActivity: new Date('2024-11-28T10:30:00'),
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-28T10:30:00'),
  },
  {
    id: 'workspace-2',
    name: 'Neural Net Optimizers',
    description: 'Advanced neural architecture optimization and training protocols',
    ownerId: 'user-1',
    members: [],
    stats: {
      totalMemories: 156,
      totalEmbeddings: 982,
      totalConversations: 28,
      systemLoad: 43,
      lastActivity: new Date('2024-11-27T15:45:00'),
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-11-27T15:45:00'),
  },
  {
    id: 'workspace-3',
    name: 'Deep Sea Research',
    description: 'Oceanic data analysis and marine biology cognitive modeling',
    ownerId: 'user-1',
    members: [],
    stats: {
      totalMemories: 89,
      totalEmbeddings: 534,
      totalConversations: 15,
      systemLoad: 22,
      lastActivity: new Date('2024-11-26T09:15:00'),
    },
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-26T09:15:00'),
  },
];

// Dummy Memories
export const dummyMemories: Memory[] = [
  {
    id: 'memory-1',
    workspaceId: 'workspace-1',
    title: 'Cognitive Fusion Protocols',
    content: 'The primary protocol for fusing multiple AI models involves establishing a shared semantic space through unified embeddings. Each model maintains its unique reasoning patterns while accessing a common memory substrate. Key considerations include context window management, embedding dimensionality alignment, and cross-model attention mechanisms.',
    snippet: 'The primary protocol for fusing multiple AI models involves establishing a shared semantic space through unified embeddings...',
    tags: ['protocol', 'fusion', 'architecture'],
    embedding: undefined,
    metadata: {
      source: 'research-notes',
    },
    createdAt: new Date('2024-11-20T14:22:00'),
    updatedAt: new Date('2024-11-20T14:22:00'),
    version: 1,
  },
  {
    id: 'memory-2',
    workspaceId: 'workspace-1',
    title: 'Emergent Synapse Firing',
    content: 'Observed phenomenon where multiple models simultaneously activate related concepts without explicit coordination. This suggests the emergence of a meta-cognitive layer above individual model architectures. Requires further investigation into cross-model attention patterns and shared representation spaces.',
    snippet: 'Observed phenomenon where multiple models simultaneously activate related concepts without explicit coordination...',
    tags: ['research', 'emergence', 'synapse'],
    embedding: undefined,
    metadata: {
      conversationId: 'conv-1',
      modelUsed: 'gpt-4o',
    },
    createdAt: new Date('2024-11-22T09:15:00'),
    updatedAt: new Date('2024-11-22T09:15:00'),
    version: 1,
  },
  {
    id: 'memory-3',
    workspaceId: 'workspace-1',
    title: 'Sector 7 Access Codes',
    content: 'Authorization protocols for restricted neural network access: ALPHA-7-TANGO-WHISKEY. Secondary authentication requires biometric verification and temporal token rotation every 3600 seconds. Emergency override: CHIMERA-PRIME-OMEGA.',
    snippet: 'Authorization protocols for restricted neural network access: ALPHA-7-TANGO-WHISKEY...',
    tags: ['security', 'access', 'classified'],
    embedding: undefined,
    metadata: {
      source: 'security-vault',
    },
    createdAt: new Date('2024-11-18T16:45:00'),
    updatedAt: new Date('2024-11-18T16:45:00'),
    version: 1,
  },
  {
    id: 'memory-4',
    workspaceId: 'workspace-1',
    title: 'Memory Injection Optimization',
    content: 'Best practices for injecting memories into active conversations: 1) Prioritize recent and relevant memories, 2) Maintain context window efficiency, 3) Use semantic similarity scoring, 4) Implement gradual memory decay for older entries, 5) Monitor token usage to prevent overflow.',
    snippet: 'Best practices for injecting memories into active conversations: 1) Prioritize recent and relevant memories...',
    tags: ['optimization', 'injection', 'best-practices'],
    embedding: undefined,
    metadata: {},
    createdAt: new Date('2024-11-25T11:30:00'),
    updatedAt: new Date('2024-11-25T11:30:00'),
    version: 1,
  },
  {
    id: 'memory-5',
    workspaceId: 'workspace-1',
    title: 'Neural Load Balancing',
    content: 'Strategies for distributing cognitive load across multiple models: Round-robin allocation for general queries, specialized routing for domain-specific tasks, dynamic load monitoring with automatic failover, and cost optimization through model selection heuristics.',
    snippet: 'Strategies for distributing cognitive load across multiple models: Round-robin allocation for general queries...',
    tags: ['performance', 'load-balancing', 'optimization'],
    embedding: undefined,
    metadata: {},
    createdAt: new Date('2024-11-23T13:20:00'),
    updatedAt: new Date('2024-11-23T13:20:00'),
    version: 1,
  },
];

// Dummy Team Members
export const dummyTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    userId: 'user-1',
    workspaceId: 'workspace-1',
    role: 'admin',
    status: 'online',
    joinedAt: new Date('2024-01-15'),
  },
  {
    id: 'team-2',
    userId: 'user-2',
    workspaceId: 'workspace-1',
    role: 'researcher',
    status: 'away',
    joinedAt: new Date('2024-02-01'),
  },
  {
    id: 'team-3',
    userId: 'user-3',
    workspaceId: 'workspace-1',
    role: 'observer',
    status: 'offline',
    joinedAt: new Date('2024-02-10'),
  },
];

// Dummy Conversations
export const dummyConversations: Conversation[] = [
  {
    id: 'conv-1',
    workspaceId: 'workspace-1',
    title: 'Cognitive Architecture Discussion',
    modelId: 'model-gpt4o',
    messages: [],
    injectedMemories: [{ id: 'memory-1', isActive: true }, { id: 'memory-2', isActive: true }],
    status: 'active',
    createdAt: new Date('2024-11-27T10:00:00'),
    updatedAt: new Date('2024-11-27T14:30:00'),
  },
  {
    id: 'conv-2',
    workspaceId: 'workspace-1',
    title: 'Memory Optimization Strategies',
    modelId: 'model-claude',
    messages: [],
    injectedMemories: [{ id: 'memory-4', isActive: true }],
    status: 'active',
    createdAt: new Date('2024-11-26T09:15:00'),
    updatedAt: new Date('2024-11-26T16:45:00'),
  },
];

// Dummy Messages
export const dummyMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    role: 'user',
    content: 'Can you explain the cognitive fusion protocols we\'ve been developing?',
    timestamp: new Date('2024-11-27T10:00:00'),
    isPinned: false,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    role: 'assistant',
    content: 'Based on the Cognitive Fusion Protocols memory, the primary approach involves establishing a shared semantic space through unified embeddings. This allows multiple AI models to maintain their unique reasoning patterns while accessing a common memory substrate. The key technical considerations include managing context windows, aligning embedding dimensionality across different model architectures, and implementing cross-model attention mechanisms.',
    timestamp: new Date('2024-11-27T10:01:30'),
    isPinned: false,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    role: 'user',
    content: 'What about the emergent synapse firing phenomenon we observed?',
    timestamp: new Date('2024-11-27T10:05:00'),
    isPinned: true,
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    role: 'assistant',
    content: 'The emergent synapse firing is a fascinating observation. We\'ve noticed that multiple models simultaneously activate related concepts without explicit coordination, suggesting the emergence of a meta-cognitive layer above individual model architectures. This requires further investigation into cross-model attention patterns and how shared representation spaces enable this spontaneous coordination.',
    timestamp: new Date('2024-11-27T10:06:45'),
    isPinned: false,
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    role: 'user',
    content: 'What are the best practices for memory injection?',
    timestamp: new Date('2024-11-26T09:15:00'),
    isPinned: false,
  },
  {
    id: 'msg-6',
    conversationId: 'conv-2',
    role: 'assistant',
    content: 'According to our Memory Injection Optimization guidelines, the best practices include: 1) Prioritizing recent and relevant memories, 2) Maintaining context window efficiency, 3) Using semantic similarity scoring for selection, 4) Implementing gradual memory decay for older entries, and 5) Monitoring token usage to prevent overflow. These strategies ensure optimal performance while maximizing the utility of injected memories.',
    timestamp: new Date('2024-11-26T09:16:30'),
    isPinned: false,
  },
];

// Dummy Integrations - All connected by default for demo
export const dummyIntegrations: Integration[] = [
  {
    id: 'int-1',
    userId: 'user-1',
    provider: 'openai',
    apiKey: 'sk-demo-openai-key-xxxxxxxxxxxxx',
    status: 'connected',
    lastTested: new Date('2024-11-28T09:00:00'),
  },
  {
    id: 'int-2',
    userId: 'user-1',
    provider: 'anthropic',
    apiKey: 'sk-ant-demo-key-xxxxxxxxxxxxx',
    status: 'connected',
    lastTested: new Date('2024-11-28T09:00:00'),
  },
  {
    id: 'int-3',
    userId: 'user-1',
    provider: 'google',
    apiKey: 'AIza-demo-google-key-xxxxxxxxxxxxx',
    status: 'connected',
    lastTested: new Date('2024-11-28T09:00:00'),
  },
];

// Update workspace members
dummyWorkspaces[0].members = dummyTeamMembers.filter(m => m.workspaceId === 'workspace-1');
dummyWorkspaces[1].members = [];
dummyWorkspaces[2].members = [];

// Update conversation messages
dummyConversations[0].messages = dummyMessages.filter(m => m.conversationId === 'conv-1');
dummyConversations[1].messages = dummyMessages.filter(m => m.conversationId === 'conv-2');

// Dummy Neural Load Data (last 24 data points)
export const dummyNeuralLoadData: TimeSeriesData[] = Array.from({ length: 24 }, (_, i) => {
  const now = new Date();
  const timestamp = new Date(now.getTime() - (23 - i) * 5 * 60 * 1000); // 5-minute intervals
  
  // Generate realistic load pattern with some variation
  const baseLoad = 45 + Math.sin(i / 4) * 20;
  const noise = (Math.random() - 0.5) * 10;
  const value = Math.max(10, Math.min(90, baseLoad + noise));
  
  return {
    timestamp,
    value: Math.round(value),
  };
});

// Dummy Activity Feed Data
export const dummyActivities: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'success',
    message: 'Memory "Cognitive Fusion Protocols" successfully embedded with 1536-dimensional vector',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: 'activity-2',
    type: 'info',
    message: 'New conversation initiated with GPT-4O model in Left Cortex',
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
  },
  {
    id: 'activity-3',
    type: 'success',
    message: 'Workspace synchronization completed. 247 memories indexed.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: 'activity-4',
    type: 'warning',
    message: 'System load approaching 70%. Consider optimizing memory injection frequency.',
    timestamp: new Date(Date.now() - 23 * 60 * 1000), // 23 minutes ago
  },
  {
    id: 'activity-5',
    type: 'info',
    message: 'Team member Marcus Rodriguez joined workspace',
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
  },
  {
    id: 'activity-6',
    type: 'success',
    message: 'API key validation successful for Anthropic Claude 3.5',
    timestamp: new Date(Date.now() - 47 * 60 * 1000), // 47 minutes ago
  },
  {
    id: 'activity-7',
    type: 'info',
    message: 'Memory injection protocol activated for conversation #42',
    timestamp: new Date(Date.now() - 62 * 60 * 1000), // 1 hour ago
  },
  {
    id: 'activity-8',
    type: 'error',
    message: 'Failed to connect to Google Gemini 2.5. API key may be invalid.',
    timestamp: new Date(Date.now() - 78 * 60 * 1000), // 1 hour 18 minutes ago
  },
  {
    id: 'activity-9',
    type: 'success',
    message: 'Neural weight calibration completed. System performance optimized.',
    timestamp: new Date(Date.now() - 95 * 60 * 1000), // 1 hour 35 minutes ago
  },
  {
    id: 'activity-10',
    type: 'info',
    message: 'Backup protocol initiated. Exporting workspace data to secure storage.',
    timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
  },
];
