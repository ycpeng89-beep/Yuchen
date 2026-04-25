/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';
import { AppState } from '../types';

// Flame component with flicker logic
function Flame({ appState, blowStrength }: { appState: AppState, blowStrength: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (appState === AppState.WAITING || appState === AppState.BLOWING) {
      const t = state.clock.elapsedTime;
      
      // Flicker scale
      const flicker = 1 + Math.sin(t * 20) * 0.05;
      meshRef.current.scale.set(flicker, flicker, flicker);
      
      // Sway based on t and blowStrength
      const swayFactor = 0.02 + blowStrength * 0.5;
      meshRef.current.position.x = Math.sin(t * 10) * swayFactor;
      meshRef.current.rotation.z = Math.sin(t * 10) * (swayFactor * 2);

      if (appState === AppState.BLOWING || blowStrength > 0.1) {
        // More intense shaking when blowing
        meshRef.current.position.x += (Math.random() - 0.5) * blowStrength * 0.2;
        meshRef.current.scale.set(flicker * (1 + blowStrength), flicker * (1 - blowStrength * 0.5), flicker);
      }

      if (lightRef.current) {
        lightRef.current.intensity = (0.5 + Math.random() * 0.5) * (1 - blowStrength * 0.5);
      }
    } else {
      // Extinguished
      meshRef.current.scale.set(0, 0, 0);
      if (lightRef.current) lightRef.current.intensity = 0;
    }
  });

  return (
    <group position={[0, 0.45, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffcc00" 
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight ref={lightRef} color="#ffff00" distance={3} intensity={0.8} />
    </group>
  );
}

// Smoke particle system
function Smoke({ appState }: { appState: AppState }) {
  const count = 30;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = 0;
        pos[i * 3 + 1] = 0.5;
        pos[i * 3 + 2] = 0;
    }
    return pos;
  }, []);

  const velocities = useMemo(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        v[i * 3] = (Math.random() - 0.5) * 0.02;
        v[i * 3 + 1] = 0.02 + Math.random() * 0.03;
        v[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return v;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  const opacityRef = useRef(0);

  useFrame(() => {
    if (!pointsRef.current) return;
    
    if (appState === AppState.EXTINGUISHED || appState === AppState.CARD_SHOWN || appState === AppState.CARD_OPENED) {
        opacityRef.current = Math.max(0, opacityRef.current + (1 - opacityRef.current) * 0.05);
        const posAttr = pointsRef.current.geometry.attributes.position as any;
        
        for (let i = 0; i < count; i++) {
            posAttr.array[i * 3] += velocities[i * 3];
            posAttr.array[i * 3 + 1] += velocities[i * 3 + 1];
            posAttr.array[i * 3 + 2] += velocities[i * 3 + 2];
            
            // Fade out particles as they rise
            if (posAttr.array[i * 3 + 1] > 2.0) {
                posAttr.array[i * 3 + 1] = 0.5;
                posAttr.array[i * 3] = 0;
                posAttr.array[i * 3 + 2] = 0;
            }
        }
        posAttr.needsUpdate = true;
    } else {
        opacityRef.current = Math.max(0, opacityRef.current - 0.1);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        vertexColors={false}
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        color="#aaa"
        opacity={opacityRef.current * 0.4}
      />
    </Points>
  );
}

export function Candle({ position, appState, blowStrength = 0 }: { position: [number, number, number], appState: AppState, blowStrength?: number }) {
  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 12]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>
      
      {/* Spiral Stripes (simulated) */}
      {[0, 0.1, 0.2, 0.3].map((h, i) => (
        <mesh key={i} position={[0, 0.05 + h, 0]} rotation={[0, i * 0.5, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Wick */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.05, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>


      {/* Flame */}
      <Flame appState={appState} blowStrength={blowStrength} />

      {/* Smoke */}
      <Smoke appState={appState} />
    </group>
  );
}

