import { motion } from 'motion/react';
import { Mail, Sparkles } from 'lucide-react';
import { AppState } from '../types';

interface GreetingCardProps {
  appState: AppState;
  onOpen: () => void;
}

export function GreetingCard({ appState, onOpen }: GreetingCardProps) {
  const isOpened = appState === AppState.CARD_OPENED;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-50 pointer-events-none">
      <div className="relative w-full max-w-md aspect-[4/3] pointer-events-auto perspective-1000">
        <motion.div
          initial={{ scale: 0.5, y: 100, opacity: 0 }}
          animate={{ 
            scale: 1, 
            y: 0, 
            opacity: 1,
            rotateY: isOpened ? 180 : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            rotateY: { duration: 0.8, ease: "easeInOut" }
          }}
          className="relative w-full h-full preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of the card */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center border-8 border-pink-100 p-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-6 p-4 bg-pink-50 rounded-full"
            >
              <Mail className="w-16 h-16 text-pink-500" />
            </motion.div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">A Special Message</h3>
            <p className="text-gray-500 text-center mb-8">You have received a birthday blessing</p>
            <button
              onClick={onOpen}
              className="px-10 py-4 bg-pink-500 text-white rounded-full font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
              打开贺卡
            </button>
          </div>

          {/* Back of the card (the inside message) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-[#fffdf0] rounded-3xl shadow-2xl flex flex-col items-center justify-center p-12 border-8 border-yellow-100"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isOpened ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-red-600 mb-6 leading-tight font-serif">
                  妈妈生日快乐！
                </p>
                <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
                  祝您岁岁平安喜乐，<br />
                  一切顺遂 🎉
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isOpened ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
                className="mt-12 flex justify-center gap-2 text-pink-300"
              >
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-6 h-6 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
