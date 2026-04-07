import { useEffect, useRef } from "react";

interface WinParticlesProps {
  color: "red" | "black" | "green" | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  shape: "rect" | "circle" | "diamond";
}

function getParticleColors(color: "red" | "black" | "green" | null): string[] {
  if (color === "red") return ["#ff4444", "#ff8888", "#ffcc00", "#ff6600", "#ffffff"];
  if (color === "green") return ["#44ff88", "#00cc44", "#ffcc00", "#88ffcc", "#ffffff"];
  return ["#c9a84c", "#f0d080", "#ffffff", "#aaaaaa", "#ffcc44"];
}

export default function WinParticles({ color }: WinParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const colors = getParticleColors(color);

    particlesRef.current = Array.from({ length: 90 }, () => {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 3 + Math.random() * 7;
      return {
        x: W / 2,
        y: H / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 5 + Math.random() * 8,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        shape: (["rect", "circle", "diamond"] as const)[Math.floor(Math.random() * 3)],
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;

      particlesRef.current.forEach(p => {
        if (p.alpha <= 0) return;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.99;
        p.alpha -= 0.012;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "diamond") {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, 0);
          ctx.lineTo(0, p.size / 2);
          ctx.lineTo(-p.size / 2, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      });

      if (alive) {
        animRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full z-20"
      style={{ borderRadius: "inherit" }}
    />
  );
}
