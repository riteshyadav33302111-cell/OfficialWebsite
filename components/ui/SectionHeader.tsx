'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/hooks/useGSAPAnimation';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: 'primary' | 'secondary' | 'coral' | 'amber' | 'sage';
  align?: 'left' | 'center';
}

export default function SectionHeader({
  title,
  subtitle,
  accent = 'primary',
  align = 'center',
}: SectionHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from(containerRef.current.children, {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef });

  const gradientClass = `gradient-text-${accent}`;
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div ref={containerRef} className={`flex flex-col gap-4 mb-12 ${alignClass}`}>
      <div
        className="h-[2px] w-16 rounded-full"
        style={{
          background: `linear-gradient(90deg, var(--accent-${accent}), transparent)`,
        }}
      />
      <h2 className={`text-heading ${gradientClass}`}>{title}</h2>
      {subtitle && <p className="text-body max-w-2xl">{subtitle}</p>}
    </div>
  );
}
