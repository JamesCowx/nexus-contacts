import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; color: string; rotation: number; rotV: number;
  life: number; maxLife: number; shape: 'rect' | 'circle';
}

const colors = ['#8B5CF6', '#EC4899', '#FBBF24', '#34D399', '#60A5FA', '#FB923C', '#F472B6', '#A78BFA'];

export function triggerConfetti(canvas: HTMLCanvasElement, originX: number, originY: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  const particles: Particle[] = Array.from({ length: 60 }, () => ({
    x: originX,
    y: originY,
    vx: (Math.random() - 0.5) * 16,
    vy: (Math.random() - 0.5) * 16 - 6,
    size: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 10,
    life: 0,
    maxLife: 60 + Math.random() * 40,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));

  let frame = 0;
  const animate = () => {
    ctx!.clearRect(0, 0, w, h);
    let alive = false;
    for (const p of particles) {
      if (p.life >= p.maxLife) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.rotation += p.rotV;
      p.life++;
      const opacity = 1 - p.life / p.maxLife;
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = opacity * 0.9;
      ctx!.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }
    if (alive) requestAnimationFrame(animate);
  };
  animate();
}
