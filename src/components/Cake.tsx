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

function CreamDollop({ position, color = "#ffffff" }: { position: [number, number, number], color?: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.1} />
    </mesh>
  );
}

export function Cake({ appState, blowStrength = 0 }: { appState: AppState, blowStrength?: number }) {
  const dollopColors = useMemo(() => ["#ffffff", "#ffdef2", "#e2f0cb", "#c7ceea", "#ff9aa2"], []);
  
  return (
    <group position={[0, -0.7, 0]}>
      {/* Base Layer - Chocolate/Mocha */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.7, 64]} />
        <meshStandardMaterial color="#8B4513" roughness={0.3} />
      </mesh>
      
      {/* Middle Layer - Strawberry Pink */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.7, 64]} />
        <meshStandardMaterial color="#FF69B4" roughness={0.3} />
      </mesh>

      {/* Top Layer - Lemon Yellow/Cream */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.7, 64]} />
        <meshStandardMaterial color="#FFF9C4" roughness={0.3} />
      </mesh>

      {/* colorful dots on sides */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <group key={`side-dots-${i}`}>
            {/* Base layer dots */}
            <mesh position={[Math.cos(rad) * 1.61, 0, Math.sin(rad) * 1.61]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color={["#FF69B4", "#00BFFF", "#32CD32", "#FFD700"][i % 4]} />
            </mesh>
            {/* Middle layer dots */}
            <mesh position={[Math.cos(rad + 0.3) * 1.31, 0.6, Math.sin(rad + 0.3) * 1.31]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color={["#FFD700", "#FF69B4", "#00BFFF", "#32CD32"][i % 4]} />
            </mesh>
          </group>
        );
      })}

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
            <CreamDollop position={[xBase, 0.35, zBase]} color={dollopColors[i % dollopColors.length]} />
            <Strawberry position={[xMid, 0.95, zMid]} />
            <CreamDollop position={[xTop, 1.55, zTop]} color={dollopColors[(i + 1) % dollopColors.length]} />
            {/* Added Sprinkles */}
            <mesh position={[Math.cos(rad + 0.2) * 1.1, 0.96, Math.sin(rad + 0.2) * 1.1]}>
               <sphereGeometry args={[0.03, 8, 8]} />
               <meshStandardMaterial color="#00BFFF" />
            </mesh>
            <mesh position={[Math.cos(rad - 0.2) * 0.8, 1.56, Math.sin(rad - 0.2) * 0.8]}>
               <sphereGeometry args={[0.03, 8, 8]} />
               <meshStandardMaterial color="#FFD700" />
            </mesh>
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


