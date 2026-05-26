'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import MacBookModel from './MacBookModel';

/* ─── Canvas wrapper with cinematic lighting ─── */
interface MacBookCanvasProps {
  scrollProgress: React.RefObject<number>;
  isMobile: boolean;
}

export default function MacBookCanvas({ scrollProgress, isMobile }: MacBookCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 45 }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      style={{
        background: 'transparent',
        width: '100%',
        height: '100%',
      }}
    >
      {/* ── Lighting: Three‑point cinematic setup ── */}
      {/* Ambient baseline */}
      <ambientLight intensity={0.9} />

      {/* Key light — strong front-right directional */}
      <directionalLight
        position={[5, 5, 15]}
        intensity={2.0}
        color="#ffffff"
        castShadow={false}
      />

      {/* Fill light — cool blue from left */}
      <directionalLight
        position={[-4, 3, 8]}
        intensity={0.8}
        color="#4a90d9"
      />

      {/* Rim/back light for edge separation */}
      <directionalLight
        position={[0, 5, -10]}
        intensity={0.8}
        color="#FF003C"
      />

      {/* Cool ground-bounce point light */}
      <pointLight
        position={[0, -3, 12]}
        intensity={0.8}
        color="#00D4FF"
        distance={30}
      />

      {/* ── 3D Model ── */}
      <Suspense fallback={null}>
        <MacBookModel scrollProgress={scrollProgress} isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
