'use client';

import { useEffect, useRef } from 'react';

export default function ContactGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let animationFrameId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // High DPI screens
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      // Lerp mouse for smoothness
      mouseX += (targetMouseX - mouseX) * 0.15;
      mouseY += (targetMouseY - mouseY) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // Grid settings
      const spacing = 35; // tighter grid
      const resolution = 5; // px per line segment for much smoother curves
      const maxDist = 350; // radius of gravity well
      const pullStrength = 1.0; // 100% pull at the singularity

      const distort = (x: number, y: number) => {
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDist && dist > 0) {
          // Steeper gravity curve for a more dramatic black hole
          const pull = Math.pow((maxDist - dist) / maxDist, 3);
          return {
            x: x + dx * pull * pullStrength,
            y: y + dy * pull * pullStrength,
          };
        }
        return { x, y };
      };

      ctx.strokeStyle = 'rgba(245, 240, 232, 0.05)';
      ctx.lineWidth = 1;

      // Draw vertical lines
      // Calculate offset so grid is centered
      const xOffset = (width % spacing) / 2;
      for (let x = xOffset; x <= width; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y <= height; y += resolution) {
          const p = distort(x, y);
          if (y === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Draw horizontal lines
      const yOffset = (height % spacing) / 2;
      for (let y = yOffset; y <= height; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += resolution) {
          const p = distort(x, y);
          if (x === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 15%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 15%, transparent 100%)',
      }}
      aria-hidden="true"
    />
  );
}
