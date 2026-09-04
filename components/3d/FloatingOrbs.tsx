'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export function FloatingOrbs() {
  const icoRef = useRef<Mesh>(null);
  const octaRef = useRef<Mesh>(null);
  const torusRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.3;
      icoRef.current.rotation.y = t * 0.2;
      icoRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    }
    if (octaRef.current) {
      octaRef.current.rotation.x = -t * 0.4;
      octaRef.current.rotation.z = t * 0.3;
      octaRef.current.position.y = -Math.sin(t * 0.7) * 0.4;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.5;
      torusRef.current.rotation.y = t * 0.2;
      torusRef.current.position.y = Math.cos(t * 0.4) * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={icoRef} position={[-2.5, 0.8, -1]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#6C63FF"
          emissive="#6C63FF"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.8}
          wireframe
        />
      </mesh>

      <mesh ref={octaRef} position={[2.8, -0.5, -2]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.9}
          wireframe
        />
      </mesh>

      <mesh ref={torusRef} position={[2.2, 1.8, -1.5]}>
        <torusGeometry args={[0.5, 0.15, 16, 64]} />
        <meshStandardMaterial
          color="#FF6BD6"
          emissive="#FF6BD6"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      <mesh position={[-2.2, -1.5, -1.5]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#8B84FF"
          emissive="#8B84FF"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}