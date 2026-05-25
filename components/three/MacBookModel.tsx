'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/assets/macbook.glb';

interface MacBookModelProps {
  scrollProgress: React.RefObject<number>;
  isMobile: boolean;
}

export default function MacBookModel({ scrollProgress, isMobile }: MacBookModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(MODEL_PATH);
  const texture = useTexture('/images/graffiti/hero-bg.svg');

    const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone();

    // The model uses a single texture atlas for the body and screen,
    // so we can't easily override just the screen material here.

    // Center the geometry
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);

    // Normalize scale based on bounding box
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = isMobile ? 2.5 : 4;
    const scaleFactor = targetSize / maxDim;
    clone.scale.multiplyScalar(scaleFactor);

    return clone;
  }, [gltf.scene, isMobile]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const progress = scrollProgress.current ?? 0;
    const damp = 0.1;
    const time = state.clock.elapsedTime;

    // ---- Position ----
    // X: Start right (positive), end left (negative)
    const startX = isMobile ? 0 : 2.5;
    const endX = isMobile ? 0 : -2.5;
    const targetX = THREE.MathUtils.lerp(startX, endX, progress);

    // Y: Gentle floating bob
    const floatAmplitude = 0.12;
    const floatSpeed = 0.6;
    const baseY = -0.6; // Moved a little below
    const targetY = baseY + Math.sin(time * floatSpeed) * floatAmplitude;

    // Z: Slight push back at midpoint for depth feel
    const targetZ = -Math.sin(progress * Math.PI) * 0.8;

    // ---- Rotation ----
    // Start 10 degrees clockwise, rotate a full 360 + 20 degrees anticlockwise (total 380 deg rotation)
    const startRotY = -10 * (Math.PI / 180);
    const rotationDelta = 380 * (Math.PI / 180);
    const targetRotY = startRotY + progress * rotationDelta;
    // Subtle X tilt for dynamism
    const targetRotX = Math.sin(progress * Math.PI) * 0.15;

    // ---- Scale ----
    // Slight scale-up at midpoint
    const baseScale = 1;
    const scaleBoost = Math.sin(progress * Math.PI) * 0.08;
    const targetScale = baseScale + scaleBoost;

    // Lerp all properties smoothly
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x, targetX, damp
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y, targetY, damp
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z, targetZ, damp
    );

    // For rotation, use lerp on the angle
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, targetRotY, damp
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, targetRotX, damp
    );

    // Scale
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, damp);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 3.5, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the model as early as possible
useGLTF.preload(MODEL_PATH);
