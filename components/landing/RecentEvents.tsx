'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/hooks/useGSAPAnimation';
import SectionHeader from '@/components/ui/SectionHeader';
import { EVENTS } from '@/lib/data/events';

const sortedEvents = [...EVENTS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function RecentEvents() {
  const sectionRef = useRef<HTMLElement>(null);
  const recentEvents = sortedEvents.slice(0, 3);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      '.event-card',
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, { scope: sectionRef });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container-wide">
        <SectionHeader
          title="Recent Events"
          subtitle="What we've been up to"
          accent="primary"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {recentEvents.map((event, i) => (
            <div
              key={event.id}
              className="event-card group cursor-pointer bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(0,212,255,0.2)] hover:shadow-[0_8px_30px_rgba(0,212,255,0.08)]"
              style={{ opacity: 0 }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={600}
                  height={340}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={
                    event.imagePosition
                      ? {
                          objectPosition: `${event.imagePosition.x}% ${event.imagePosition.y}%`,
                          transform: `scale(${event.imagePosition.zoom})`,
                        }
                      : undefined
                  }
                  priority={i === 0}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-tertiary)] via-transparent to-transparent" />

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  {event.status === 'upcoming' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-full animate-pulse-glow">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-primary)] animate-pulse" />
                      Upcoming
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wider bg-[var(--bg-primary)]/80 text-[var(--text-secondary)] rounded-full backdrop-blur-sm border border-[var(--border-subtle)]">
                      Completed
                    </span>
                  )}
                </div>

                {/* Date badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[0.65rem] font-medium bg-[var(--bg-primary)]/80 text-[var(--text-secondary)] rounded-full backdrop-blur-sm border border-[var(--border-subtle)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                    {formatDate(event.date)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3
                  className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {event.title}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {event.location}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-[0.65rem] font-medium rounded-full border border-[rgba(0,212,255,0.2)] text-[var(--accent-primary)] bg-[rgba(0,212,255,0.06)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-primary)] group-hover:gap-2 transition-all duration-300"
                  >
                    {event.status === 'upcoming' ? 'Register Now' : 'Learn More'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/events" className="btn-secondary">
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
