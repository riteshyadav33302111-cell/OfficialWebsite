'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/hooks/useGSAPAnimation';
import SectionHeader from '@/components/ui/SectionHeader';
import { TEAMS } from '@/lib/data/teams';

export default function TeamsOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      '.team-card',
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container-wide">
        <SectionHeader
          title="Our Teams"
          subtitle="7 specialized divisions driving innovation"
          accent="primary"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
          {TEAMS.map((team) => (
            <Link
              key={team.id}
              href={`/team#${team.slug}`}
              className="team-card group cursor-pointer relative bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden p-6 transition-all duration-500 hover:-translate-y-1"
              style={{
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = `${team.color}4D`;
                el.style.boxShadow = `0 8px 30px ${team.color}15`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = '';
                el.style.boxShadow = '';
              }}
            >
              {/* Top accent stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 group-hover:h-[4px]"
                style={{ background: team.color }}
              />

              {/* Icon with glow ring */}
              <div className="relative mb-4 inline-flex">
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-20 scale-150"
                  style={{ background: team.color }}
                />
                <span className="relative text-4xl block">{team.icon}</span>
              </div>

              {/* Team name */}
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-2 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {team.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                {team.description}
              </p>

              {/* Leader info */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--border-subtle)]">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[0.5rem] font-bold text-white"
                  style={{ background: team.color }}
                >
                  {team.leader.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {team.leader.name}
                  </p>
                  <p className="text-[0.6rem] text-[var(--text-muted)]">
                    {team.leader.role}
                  </p>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-medium border border-[var(--border-subtle)] text-[var(--text-muted)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: team.color }}
                  />
                  {team.members.length + 1} members
                </span>

                <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all duration-300 text-sm">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/team" className="btn-secondary">
            Meet All Teams
          </Link>
        </div>
      </div>
    </section>
  );
}
