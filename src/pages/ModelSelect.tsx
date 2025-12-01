import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntegrationStore } from '../stores/integrationStore';
import { useChatStore } from '../stores/chatStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { CyberSpinner } from '../components/ui';
import { ArrowLeft } from 'lucide-react';
import type { CognitiveModel } from '../types';

// Lazy load the 3D brain visualization for better performance
const BrainVisualization = lazy(() => import('../components/brain/BrainVisualization'));

export default function ModelSelect() {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);
  const [models, setModels] = useState<CognitiveModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const getConnectedModels = useIntegrationStore(state => state.getConnectedModels);
  const createConversation = useChatStore(state => state.createConversation);
  const { getActiveWorkspace } = useWorkspaceStore();
  
  const activeWorkspace = getActiveWorkspace();

  // Load connected models
  useEffect(() => {
    const loadModels = async () => {
      setIsLoadingModels(true);
      try {
        const connectedModels = await getConnectedModels();
        setModels(connectedModels);
      } catch (error) {
        console.error('Failed to load models:', error);
        setModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    loadModels();
  }, [getConnectedModels]);

  const handleModelSelect = async (modelId: string) => {
    if (!activeWorkspace || isInitializing) return;
    
    setIsInitializing(true);
    
    try {
      // Simulate initialization delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new conversation with the selected model
      const conversationId = await createConversation(activeWorkspace.id, modelId);
      
      // Navigate to the chat interface
      navigate(`/app/chat/${conversationId}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      setIsInitializing(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="scanlines h-full w-full" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-8 animate-fade-in">
        <button
          onClick={handleReturnToDashboard}
          className="flex items-center gap-2 text-neon-green hover:text-white transition-all duration-200 hover-glow mb-6"
          disabled={isInitializing}
        >
          <ArrowLeft size={20} />
          <span>Return to Dashboard</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neon-green mb-2 text-glow-md">
            Select Cognitive Model
          </h1>
          <p className="text-gray-400 text-sm">
            Injects shared memories into selected LLM runtime
          </p>
        </div>
      </div>

      {/* 3D Brain Visualization */}
      <div className="relative h-[600px] w-full">
        {isLoadingModels ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <CyberSpinner size="lg" variant="ring" />
              <p className="text-neon-green mt-4 font-mono text-sm animate-pulse">
                Loading Neural Interface...
              </p>
            </div>
          </div>
        ) : (
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <CyberSpinner size="lg" variant="ring" />
                <p className="text-neon-green mt-4 font-mono text-sm animate-pulse">
                  Loading Neural Interface...
                </p>
              </div>
            </div>
          }>
            <BrainVisualization
              models={models}
              onModelSelect={handleModelSelect}
            />
          </Suspense>
        )}
      </div>

      {/* Footer Status */}
      <div className="relative z-10 p-8 animate-slide-up">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-black/90 border-2 border-neon-green angular-frame px-6 py-3 shadow-neon">
            <div className="w-2 h-2 bg-neon-green rounded-full pulse-subtle" />
            <span className="text-neon-green font-mono text-sm">
              {isInitializing ? 'Initializing Connection...' : 'Memory Injection Protocol: Ready'}
            </span>
            {isInitializing && <CyberSpinner size="sm" variant="pulse" />}
          </div>
        </div>
      </div>

      {/* No models warning - only show after loading completes */}
      {!isLoadingModels && models.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-20 animate-fade-in bg-black/80">
          <div className="bg-black/95 border-2 border-error-red angular-frame px-8 py-6 max-w-md text-center shadow-neon-pink">
            <h2 className="text-error-red font-cyber font-bold text-xl mb-3 uppercase">
              No Models Connected
            </h2>
            <p className="text-gray-300 mb-6 text-sm">
              Please configure at least one API key in the Integrations page to enable model selection.
            </p>
            <button
              onClick={() => navigate('/app/integrations')}
              className="bg-error-red hover:bg-error-red/80 text-white px-6 py-3 angular-frame transition-all duration-200 hover:shadow-neon-pink font-bold uppercase tracking-wider"
            >
              Go to Integrations
            </button>
          </div>
        </div>
      )}
      
      {/* Initializing overlay */}
      {isInitializing && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-black/90 border-2 border-neon-green angular-frame px-12 py-8 text-center shadow-neon">
            <CyberSpinner size="lg" variant="ring" className="mb-4 mx-auto" />
            <p className="text-neon-green font-mono text-sm text-glow-sm">
              Establishing Neural Link...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
