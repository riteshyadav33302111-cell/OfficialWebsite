'use client';
// import { useRef } from 'react';
import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
// import { gsap } from '@/hooks/useGSAPAnimation';
import { gsap, ScrollTrigger } from '@/hooks/useGSAPAnimation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { STATS, SITE_CONFIG } from '@/lib/constants';
// const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false });
/* ── Lazy-load the heavy 3D canvas (no SSR) ── */
const MacBookCanvas = dynamic(
  () => import('@/components/three/MacBookCanvas'),
  { ssr: false }
);
/* ── About section "values" data ── */
const values = [
  { icon: '⚡', title: 'Innovation', desc: 'Pushing boundaries with cutting-edge tech' },
  { icon: '🤝', title: 'Collaboration', desc: 'Building together, growing together' },
  { icon: '📚', title: 'Learning', desc: 'Continuous growth through hands-on projects' },
  { icon: '🌍', title: 'Community', desc: 'A family of passionate technologists' },
];
export default function HeroSection() {
  // const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  /* ── Entrance animation for hero text ── */
  useGSAP(() => {
    if (!pinnedRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-tag', { opacity: 0, y: 20, duration: 0.5, delay: 0.3 })
      .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.2')
      .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
      .from('.hero-tagline', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-stats > div', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, '-=0.2')
      .from('.hero-cta', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, '-=0.2')
      .from('.hero-scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.1');
  }, { scope: pinnedRef });
  /* ── Scroll-driven animation (scrub) ── */
  useGSAP(() => {
    if (!containerRef.current || !pinnedRef.current) return;
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      },
    });
    /* Hero text fades out: 0% → 35% */
    scrollTl.to(
      '.hero-text-column',
      { opacity: 0, x: -80, duration: 0.35, ease: 'power2.in' },
      0
    );
    /* Scroll indicator fades early: 0% → 15% */
    scrollTl.to(
      '.hero-scroll-indicator',
      { opacity: 0, y: 20, duration: 0.15 },
      0
    );
    /* Background overlay (darken for transition): 30% → 60% */
    scrollTl.fromTo(
      '.hero-about-transition-overlay',
      { opacity: 0 },
      { opacity: 0.3, duration: 0.3 },
      0.3
    );
    scrollTl.to(
      '.hero-about-transition-overlay',
      { opacity: 0, duration: 0.2 },
      0.6
    );
    /* About text column fades in: 55% → 90% */
    scrollTl.fromTo(
      '.about-text-column',
      { opacity: 0, x: 80 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' },
      0.55
    );
    /* About section header animate */
    scrollTl.fromTo(
      '.about-section-header',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
      0.55
    );
    /* About values stagger in: 65% → 95% */
    scrollTl.fromTo(
      '.about-value-card',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.06, duration: 0.2, ease: 'power2.out' },
      0.65
    );
    /* Graffiti bg parallax */
    scrollTl.to(
      '.hero-bg-image',
      { y: -60, duration: 1, ease: 'none' },
      0
    );
  }, { scope: containerRef, dependencies: [isMobile] });
  return (
    // <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
    //   {/* Graffiti Background */}
    //   <div className="absolute inset-0 z-0">
    //     <Image
    //       src="/images/graffiti/hero-bg.png"
    //       alt=""
    //       fill
    //       className="object-cover opacity-20"
    //       priority
    //     />
    //     <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.7)] via-[rgba(10,10,10,0.5)] to-[var(--bg-primary)]" />
    //   </div>
    <div ref={containerRef} className="hero-about-container">
      <div ref={pinnedRef} className="hero-about-pinned">
        {/* ── Background layers ── */}
        <div className="hero-about-bg">
          <Image
            src="/images/graffiti/hero-bg.svg"
            alt=""
            fill
            className="hero-bg-image object-cover opacity-98"
            priority
            unoptimized
          />
          <div className="hero-about-bg-gradient" />
        </div>
      {/* Particle Field */}
      <div className="absolute inset-0 z-[1]">
        {/* <ParticleField /> */}
      </div>
        {/* Transition overlay */}
        <div className="hero-about-transition-overlay" />
      {/* Noise */}
      <div className="absolute inset-0 noise-overlay z-[2] pointer-events-none" />
        {/* Noise */}
        <div className="hero-about-noise noise-overlay" />
      {/* Content
      <div className="relative z-10 container-narrow text-center flex flex-col items-center gap-6 py-32">
        <span className="hero-tag text-mono text-xs tracking-[0.2em]">
          // ESTABLISHED 2018 — NIT PATNA
        </span> */}
        {/* ── 3D Canvas overlay ── */}
        <div className="macbook-canvas-overlay">
          <MacBookCanvas scrollProgress={scrollProgressRef} isMobile={isMobile} />
        </div>
        {/* {/* <h1 className="hero-title text-display gradient-text-coral">
          Web & Coding
          <br />
          Club
        </h1> */}
        {/* <p className="hero-subtitle text-heading text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-display)' }}>
          NIT Patna
        </p> */}
        {/* ── Hero Text Column (LEFT) ── */}
        <div className="hero-text-column">

        {/* <p className="hero-tagline text-body max-w-lg text-lg">
          {SITE_CONFIG.tagline}. {SITE_CONFIG.description.slice(0, 120)}...
        </p> */}
          <h1 className="hero-title text-display gradient-text-primary">
            Web &amp; Coding
            <br />
            Club
          </h1>
        {/* Stats
        <div className="hero-stats flex flex-wrap justify-center gap-8 md:gap-12 mt-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-mono text-[0.65rem]">{stat.label}</span>
            </div>
          ))} */}
          <p
            className="hero-subtitle text-heading text-[var(--text-secondary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            NIT Patna
          </p>
          <p className="hero-tagline text-body max-w-lg text-lg">
            {SITE_CONFIG.tagline}. {SITE_CONFIG.description.slice(0, 120)}...
          </p>
          {/* Stats */}
          <div className="hero-stats flex flex-wrap gap-8 md:gap-12 mt-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span
                  className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-mono text-[0.65rem]">{stat.label}</span>
              </div>
            ))}
          </div>
          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href="/team" className="hero-cta btn-primary">
              Explore Teams
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/events" className="hero-cta btn-secondary">
              View Events
            </Link>
          </div>
        </div>
        {/* ── Scroll indicator ── */}
        <div className="hero-scroll-indicator">
          <span className="text-mono text-[0.6rem] tracking-[0.15em] text-[var(--text-muted)]">
            SCROLL
          </span>
          <div className="scroll-line">
            <div className="scroll-line-inner" />
          </div>
        </div>
        {/* ── About Text Column (RIGHT — fades in on scroll) ── */}
        <div className="about-text-column">
          {/* Section Header */}
          <div className="about-section-header">
            <div
              className="h-[2px] w-16 rounded-full mb-4"
              style={{
                background: 'linear-gradient(90deg, var(--accent-primary), transparent)',
              }}
            />
            <h2 className="text-heading gradient-text-secondary">About Us</h2>
            <p className="text-body max-w-md mt-2">What drives us forward</p>
          </div>
          {/* About description */}
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] mt-6">
            {SITE_CONFIG.description}
          </p>
          <p className="text-body mt-4">
            From weekend hackathons to structured bootcamps, from blockchain experiments
            to AI research — we provide the platform, mentorship, and community for students
            to transform their ideas into impactful projects.
          </p>
          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="about-value-card glass-card p-4 flex flex-col gap-2"
              >
                <span className="text-2xl">{v.icon}</span>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  {v.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    {/* </section> */}
    </div>
  );
}
