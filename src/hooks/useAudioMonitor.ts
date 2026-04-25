import { useEffect, useRef, useState } from 'react';

export function useAudioMonitor() {
  const [volume, setVolume] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      audioContextRef.current = context;
      
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setIsActive(true);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setVolume(avg);
        
        animationFrameRef.current = requestAnimationFrame(update);
      };
      
      update();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopMonitoring = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close();
    
    setIsActive(false);
    setVolume(0);
  };

  useEffect(() => {
    return () => stopMonitoring();
  }, []);

  return { volume, isActive, startMonitoring, stopMonitoring };
}
