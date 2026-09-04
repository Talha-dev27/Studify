'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

export function MouseParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const x = state.pointer.x;
    const y = state.pointer.y;
    if (ref.current) {
      ref.current.rotation.x = y * 0.1 + Math.sin(t * 0.2) * 0.05;
      ref.current.rotation.y = x * 0.1 + Math.cos(t * 0.15) * 0.05;
    }
  });

  return <group ref={ref}>{children}</group>;
}