import React, { useEffect, useRef } from 'react';
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  opacity: number;
}
interface ConfettiProps {
  active: boolean;
}
const COLORS = [
  '#10b981', 
  '#3b82f6', 
  '#f59e0b', 
  '#8b5cf6', 
  '#ec4899', 
  '#06b6d4', 
];
export const ConfettiCanvas: React.FC<ConfettiProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const particles: Particle[] = [];
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4) - height * 0.1,
        size: Math.random() * 8 + 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 3,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      }); }
    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      let stillActive = false;
      particles.forEach((p) => {
        if (p.opacity <= 0) return;
        stillActive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.rotation += p.vRot;
        if (p.y > height * 0.7) {
          p.opacity -= 0.015;    }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
   if (stillActive) {
        animationId = requestAnimationFrame(render);
      }  };
    animationId = requestAnimationFrame(render);
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);
  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
