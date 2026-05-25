'use client';

import { useRef, useMemo, useLayoutEffect } from 'react';
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
  const logoTexture = useTexture('/images/logo.png');

  useLayoutEffect(() => {
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.minFilter = THREE.LinearFilter;
    logoTexture.magFilter = THREE.LinearFilter;
    logoTexture.generateMipmaps = false;
    // Flip texture vertically via repeat trick (avoids mesh rotation which mirrors X)
    logoTexture.wrapT = THREE.RepeatWrapping;
    logoTexture.repeat.y = -1;
    logoTexture.offset.y = 1;
  }, [logoTexture]);

  const { clonedScene, screenData } = useMemo(() => {
    const clone = gltf.scene.clone();

    // Center the geometry
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);

    // Normalize scale
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = isMobile ? 2.5 : 4;
    const scaleFactor = targetSize / maxDim;
    clone.scale.multiplyScalar(scaleFactor);

    // Force world matrix computation
    clone.updateMatrixWorld(true);

    // --- Find screen by scanning all meshes for +Z facing verts ---
    let screenVerts: THREE.Vector3[] = [];

    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry;
      if (!geometry) return;

      const posAttr = geometry.getAttribute('position');
      const normalAttr = geometry.getAttribute('normal');
      if (!posAttr || !normalAttr) return;

      const normalMat = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
      const wPos = new THREE.Vector3();
      const wNorm = new THREE.Vector3();

      for (let i = 0; i < posAttr.count; i++) {
        wNorm.fromBufferAttribute(normalAttr, i);
        wNorm.applyMatrix3(normalMat).normalize();

        if (wNorm.z > 0.7) {
          wPos.fromBufferAttribute(posAttr, i);
          wPos.applyMatrix4(mesh.matrixWorld);
          screenVerts.push(wPos.clone());
        }
      }
    });

    // Filter to only the cluster in the upper region (screen, not stray verts)
    // Find the median Y to separate screen from any base verts
    if (screenVerts.length > 0) {
      const yValues = screenVerts.map(v => v.y).sort((a, b) => a - b);
      const medianY = yValues[Math.floor(yValues.length / 2)];
      // Keep only verts above 80% of median (generous filter)
      screenVerts = screenVerts.filter(v => v.y > medianY * 0.3);
    }

    let screen: { x: number; y: number; z: number; w: number; h: number } | null = null;

    if (screenVerts.length > 10) {
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let zSum = 0;

      for (const v of screenVerts) {
        minX = Math.min(minX, v.x);
        maxX = Math.max(maxX, v.x);
        minY = Math.min(minY, v.y);
        maxY = Math.max(maxY, v.y);
        zSum += v.z;
      }

      const avgZ = zSum / screenVerts.length;
      const rawW = maxX - minX;
      const rawH = maxY - minY;

      // Inset for bezel and position adjustments
      const centerY = (minY + maxY) / 2;
      screen = {
        x: (minX + maxX) / 2,
        y: centerY - rawH * 0.05, // shift down slightly (top bezel is thicker)
        z: avgZ + -0.9847, // sit flush on screen surface
        w: rawW * 0.8,
        h: rawH * 0.75,
      };
    }

    return { clonedScene: clone, screenData: screen };
  }, [gltf.scene, isMobile]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const progress = scrollProgress.current ?? 0;
    const damp = 0.1;
    const time = state.clock.elapsedTime;

    const startX = isMobile ? 0 : 2.5;
    const endX = isMobile ? 0 : -2.5;
    const targetX = THREE.MathUtils.lerp(startX, endX, progress);

    const floatAmplitude = 0.12;
    const floatSpeed = 0.6;
    const baseY = -0.6;
    const targetY = baseY + Math.sin(time * floatSpeed) * floatAmplitude;

    const targetZ = -Math.sin(progress * Math.PI) * 0.8;

    const startRotY = -10 * (Math.PI / 180);
    const rotationDelta = 380 * (Math.PI / 180);
    const targetRotY = startRotY + progress * rotationDelta;
    const targetRotX = Math.sin(progress * Math.PI) * 0.15;

    const baseScale = 1;
    const scaleBoost = Math.sin(progress * Math.PI) * 0.08;
    const targetScale = baseScale + scaleBoost;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, damp);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, damp);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, damp);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, damp);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, damp);

    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, damp);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 3.5, 0, 0]}>
      <primitive object={clonedScene} />

      {/* Screen overlay plane with logo */}
      {screenData && (
        <mesh
          position={[screenData.x, screenData.y, screenData.z]}
        >
          <planeGeometry args={[screenData.w, screenData.h]} />
          <meshBasicMaterial
            map={logoTexture}
            toneMapped={false}
            depthTest={true}
            depthWrite={true}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
