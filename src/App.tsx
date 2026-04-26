/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, RotateCcw, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scene } from './components/Scene';
import { GreetingCard } from './components/GreetingCard';
import { AppState } from './types';
import { useAudioMonitor } from './hooks/useAudioMonitor';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.WAITING);
  const { volume, isActive, startMonitoring, stopMonitoring } = useAudioMonitor();
  const [manualBlowing, setManualBlowing] = useState(false);
  const blowTimerRef = useRef<number | null>(null);

  // Background Music State
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  // Normalize volume for blow strength
  const blowStrength = Math.min(1, Math.max(0, (isActive ? volume - 10 : 0) / 40)) + (manualBlowing ? 0.8 : 0);

  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  }, [isMuted]);

  // Attempt to play on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && isMuted) {
        // We only log, don't force start to respect user choice usually, 
        // but here we can try to "unmute" if the user hasn't explicitly muted.
        // Actually, better to let them click the toggle.
      }
    };
    window.addEventListener('mousedown', handleFirstInteraction);
    return () => window.removeEventListener('mousedown', handleFirstInteraction);
  }, [isMuted]);

  const triggerExtinguish = useCallback(() => {
    if (appState === AppState.WAITING || appState === AppState.BLOWING) {
      setAppState(AppState.EXTINGUISHED);
      
      // Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#ffc0cb', '#ffaa00', '#ffffff', '#ff2222', '#ffecf0']
      });

      // Show card after a short delay
      setTimeout(() => {
        setAppState(AppState.CARD_SHOWN);
      }, 1500);
    }
  }, [appState]);

  // Audio reactivity logic
  useEffect(() => {
    if ((appState === AppState.WAITING || appState === AppState.BLOWING) && blowStrength > 0.6) {
      if (!blowTimerRef.current) {
        blowTimerRef.current = window.setTimeout(() => {
          triggerExtinguish();
          blowTimerRef.current = null;
        }, 1000); // Need to blow for 1 second continuously to extinguish
      }
    } else {
      if (blowTimerRef.current) {
        clearTimeout(blowTimerRef.current);
        blowTimerRef.current = null;
      }
    }
  }, [blowStrength, appState, triggerExtinguish]);

  const startBlowing = useCallback(() => {
    setManualBlowing(true);
    if (appState === AppState.WAITING) {
      setAppState(AppState.BLOWING);
    }
  }, [appState]);

  const stopBlowing = useCallback(() => {
    setManualBlowing(false);
    if (appState === AppState.BLOWING) {
       // Manual release can also extinguish if held long enough, 
       // but we handle that in the effect above too.
       // For better UX, let's just extinguish on release if strength was high
       if (blowStrength > 0.5) {
         triggerExtinguish();
       } else {
         setAppState(AppState.WAITING);
       }
    }
  }, [appState, blowStrength, triggerExtinguish]);

  const reset = useCallback(() => {
    setAppState(AppState.WAITING);
    setManualBlowing(false);
  }, []);

  const openCard = useCallback(() => {
    setAppState(AppState.CARD_OPENED);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col font-sans select-none overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Scene appState={appState} blowStrength={blowStrength} />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full p-8 pointer-events-none">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black text-[#141414] tracking-tighter filter drop-shadow-sm">
            CELEBRATION
          </h1>
          <p className="text-[#ffaa00] mt-2 font-bold uppercase tracking-[0.2em] text-xs">A Moment for You</p>
        </motion.header>

        {/* Audio Toggle */}
        <div className="absolute top-8 right-8 pointer-events-auto flex gap-2">
          {/* Background Music Toggle */}
          <button
            onClick={toggleMusic}
            className={`p-3 rounded-full shadow-lg transition-all ${!isMuted ? 'bg-pink-500 text-white' : 'bg-white text-gray-400'}`}
            title={!isMuted ? "Pause Music" : "Play Music"}
          >
            {!isMuted ? <Volume2 className="w-6 h-6 animate-pulse" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Microphone Toggle */}
          <button
            onClick={isActive ? stopMonitoring : startMonitoring}
            className={`p-3 rounded-full shadow-lg transition-all ${isActive ? 'bg-green-500 text-white' : 'bg-white text-gray-400'}`}
            title={isActive ? "Microphone On" : "Enable Microphone to Blow"}
          >
            {isActive ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
          </button>
        </div>

        {/* hidden audio element */}
        <audio 
          ref={audioRef} 
          src="https://cdn.pixabay.com/audio/2022/03/15/audio_273117565d.mp3" 
          loop 
          preload="auto"
        />

        {/* Controls */}
        <div className="w-full max-w-xs flex flex-col items-center gap-6 pointer-events-auto pb-8">
          <AnimatePresence mode="wait">
            {(appState === AppState.WAITING || appState === AppState.BLOWING) ? (
              <motion.div
                key="blow-section"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative">
                    {blowStrength > 0.1 && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: blowStrength * 2.5 }}
                            className="absolute inset-0 bg-pink-200/30 rounded-full blur-xl"
                        />
                    )}
                    <button
                        id="blow-btn"
                        onMouseDown={startBlowing}
                        onMouseUp={stopBlowing}
                        onTouchStart={startBlowing}
                        onTouchEnd={stopBlowing}
                        className={`
                            blow-button relative z-10
                            w-24 h-24 rounded-full flex items-center justify-center
                            shadow-2xl cursor-pointer outline-none transition-all duration-300
                            ${appState === AppState.BLOWING || blowStrength > 0.4 ? 'bg-[#ffaa00] scale-110' : 'bg-white'}
                        `}
                    >
                        <Wind 
                            className={`w-10 h-10 transition-colors ${appState === AppState.BLOWING || blowStrength > 0.4 ? 'text-white' : 'text-[#ffaa00]'}`} 
                        />
                    </button>
                </div>
                <div className="text-center">
                    <p className="text-sm font-black text-[#141414] uppercase tracking-widest transition-all">
                        {blowStrength > 0.4 ? '💨 BLOWING HARD!' : isActive ? 'Speak/Blow into Mic' : 'Hold to Blow'}
                    </p>
                    {isActive && (
                        <div className="mt-2 w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-green-500"
                                animate={{ width: `${blowStrength * 100}%` }}
                            />
                        </div>
                    )}
                </div>
              </motion.div>
            ) : appState === AppState.EXTINGUISHED ? (
                <motion.div
                    key="celebrate"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-pink-500 font-black text-3xl"
                >
                    POOF! ✨
                </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Greeting Card Overlay */}
      <AnimatePresence>
        {(appState === AppState.CARD_SHOWN || appState === AppState.CARD_OPENED) && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 pointer-events-auto"
            />
            <GreetingCard appState={appState} onOpen={openCard} />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
            >
              <button 
                onClick={reset}
                className="flex items-center gap-2 bg-white text-gray-800 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                RESTART
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Decorative Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
         <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#ff69b4] blur-[100px]" />
         <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-[#ffaa00] blur-[100px]" />
      </div>
    </div>
  );
}

