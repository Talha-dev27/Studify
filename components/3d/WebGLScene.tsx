'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';
import { FloatingOrbs } from './FloatingOrbs';
import { ParticleField } from './ParticleField';
import { MouseParallax } from './MouseParallax';

export function WebGLScene({ fallback }: { fallback: ReactNode }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      fallback={fallback}
    >
      <color attach="background" args={['#050510']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6C63FF" />
      <pointLight position={[-10, -10, 5]} intensity={0.6} color="#00D4FF" />

      <Suspense fallback={null}>
        <MouseParallax>
          <FloatingOrbs />
          <ParticleField count={450} />
        </MouseParallax>
      </Suspense>
    </Canvas>
  );
}
