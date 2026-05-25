'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function SmokeEffect() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const smokeElements = gsap.utils.toArray('.smoke-layer');

    smokeElements.forEach((el: any) => {
      gsap.to(el, {
        x: () => gsap.utils.random(-80, 80),
        y: () => gsap.utils.random(-80, 80),
        scale: () => gsap.utils.random(0.9, 1.3),
        opacity: () => gsap.utils.random(0.2, 0.7),
        duration: () => gsap.utils.random(10, 20),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: () => gsap.utils.random(-10, 0),
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="absolute inset-0 pointer-events-none mix-blend-screen overflow-visible">
      <div className="smoke-layer absolute right-[-10%] top-[10%] w-[60vw] h-[60vw] bg-[#3a3a3a] rounded-full blur-[120px] opacity-40" />
      <div className="smoke-layer absolute right-[5%] top-[30%] w-[50vw] h-[50vw] bg-[#4a4a4a] rounded-full blur-[140px] opacity-30" />
      <div className="smoke-layer absolute right-[-5%] top-[50%] w-[70vw] h-[70vw] bg-[#2a2a2a] rounded-full blur-[150px] opacity-50" />
      <div className="smoke-layer absolute right-[10%] top-[20%] w-[55vw] h-[55vw] bg-[#5a5a5a] rounded-full blur-[130px] opacity-20" />
    </div>
  );
}
