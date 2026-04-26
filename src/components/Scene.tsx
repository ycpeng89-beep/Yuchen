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
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4, 8], fov: 45 }}>
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 1.8}
          minDistance={5}
          maxDistance={12}
          autoRotate={false}
        />

        <ambientLight intensity={1.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.8} />

        <Suspense fallback={null}>
          <Cake appState={appState} blowStrength={blowStrength} />
          {/* We wrap Environment separately so it doesn't block the Cake */}
          <Suspense fallback={null}>
             <Environment preset="apartment" />
          </Suspense>
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

