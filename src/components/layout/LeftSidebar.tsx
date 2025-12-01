import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Database, 
  Users, 
  Plug, 
  Terminal, 
  Settings,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useWorkspaceStore } from '../../stores/workspaceStore';

interface LeftSidebarProps {
  onNewWorkspace?: () => void;
}

export function LeftSidebar({ onNewWorkspace }: LeftSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore();

  const handleWorkspaceSwitch = (workspaceId: string) => {
    // Navigate immediately to the new workspace
    navigate(`/app/workspace/${workspaceId}`);
    // Then trigger the transition animation
    setActiveWorkspace(workspaceId);
  };

  const navigationItems = [
    { path: `/app/workspace/${activeWorkspaceId || 'workspace-1'}`, icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/chat', icon: MessageSquare, label: 'Neural Chat' },
    { path: '/app/memories', icon: Database, label: 'Memory Bank' },
    { path: '/app/team', icon: Users, label: 'Team' },
    { path: '/app/integrations', icon: Plug, label: 'Integrations' },
    { path: '/app/dev', icon: Terminal, label: 'Console' },
    { path: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <aside 
      className="w-60 bg-lab-panel/95 backdrop-blur-md border-r border-lab-border flex flex-col h-full relative overflow-hidden"
      aria-label="Main navigation sidebar"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 via-transparent to-neon-blue/5 pointer-events-none" />
      {/* Workspaces Section */}
      <div className="p-4 border-b border-lab-border relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-cyber text-neon-green/70 uppercase tracking-wider">
            Workspaces
          </h3>
          <button
            onClick={onNewWorkspace}
            className="p-1 hover:bg-neon-green/10 rounded transition-colors focus-visible-ring"
            title="Create new workspace"
            aria-label="Create new workspace"
          >
            <Plus className="w-4 h-4 text-neon-green" aria-hidden="true" />
          </button>
        </div>
        
        <div className="space-y-1" role="group" aria-label="Workspace list">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => handleWorkspaceSwitch(workspace.id)}
              aria-label={`Switch to ${workspace.name} workspace`}
              aria-current={activeWorkspaceId === workspace.id ? 'true' : 'false'}
              className={`
                w-full text-left px-3 py-2 rounded text-sm transition-all focus-visible-ring relative overflow-hidden
                ${activeWorkspaceId === workspace.id
                  ? 'bg-gradient-to-r from-neon-green/10 to-neon-blue/10 text-neon-green border border-neon-green/30 shadow-sm'
                  : 'text-gray-400 hover:bg-lab-panel hover:text-neon-green border border-transparent hover:border-lab-border'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{workspace.name}</span>
                {activeWorkspaceId === workspace.id && (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-4 overflow-y-auto relative z-10" aria-label="Main navigation">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded transition-all text-sm focus-visible-ring relative group
                  ${active
                    ? 'bg-gradient-to-r from-neon-green/10 to-transparent text-neon-green border-l-2 border-neon-green'
                    : 'text-gray-400 hover:bg-lab-panel hover:text-neon-green border-l-2 border-transparent hover:border-neon-green/30'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neon-green/20">
        <div className="text-xs text-gray-500 text-center" role="contentinfo">
          Chimera Protocol v1.0
        </div>
      </div>
    </aside>
  );
}
