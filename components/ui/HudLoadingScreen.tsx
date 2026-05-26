'use client';

import { useEffect, useState, useRef } from 'react';
import { useProgress } from '@react-three/drei';

interface HudLoadingScreenProps {
  onLoadingComplete?: () => void;
}

export default function HudLoadingScreen({ onLoadingComplete }: HudLoadingScreenProps) {
  const { progress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const animationRef = useRef<number | null>(null);
  const targetRef = useRef(0);

  // Smoothly animate the displayed progress number
  useEffect(() => {
    targetRef.current = Math.round(progress);

    const animate = () => {
      setDisplayProgress((prev) => {
        const diff = targetRef.current - prev;
        if (Math.abs(diff) < 1) return targetRef.current;
        return prev + diff * 0.08;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [progress]);

  // When loading completes, trigger fade out
  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const removeTimer = setTimeout(() => {
          setIsVisible(false);
          onLoadingComplete?.();
        }, 1200);
        return () => clearTimeout(removeTimer);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [active, progress, onLoadingComplete]);

  if (!isVisible) return null;

  const rounded = Math.round(displayProgress);

  // Progress arc: stroke-dasharray for the progress ring
  const progressRadius = 82;
  const progressCircumference = 2 * Math.PI * progressRadius;
  const progressOffset = progressCircumference - (progressCircumference * rounded) / 100;

  return (
    <div
      className={`hud-loading-screen ${isFadingOut ? 'hud-loading-screen--fade-out' : ''}`}
      id="hud-loading-screen"
    >
      {/* Scanline effect */}
      <div className="hud-scanlines" />

      {/* Vignette */}
      <div className="hud-vignette" />

      {/* Central HUD element */}
      <div className="hud-center-wrapper">
        <svg className="hud-main-svg" viewBox="0 0 300 300">
          {/* ── OUTERMOST: Tick marks circle ── */}
          <circle
            cx="150"
            cy="150"
            r="140"
            className="hud-ring hud-ring--ticks"
            strokeWidth="0.5"
            strokeDasharray="1.5 5.5"
          />

          {/* ── Outer dashed reference ring ── */}
          <circle
            cx="150"
            cy="150"
            r="130"
            className="hud-ring hud-ring--outer-ref"
            strokeWidth="1"
            strokeDasharray="3 8"
          />

          {/* ── PROGRESS ARC — fills as loading progresses ── */}
          <circle
            cx="150"
            cy="150"
            r={progressRadius}
            className="hud-ring hud-ring--progress-track"
            strokeWidth="4"
          />
          <circle
            cx="150"
            cy="150"
            r={progressRadius}
            className="hud-ring hud-ring--progress"
            strokeWidth="4"
            strokeDasharray={progressCircumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 0.3s ease-out',
            }}
          />

          {/* ── Rotating thick segmented ring (CW) ── */}
          <circle
            cx="150"
            cy="150"
            r="104"
            className="hud-ring hud-ring--seg-cw"
            strokeWidth="6"
            strokeDasharray="30 15 60 20 40 30"
          />

          {/* ── Counter-rotating segmented ring (CCW) ── */}
          <circle
            cx="150"
            cy="150"
            r="96"
            className="hud-ring hud-ring--seg-ccw"
            strokeWidth="3"
            strokeDasharray="20 40 10 30 50 20"
          />

          {/* ── Rotating inner thin ring (CW fast) ── */}
          <circle
            cx="150"
            cy="150"
            r="88"
            className="hud-ring hud-ring--inner-cw"
            strokeWidth="2"
            strokeDasharray="15 25 40 30"
          />

          {/* ── Inner solid border ── */}
          <circle
            cx="150"
            cy="150"
            r="66"
            className="hud-ring hud-ring--inner-border"
            strokeWidth="1"
          />

          {/* ── Innermost glow ring ── */}
          <circle
            cx="150"
            cy="150"
            r="58"
            className="hud-ring hud-ring--innermost"
            strokeWidth="0.5"
          />

          {/* ── Corner brackets (crosshair-style) ── */}
          {/* Top-Left */}
          <path d="M 60 55 L 55 55 L 55 60" className="hud-bracket" />
          {/* Top-Right */}
          <path d="M 240 55 L 245 55 L 245 60" className="hud-bracket" />
          {/* Bottom-Left */}
          <path d="M 60 245 L 55 245 L 55 240" className="hud-bracket" />
          {/* Bottom-Right */}
          <path d="M 240 245 L 245 245 L 245 240" className="hud-bracket" />

          {/* ── Cardinal pointers (triangles) ── */}
          {/* North */}
          <polygon points="150,4 145,14 155,14" className="hud-pointer" />
          {/* South */}
          <polygon points="150,296 145,286 155,286" className="hud-pointer" />
          {/* West */}
          <polygon points="4,150 14,145 14,155" className="hud-pointer" />
          {/* East */}
          <polygon points="296,150 286,145 286,155" className="hud-pointer" />

          {/* ── Dots around circumference (decorative) ── */}
          {[45, 135, 225, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x = 150 + 120 * Math.cos(rad);
            const y = 150 + 120 * Math.sin(rad);
            return (
              <g key={angle}>
                <circle cx={x} cy={y} r="2" className="hud-dot" />
                <line
                  x1={150 + 115 * Math.cos(rad)}
                  y1={150 + 115 * Math.sin(rad)}
                  x2={150 + 125 * Math.cos(rad)}
                  y2={150 + 125 * Math.sin(rad)}
                  className="hud-tick-line"
                />
              </g>
            );
          })}

          {/* ── Small data readout rectangles ── */}
          <rect x="130" y="45" width="40" height="4" rx="1" className="hud-data-bar" />
          <rect x="130" y="251" width="40" height="4" rx="1" className="hud-data-bar" />

          {/* ── Center percentage text ── */}
          <text x="150" y="147" className="hud-pct-text">
            {rounded}%
          </text>

          {/* ── Small status dots below percentage ── */}
          <g className="hud-status-dots">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect
                key={i}
                x={132 + i * 5.5}
                y="165"
                width="3"
                height="3"
                rx="0.5"
                className={`hud-status-dot ${i <= rounded / 15 ? 'hud-status-dot--active' : ''}`}
              />
            ))}
          </g>
        </svg>

        {/* Loading text below the HUD */}
        <p className="hud-loading-label">
          Loading
        </p>
      </div>

      {/* Bottom-left data readout */}
      <div className="hud-bottom-data">
        <span className="hud-data-line">SYS.INIT <span className="hud-data-val">{rounded}%</span></span>
        <span className="hud-data-line">3D_ASSET <span className="hud-data-val">{active ? 'LOADING' : 'READY'}</span></span>
      </div>

      {/* Top-right data readout */}
      <div className="hud-top-data">
        <span className="hud-data-line">WEB &amp; CODING CLUB</span>
        <span className="hud-data-line hud-data-line--dim">NIT PATNA // v1.0</span>
      </div>
    </div>
  );
}
