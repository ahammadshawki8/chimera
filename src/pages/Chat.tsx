import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Database, Zap } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useMemoryStore } from '../stores/memoryStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { ChatMessage } from '../components/features/ChatMessage';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberCard } from '../components/ui/CyberCard';
import { SynapseSpark } from '../components/animations/SynapseSpark';
import { MemoryInjectionAnimation } from '../components/animations/MemoryInjectionAnimation';

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  
  const [messageInput, setMessageInput] = useState('');
  const [sparkTrigger, setSparkTrigger] = useState<string | null>(null);
  const [injectingMemory, setInjectingMemory] = useState<{ id: string; title: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    getConversationById,
    sendMessage,
    pinMessage,
    unpinMessage,
    deleteMessage,
    injectMemory,
    autoStore,
    setAutoStore,
    getMessageById,
  } = useChatStore();

  const { getMemoriesByWorkspace, getMemoryById } = useMemoryStore();
  const { getActiveWorkspace } = useWorkspaceStore();

  const conversation = conversationId ? getConversationById(conversationId) : null;
  const activeWorkspace = getActiveWorkspace();
  const workspaceMemories = activeWorkspace ? getMemoriesByWorkspace(activeWorkspace.id) : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <CyberCard title="Conversation Not Found" glowBorder>
          <p className="text-gray-400 mb-4">The requested conversation could not be found.</p>
          <CyberButton onClick={() => navigate('/app/workspace/' + activeWorkspace?.id)}>
            Return to Dashboard
          </CyberButton>
        </CyberCard>
      </div>
    );
  }

  // Memoize handlers to prevent unnecessary re-renders
  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() && conversationId) {
      sendMessage(conversationId, messageInput.trim());
      setMessageInput('');
    }
  }, [messageInput, conversationId, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handlePinMessage = useCallback((messageId: string) => {
    const message = getMessageById(messageId);
    if (message?.isPinned) {
      unpinMessage(messageId);
    } else {
      pinMessage(messageId);
    }
  }, [getMessageById, unpinMessage, pinMessage]);

  const handleCopyMessage = useCallback((messageId: string) => {
    // Copy functionality is handled in ChatMessage component
    console.log('Message copied:', messageId);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId);
    }
  }, [deleteMessage]);

  const handleInjectMemory = useCallback((memoryId: string) => {
    if (conversationId) {
      const memory = getMemoryById(memoryId);
      if (memory) {
        // Show injection animation
        setInjectingMemory({ id: memoryId, title: memory.title });
        
        // Inject memory after a short delay
        setTimeout(() => {
          injectMemory(conversationId, memoryId);
          setSparkTrigger(memoryId);
          setTimeout(() => setSparkTrigger(null), 100);
        }, 300);
      }
    }
  }, [conversationId, injectMemory, getMemoryById]);

  const isMemoryInjected = useCallback((memoryId: string) => {
    return conversation?.injectedMemories.includes(memoryId) || false;
  }, [conversation?.injectedMemories]);

  return (
    <>
      {/* Memory Injection Animation Overlay */}
      <AnimatePresence>
        {injectingMemory && (
          <MemoryInjectionAnimation
            memoryTitle={injectingMemory.title}
            onComplete={() => setInjectingMemory(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
        {/* Conversation Header */}
        <div className="border-b-2 border-deep-teal bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-cyber font-bold text-neon-green uppercase tracking-wider">
                {conversation.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-400">
                  Status: <span className="text-neon-green">{conversation.status}</span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-400">
                  Model: <span className="text-neon-green">{conversation.modelId}</span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-400">
                  {conversation.messages.length} messages
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to={`/app/workspace/${activeWorkspace?.id}`}>
                <CyberButton variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </CyberButton>
              </Link>
              <Link to="/app/memories">
                <CyberButton variant="secondary" size="sm">
                  <Database className="w-4 h-4 mr-2" />
                  Memory Library
                </CyberButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/30 scanlines">
          {conversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Zap className="w-16 h-16 text-neon-green mx-auto mb-4 animate-pulse-glow" />
                <p className="text-gray-400 text-lg">
                  Start a conversation with the cognitive model
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Injected memories will be available in the context
                </p>
              </div>
            </div>
          ) : (
            <>
              {conversation.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onPin={handlePinMessage}
                  onCopy={handleCopyMessage}
                  onDelete={handleDeleteMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input Area */}
        <div className="border-t-2 border-deep-teal bg-black/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="
                  w-full px-4 py-3 bg-black border-2 border-deep-teal
                  text-white font-mono text-sm
                  focus:border-neon-green focus:shadow-neon
                  transition-all duration-300
                  focus:outline-none
                  resize-none
                  angular-frame
                "
                rows={3}
              />
            </div>
            <CyberButton
              variant="primary"
              size="lg"
              glow
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <Send className="w-5 h-5 mr-2" />
              Send
            </CyberButton>
          </div>
          
          {/* Auto-Store Toggle */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-deep-teal/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Auto-Store Memories:</span>
              <button
                onClick={() => setAutoStore(!autoStore)}
                className={`
                  relative w-12 h-6 rounded-full transition-colors duration-300
                  ${autoStore ? 'bg-neon-green' : 'bg-gray-700'}
                `}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 bg-black rounded-full"
                  animate={{ left: autoStore ? '28px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-mono ${autoStore ? 'text-neon-green' : 'text-gray-600'}`}>
                {autoStore ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="text-xs text-gray-600 font-mono">
              {conversation.injectedMemories.length} memories injected
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Injectable Memories */}
      <div className="w-80 border-l-2 border-deep-teal bg-black/50 flex flex-col">
        <div className="p-4 border-b-2 border-deep-teal">
          <h2 className="text-lg font-cyber font-bold text-neon-green uppercase tracking-wider">
            Injectable Memories
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Click to inject into conversation context
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {workspaceMemories.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No memories available</p>
            </div>
          ) : (
            workspaceMemories.map((memory) => {
              const isInjected = isMemoryInjected(memory.id);
              return (
                <div key={memory.id} className="relative">
                  <motion.div
                    className={`
                      p-3 border-2 rounded cursor-pointer
                      transition-all duration-300
                      ${isInjected 
                        ? 'border-neon-green bg-neon-green/10' 
                        : 'border-deep-teal hover:border-neon-green hover:shadow-neon'
                      }
                    `}
                    onClick={() => !isInjected && handleInjectMemory(memory.id)}
                    whileHover={!isInjected ? { scale: 1.02 } : {}}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-neon-green line-clamp-1">
                        {memory.title}
                      </h3>
                      {isInjected && (
                        <Zap className="w-4 h-4 text-neon-green flex-shrink-0" fill="currentColor" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {memory.snippet}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {memory.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-deep-teal/50 text-neon-green rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                  {sparkTrigger === memory.id && <SynapseSpark trigger={true} />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Chat;
