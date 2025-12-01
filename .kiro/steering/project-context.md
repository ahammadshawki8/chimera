---
inclusion: always
---

# Chimera Protocol Frontend - Project Context

## Overview
Chimera Protocol is a neural-themed AI memory management system with a 3D brain visualization interface. Users can chat with multiple AI models, store memories, and inject context into conversations.

## Key Features
1. **3D Brain Visualization** - Interactive Three.js brain showing connected AI models
2. **Multi-Model Chat** - Support for OpenAI, Anthropic, Google, and DeepSeek
3. **Memory Management** - Create, edit, search, and inject memories
4. **Workspace System** - Isolated workspaces for different projects
5. **Team Collaboration** - Invite members to workspaces

## Architecture
```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Base components (Button, Modal, etc.)
│   ├── brain/     # 3D brain visualization
│   └── animations/# Animation components
├── pages/         # Route pages
├── stores/        # Zustand state stores
├── lib/           # API client and utilities
├── hooks/         # Custom React hooks
└── types/         # TypeScript type definitions
```

## Backend Integration
- API Base URL: Configured via `VITE_API_BASE_URL`
- Authentication: JWT tokens stored in localStorage
- Real-time: Polling-based updates (5-second intervals)

## Design System
- Primary Color: Cyan (#00FFFF)
- Background: Dark gradient (gray-900 to black)
- Accent: Purple/Pink for highlights
- Font: System font stack with monospace for code
