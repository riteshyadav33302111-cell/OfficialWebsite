'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/hooks/useGSAPAnimation';
import type { Developer } from '@/lib/types';
import Image from 'next/image';

/**
 * DeveloperCard Component
 * 
 * An industrial-style ID badge / permit card for the developers.
 * Featuring glassmorphism, gritty textures, and a "clip-on" aesthetic.
 */
export default function DeveloperCard({ developer }: { developer: Developer }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;
    
    // Entrance animation
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, rotateX: -10 },
      { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        duration: 0.8, 
        ease: 'power4.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
        }
      }
    );

    // Subtle hover tilt effect
    const onMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const { left, top, width, height } = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      gsap.to(cardRef.current, {
        rotateY: x * 10,
        rotateX: -y * 10,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to(cardRef.current, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    cardRef.current.addEventListener('mousemove', onMouseMove);
    cardRef.current.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cardRef.current?.removeEventListener('mousemove', onMouseMove);
      cardRef.current?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div className="relative group perspective-1000 my-8 py-4">
      {/* Custom Scoped Styles for Gritty Textures */}
      <style jsx>{`
        .id-card-texture {
          background-image: 
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
          background-size: 24px 24px;
        }
        .noise-texture::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          mix-blend-mode: overlay;
        }
        .tape-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(2px);
          mask-image: linear-gradient(to bottom, black, transparent);
        }
        .grid-bg {
          background-image: linear-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.15) 1px, transparent 1px);
          background-size: 15px 15px;
        }
      `}</style>

      {/* Top Clip */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none -translate-y-4">
        <svg ref={clipRef} width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 5C10 2.23858 12.2386 0 15 0H45C47.7614 0 50 2.23858 50 5V15H10V5Z" fill="#333" />
          <path d="M10 15H50V25C50 27.7614 47.7614 30 45 30H15C12.2386 30 10 27.7614 10 25V15Z" fill="#444" />
          <rect x="25" y="5" width="10" height="20" rx="2" fill="#222" />
          <circle cx="30" cy="15" r="3" fill="#666" />
        </svg>
      </div>

      {/* Main Card Body */}
      <div 
        ref={cardRef}
        className="w-full max-w-[340px] aspect-[1/1.5] bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl noise-texture relative id-card-texture flex flex-col mx-auto transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(212,100,59,0.2)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Header Tags */}
        <div className="pt-10 px-8 flex justify-between items-start">
          <div className="flex flex-col gap-1.5">
            <div className="bg-[#D4643B] text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">
              DEV-SEC / CORE
            </div>
            <div className="bg-[#D9A84E] text-black text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter">
              BETA ACCESS 0.17
            </div>
          </div>
          <div className="text-white/20 font-black text-4xl leading-none select-none tracking-tighter">
            {new Date().getMonth() + 1}.{new Date().getDate()}
          </div>
        </div>

        {/* Photo Container */}
        <div className="flex-1 px-8 py-6 flex flex-col">
          <div className="relative flex-1 bg-[#D9A84E] rounded-2xl border border-black/5 grid-bg overflow-hidden group/photo box-shadow-inner shadow-2xl">
            {/* Developer Image Placeholder */}
            {developer.image ? (
              <Image 
                src={developer.image} 
                alt={developer.name}
                fill
                className="object-cover grayscale group-hover/photo:grayscale-0 transition-all duration-700 scale-105 group-hover/photo:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/10 italic text-sm font-mono">
                NO_SIGNAL // AVATAR_MISSING
              </div>
            )}
            
            {/* Sticker Overlays */}
            <div className="absolute top-6 left-6 -rotate-12 bg-white text-black px-4 py-1 font-black text-2xl shadow-2xl border border-black/10 select-none transform transition-transform group-hover/photo:-rotate-6">
              {developer.name.split(' ')[0]}
            </div>

            <div className="absolute bottom-8 right-0 translate-x-1/4 rotate-12 bg-[#7A9A6B] text-black px-5 py-1.5 font-black text-xs shadow-2xl select-none transform transition-transform group-hover/photo:rotate-3">
              VERIFIED
            </div>

            {/* Scanning line animation overlay hint */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4643B]/20 to-transparent h-1/3 w-full -translate-y-full group-hover/photo:animate-[scan_3s_linear_infinite] pointer-events-none" />
          </div>
        </div>

        {/* Bottom Branding Section */}
        <div className="px-8 pb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-white font-black text-4xl leading-none uppercase tracking-tighter italic">
                WnCC <span className="text-[#D4643B]">NITP</span>
              </h3>
              <p className="text-[#D4643B] font-mono text-[10px] mt-2 uppercase tracking-[0.2em] font-black">
                {developer.role}
              </p>
            </div>
            
            {/* Barcode representation */}
            <div className="flex gap-[3px] opacity-30 mt-auto">
              {[3, 5, 2, 4, 2, 6, 3, 2, 5].map((w, i) => (
                <div key={i} className="bg-white h-10" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 flex flex-wrap gap-2">
            {developer.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="text-[9px] font-black border border-white/10 px-3 py-1 text-white/50 rounded-md uppercase tracking-widest bg-white/5">
                {tech}
              </span>
            ))}
          </div>

          {/* Tape / Stamp Effect at bottom right */}
          <div className="absolute bottom-4 right-[-10px] rotate-[-15deg] w-28 h-10 tape-effect border border-white/10 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
            <span className="text-[9px] text-[#7A9A6B] font-black uppercase tracking-tighter shadow-sm">PERMIT_GRANTED_2026</span>
          </div>
        </div>
      </div>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#D4643B]/5 blur-[120px] rounded-full scale-0 group-hover:scale-125 transition-transform duration-1000 -z-10" />
    </div>
  );
}
