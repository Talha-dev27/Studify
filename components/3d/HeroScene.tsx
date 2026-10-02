'use client';

import { type ComponentType, type ReactNode, useEffect, useState } from 'react';

type WebGLSceneProps = { fallback: ReactNode };

export function HeroScene() {
  const [WebGLScene, setWebGLScene] = useState<ComponentType<WebGLSceneProps> | null>(null);
  const fallback = (
    <div className="ambient-backdrop">
      <span className="ambient-particles" />
    </div>
  );

  useEffect(() => {
    const canvas = document.createElement('canvas');
    let context: WebGLRenderingContext | WebGL2RenderingContext | null = null;

    try {
      context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch {
      // Some browsers and sandboxed environments throw when WebGL is disabled.
    }

    if (!context) return;

    const loseContext = context.getExtension('WEBGL_lose_context');
    loseContext?.loseContext();

    let active = true;
    import('./WebGLScene')
      .then(({ WebGLScene }) => {
        if (active) setWebGLScene(() => WebGLScene);
      })
      .catch(() => {
        // Keep the animated CSS background if the 3D chunk fails to load.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {WebGLScene ? <WebGLScene fallback={fallback} /> : fallback}
    </div>
  );
}
