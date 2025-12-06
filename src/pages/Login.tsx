import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X } from 'lucide-react';
import { CyberButton, CyberInput, CyberCard, Container } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useChatStore } from '../stores/chatStore';
import { useMemoryStore } from '../stores/memoryStore';
import { useInvitationStore } from '../stores/invitationStore';
import { realtimeService } from '../lib/realtime';

export default function Login() {
  const navigate = useNavigate();
  const { login, error, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(true);

  // Check if session was invalidated (another user logged in on different tab)
  useEffect(() => {
    const wasInvalidated = sessionStorage.getItem('session_invalidated');
    if (wasInvalidated) {
      setSessionMessage('Your session was ended because another user logged in on this browser.');
      sessionStorage.removeItem('session_invalidated');
    }
  }, []);

  // Clear all data when login page is loaded to prevent data leakage
  useEffect(() => {
    // Stop any existing polling
    realtimeService.disconnect();
    
    // Clear all stores
    useWorkspaceStore.setState({
      workspaces: [],
      activeWorkspaceId: null,
      previousWorkspaceId: null,
      isTransitioning: false,
      transitionProgress: 0,
      isLoading: false,
    });
    
    useChatStore.setState({
      conversations: [],
      activeConversationId: null,
      autoStore: true,
      isLoading: false,
    });
    
    useMemoryStore.setState({
      memories: [],
      searchQuery: '',
      sortBy: 'recent',
      selectedMemoryId: null,
      isLoading: false,
    });
    
    useInvitationStore.setState({
      invitations: [],
      isLoading: false,
    });
    
    // Clear any stale tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Redirect to /app which will load workspaces and redirect to first one
      navigate('/app');
    } catch (err) {
      // Error is already set in the store
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative">
      {/* Test Credentials Card - Responsive positioning */}
      {showCredentials && (
        <div className="fixed top-4 right-4 md:absolute md:top-4 md:right-4 bg-deep-teal/80 backdrop-blur-sm border border-neon-green/30 rounded-lg p-3 md:p-4 max-w-[200px] md:max-w-xs z-50 shadow-lg shadow-neon-green/10">
          <button
            onClick={() => setShowCredentials(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-neon-green transition-colors"
            aria-label="Close credentials card"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-neon-green text-xs md:text-sm font-bold mb-2 pr-4">Test Credentials</h3>
          <div className="text-gray-300 text-[10px] md:text-xs space-y-1">
            <p><span className="text-gray-500">Email:</span> mumti@gmail.com</p>
            <p><span className="text-gray-500">Password:</span> mumtiomumtio</p>
          </div>
          <p className="text-yellow-400/80 text-[10px] md:text-xs mt-2 md:mt-3 italic">
            Note: First login may take a moment while the server wakes up.
          </p>
        </div>
      )}

      <Container maxWidth="md">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <Lock className="w-16 h-16 text-neon-green" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-neon-green font-cyber">
            Access Terminal
          </h1>
          <p className="text-gray-400">
            Establish connection to the Chimera Protocol
          </p>
        </div>

        <CyberCard>
          <div className="space-y-6 p-8">
            <div>
              <label className="block text-neon-green text-sm font-medium mb-2">
                Email Address
              </label>
              <CyberInput
                type="email"
                placeholder="user@chimera.io"
                value={email}
                onChange={setEmail}
              />
            </div>
            
            <div>
              <label className="block text-neon-green text-sm font-medium mb-2">
                Password
              </label>
              <CyberInput
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={setPassword}
              />
            </div>

            {sessionMessage && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 text-yellow-400 text-sm">
                {sessionMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}. Please enter valid credentials.
              </div>
            )}

            <CyberButton
              variant="primary"
              size="lg"
              onClick={handleLogin}
              className="w-full"
            >
              Establish Connection
            </CyberButton>

            <div className="text-center">
              <button
                onClick={() => navigate('/auth/signup')}
                className="text-neon-green hover:text-neon-green/80 transition-colors"
              >
                Create ID →
              </button>
            </div>
          </div>
        </CyberCard>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to Landing
          </button>
        </div>
      </Container>
    </div>
  );
}
