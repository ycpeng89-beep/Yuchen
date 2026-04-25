import { Candle } from './Candle';
import { AppState } from '../types';
import { useMemo } from 'react';

function Strawberry({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ff4d4d" />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
    </group>
  );
}

function CreamDollop({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#ffffff" roughness={0.1} />
    </mesh>
  );
}

export function Cake({ appState, blowStrength = 0 }: { appState: AppState, blowStrength?: number }) {
  return (
    <group position={[0, -0.7, 0]}>
      {/* Base Layer */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.7, 64]} />
        <meshStandardMaterial color="#fffbe6" />
      </mesh>
      
      {/* Middle Layer */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.7, 64]} />
        <meshStandardMaterial color="#fffbe6" />
      </mesh>

      {/* Top Layer */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.7, 64]} />
        <meshStandardMaterial color="#fffbe6" />
      </mesh>

      {/* Decorations - Cream & Strawberries in rings */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const xBase = Math.cos(rad) * 1.4;
        const zBase = Math.sin(rad) * 1.4;
        const xMid = Math.cos(rad + 0.5) * 1.1;
        const zMid = Math.sin(rad + 0.5) * 1.1;
        const xTop = Math.cos(rad) * 0.7;
        const zTop = Math.sin(rad) * 0.7;
        
        return (
          <group key={i}>
            <CreamDollop position={[xBase, 0.35, zBase]} />
            <Strawberry position={[xMid, 0.95, zMid]} />
            <CreamDollop position={[xTop, 1.55, zTop]} />
          </group>
        );
      })}

      {/* Golden Plate */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2, 2.1, 0.1, 64]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Candles */}
      <Candle position={[0, 1.55, 0]} appState={appState} blowStrength={blowStrength} />
      <Candle position={[0.4, 1.55, 0.4]} appState={appState} blowStrength={blowStrength} />
      <Candle position={[-0.4, 1.55, 0.4]} appState={appState} blowStrength={blowStrength} />
      <Candle position={[0.4, 1.55, -0.4]} appState={appState} blowStrength={blowStrength} />
      <Candle position={[-0.4, 1.55, -0.4]} appState={appState} blowStrength={blowStrength} />
    </group>
  );
}


