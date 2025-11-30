# Chimera Protocol - Frontend

A neural-themed AI memory management system with 3D brain visualization. Built with React, TypeScript, and Three.js.

![Chimera Protocol](https://img.shields.io/badge/Chimera-Protocol-cyan)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🧠 Features

- **3D Brain Visualization** - Interactive Three.js brain showing connected AI models as glowing nodes
- **Multi-Model Chat** - Chat with OpenAI, Anthropic, Google, and DeepSeek models
- **Memory Management** - Create, edit, search, and inject memories into conversations
- **Workspace System** - Isolated workspaces for different projects
- **Team Collaboration** - Invite members to workspaces with role-based access
- **Memory Injection** - Inject context from stored memories into AI conversations
- **Dark Neural Theme** - Cyberpunk-inspired UI with cyan/purple accents

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend server running (see [Backend Repository](../Chimera_Protocol_Mad_Scientist))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chimera-frontend.git
cd chimera-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your backend URL

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Button, Modal, Input)
│   ├── brain/          # 3D brain visualization
│   ├── animations/     # Animation components
│   └── layout/         # Layout components (Navbar, Sidebar)
├── pages/              # Route pages
│   ├── Dashboard.tsx   # Main dashboard with 3D brain
│   ├── Chat.tsx        # Conversation interface
│   ├── Memories.tsx    # Memory management
│   └── Settings.tsx    # User settings
├── stores/             # Zustand state stores
│   ├── authStore.ts    # Authentication state
│   ├── chatStore.ts    # Conversation state
│   ├── memoryStore.ts  # Memory state
│   └── workspaceStore.ts
├── lib/                # Utilities and API client
│   └── api.ts          # Backend API integration
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## 🎮 Usage

### Dashboard
The main dashboard displays a 3D brain visualization with connected AI models. Each model appears as a glowing node on the brain surface.

### Chat
1. Select a workspace from the sidebar
2. Create a new conversation or select existing
3. Choose an AI model (requires API key configured)
4. Start chatting!

### Memory Injection
1. Open a conversation
2. Click the memory icon in the sidebar
3. Select memories to inject
4. Injected memories provide context to the AI

### Memory Management
- Create memories manually or import from URLs/files
- Search memories by title or content
- Edit and organize with tags
- View embedding visualizations

## 🛠️ Development

```bash
# Run development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual Build
```bash
npm run build
# Deploy dist/ folder to your hosting
```

## 🔧 Configuration

### Tailwind CSS
Custom theme configuration in `tailwind.config.js`:
- Neural color palette (cyan, purple, dark grays)
- Custom animations for glowing effects
- Responsive breakpoints

### Vite
Build configuration in `vite.config.ts`:
- React plugin with SWC
- Path aliases
- Build optimizations

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🔗 Related

- [Backend Repository](../Chimera_Protocol_Mad_Scientist) - Django REST API
- [API Documentation](../Chimera_Protocol_Mad_Scientist/API_DOCUMENTATION.md)
