import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Cake } from './Cake';
import { AppState, SceneProps } from '../types';
import { Suspense } from 'react';

interface EnhancedSceneProps extends SceneProps {
  blowStrength: number;
}

export function Scene({ appState, blowStrength }: EnhancedSceneProps) {
  return (
    <div className="w-full h-full bg-[#fafafa]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 4, 8]} fov={45} />
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 1.8}
          minDistance={5}
          maxDistance={12}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />

        <ambientLight intensity={0.7} />
        <spotLight 
          position={[10, 12, 10]} 
          angle={0.2} 
          penumbra={1} 
          intensity={1.5} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Suspense fallback={null}>
          <Cake appState={appState} blowStrength={blowStrength} />
          <Environment preset="apartment" />
          <ContactShadows 
            position={[0, -1.25, 0]} 
            opacity={0.5} 
            scale={12} 
            blur={3} 
            far={10} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

