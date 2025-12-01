import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useAuthStore } from '../../stores/authStore';
import { InvitationInbox } from '../features/InvitationInbox';

export function TopBar() {
  const navigate = useNavigate();
  const { getActiveWorkspace } = useWorkspaceStore();
  const { logout, user } = useAuthStore();
  const activeWorkspace = getActiveWorkspace();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className="h-16 bg-lab-panel/95 backdrop-blur-md border-b border-lab-border flex items-center justify-between px-6 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-transparent to-neon-blue/5 pointer-events-none" />
      {/* Left: Logo and Workspace Name */}
      <div className="flex items-center gap-6 relative z-10">
        <Link 
          to={user ? "/app" : "/"} 
          className="text-neon-green font-cyber text-xl hover:text-neon-green/80 transition-colors flex items-center gap-2 focus-visible-ring"
          aria-label={user ? "Chimera Protocol - Go to dashboard" : "Chimera Protocol - Go to home page"}
        >
          <span className="text-2xl" aria-hidden="true">⚡</span>
          <span>CHIMERA</span>
        </Link>
        
        <div className="h-8 w-px bg-neon-green/20" aria-hidden="true" />
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Active Workspace</span>
          <span className="text-sm text-white font-medium" aria-live="polite">
            {activeWorkspace?.name || 'No Workspace'}
          </span>
        </div>
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-6 relative z-10">
        {/* Invitation Inbox */}
        <InvitationInbox />

        <div className="h-8 w-px bg-neon-green/20" aria-hidden="true" />

        {/* User Info and Logout */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 uppercase tracking-wider">User</span>
            <span className="text-sm text-white font-medium">{user?.name || 'Guest'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-neon-green transition-colors rounded hover:bg-neon-green/10"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
