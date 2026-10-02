'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { FloatingOrbs } from './FloatingOrbs';
import { ParticleField } from './ParticleField';
import { MouseParallax } from './MouseParallax';

export function HeroScene() {
  const [webglAvailable, setWebglAvailable] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    let context: WebGLRenderingContext | WebGL2RenderingContext | null = null;

    try {
      context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch {
      // Some browsers and sandboxed environments throw when WebGL is disabled.
    }

    if (context) {
      const loseContext = context.getExtension('WEBGL_lose_context');
      loseContext?.loseContext();
      setWebglAvailable(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {!webglAvailable && (
        <div className="ambient-backdrop">
          <span className="ambient-glow ambient-glow--purple" />
          <span className="ambient-glow ambient-glow--cyan" />
          <span className="ambient-glow ambient-glow--pink" />
          <span className="ambient-particles" />
        </div>
      )}
      {webglAvailable && (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 55 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          fallback={null}
        >
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#6C63FF" />
          <pointLight position={[-10, -10, 5]} intensity={0.6} color="#00D4FF" />

          <Suspense fallback={null}>
            <MouseParallax>
              <FloatingOrbs />
              <ParticleField count={1500} />
            </MouseParallax>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
