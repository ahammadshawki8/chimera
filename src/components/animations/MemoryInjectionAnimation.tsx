import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, Brain, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface MemoryInjectionAnimationProps {
  memoryTitle: string;
  onComplete?: () => void;
}

const stages = [
  { text: 'Initializing neural interface...', duration: 600 },
  { text: 'Parsing memory fragments...', duration: 700 },
  { text: 'Encoding semantic vectors...', duration: 800 },
  { text: 'Establishing synaptic links...', duration: 700 },
  { text: 'Integrating into context...', duration: 600 },
  { text: 'Injection complete', duration: 400 },
];

export const MemoryInjectionAnimation = ({ memoryTitle, onComplete }: MemoryInjectionAnimationProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (hasCompletedRef.current) return;
    
    let totalTime = 0;
    const stageTimeouts: ReturnType<typeof setTimeout>[] = [];

    stages.forEach((stage, index) => {
      const timeout = setTimeout(() => {
        if (hasCompletedRef.current) return;
        
        setCurrentStage(index);
        setProgress(((index + 1) / stages.length) * 100);
        
        if (index === stages.length - 1) {
          setTimeout(() => {
            if (hasCompletedRef.current) return;
            hasCompletedRef.current = true;
            setIsComplete(true);
            setTimeout(() => {
              onComplete?.();
            }, 500);
          }, stage.duration);
        }
      }, totalTime);
      
      stageTimeouts.push(timeout);
      totalTime += stage.duration;
    });

    return () => {
      stageTimeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Main container */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-8 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 170, 0.3) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Card */}
        <div className="relative bg-black/95 border-2 border-neon-green rounded-lg p-6 w-[360px] shadow-neon">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green" />

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key="processing"
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {/* Rotating ring */}
                  <motion.div
                    className="absolute -inset-2 border-2 border-neon-green/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neon-green rounded-full" />
                  </motion.div>

                  {/* Core icon */}
                  <motion.div
                    className="bg-neon-green/20 rounded-full p-4 border border-neon-green"
                    animate={{
                      boxShadow: [
                        '0 0 15px rgba(0, 255, 170, 0.3)',
                        '0 0 25px rgba(0, 255, 170, 0.5)',
                        '0 0 15px rgba(0, 255, 170, 0.3)',
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Brain className="w-8 h-8 text-neon-green" />
                  </motion.div>

                  {/* Spark */}
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    <Zap className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="bg-neon-green rounded-full p-3">
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <h3 className="text-lg font-cyber font-bold text-neon-green text-center mb-1 uppercase tracking-wider">
            {isComplete ? 'Complete' : 'Injecting Memory'}
          </h3>

          {/* Memory name */}
          <p className="text-gray-400 text-xs text-center mb-4 truncate px-2">
            "{memoryTitle}"
          </p>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-deep-teal">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-green to-cyan-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500 text-xs font-mono">{Math.round(progress)}%</span>
              <span className="text-gray-500 text-xs font-mono">{currentStage + 1}/{stages.length}</span>
            </div>
          </div>

          {/* Stage text */}
          <div className="flex items-center justify-center gap-2 min-h-[24px]">
            {!isComplete && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Activity className="w-3 h-3 text-neon-green" />
              </motion.div>
            )}
            <span className={`text-xs font-mono ${isComplete ? 'text-neon-green' : 'text-gray-400'}`}>
              {stages[currentStage]?.text}
            </span>
          </div>
        </div>

        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-green rounded-full"
            style={{ left: '50%', top: '50%' }}
            animate={{
              x: [0, Math.cos((i * Math.PI * 2) / 8) * 80],
              y: [0, Math.sin((i * Math.PI * 2) / 8) * 80],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
