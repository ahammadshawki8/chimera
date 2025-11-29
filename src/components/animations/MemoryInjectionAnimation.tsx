import { motion } from 'framer-motion';
import { Database, Zap, CheckCircle } from 'lucide-react';

interface MemoryInjectionAnimationProps {
  memoryTitle: string;
  onComplete?: () => void;
}

export const MemoryInjectionAnimation = ({ memoryTitle, onComplete }: MemoryInjectionAnimationProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => {
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Animation container */}
      <div className="relative z-10">
        <motion.div
          className="relative"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* Main card */}
          <div className="bg-black/90 border-2 border-emerald-500 rounded-lg p-8 min-w-[400px] shadow-2xl">
            {/* Animated icon container */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
                
                {/* Icon background */}
                <div className="relative bg-emerald-500/20 rounded-full p-6">
                  <Database className="w-12 h-12 text-emerald-500" />
                  
                  {/* Spark effect */}
                  <motion.div
                    className="absolute top-0 right-0"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Zap className="w-6 h-6 text-yellow-400" fill="currentColor" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-3">
              <motion.h3
                className="text-xl font-bold text-emerald-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Injecting Memory
              </motion.h3>
              
              <motion.p
                className="text-gray-300 text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {memoryTitle}
              </motion.p>

              {/* Loading bar */}
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>

              {/* Status text */}
              <motion.div
                className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full" />
                </motion.div>
                <span>Processing neural pathways...</span>
              </motion.div>
            </div>

            {/* Particle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI * 2) / 8) * 100],
                  y: [0, Math.sin((i * Math.PI * 2) / 8) * 100],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Success indicator (appears at the end) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            <div className="bg-emerald-500 rounded-full p-3">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
