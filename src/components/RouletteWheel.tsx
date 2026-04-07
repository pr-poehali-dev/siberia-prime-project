import { useRef, useState, useEffect, useCallback } from "react";
import { getColor } from "@/pages/Index";
import WinParticles from "@/components/WinParticles";

const NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
  11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9,
  22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const SEGMENT_COUNT = NUMBERS.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

function getSegColor(n: number) {
  if (n === 0) return "#1a6b32";
  return RED_NUMBERS.includes(n) ? "#9b1c1c" : "#111111";
}

// Web Audio API sound engine
function createAudioCtx(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch { return null; }
}

function playTick(ctx: AudioContext, vol = 0.18) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "triangle";
  osc.frequency.setValueAtTime(900 + Math.random() * 200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.07);
}

function playTension(ctx: AudioContext): () => void {
  // Нарастающий дрон — низкий гул с вибрато, усиливается к концу
  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const gain = ctx.createGain();

  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(55, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(75, ctx.currentTime + 2.5);

  lfo.type = "sine";
  lfo.frequency.setValueAtTime(4, ctx.currentTime);
  lfo.frequency.linearRampToValueAtTime(12, ctx.currentTime + 2.5);
  lfoGain.gain.setValueAtTime(1, ctx.currentTime);
  lfoGain.gain.linearRampToValueAtTime(8, ctx.currentTime + 2.5);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.4);
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.5);

  osc.start(ctx.currentTime);
  lfo.start(ctx.currentTime);

  return () => {
    try {
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.stop(ctx.currentTime + 0.15);
      lfo.stop(ctx.currentTime + 0.15);
    } catch { /* already stopped */ }
  };
}

function playWin(ctx: AudioContext) {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const t = ctx.currentTime + i * 0.12;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}

interface RouletteWheelProps {
  onSpin: (number: number) => void;
  spinning: boolean;
  setSpinning: (v: boolean) => void;
  muted: boolean;
}

export default function RouletteWheel({ onSpin, spinning, setSpinning, muted }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const rotationRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickAngleRef = useRef(0);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioCtx();
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setLastResult(null);
    setShowParticles(false);

    const ctx = getAudioCtx();

    const targetIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    const targetNumber = NUMBERS[targetIndex];

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const segmentOffset = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const totalRotation = extraSpins * 360 + (360 - segmentOffset);

    const startRotation = rotationRef.current;
    const endRotation = startRotation + totalRotation;
    lastTickAngleRef.current = startRotation;

    const duration = 4500;
    const startTime = performance.now();
    let stopTension: (() => void) | null = null;
    let tensionStarted = false;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startRotation + (endRotation - startRotation) * eased;

      setRotation(current);
      rotationRef.current = current;

      // tension drone starts at 70% progress (замедление ощутимо)
      if (ctx && !muted && progress >= 0.70 && !tensionStarted) {
        tensionStarted = true;
        stopTension = playTension(ctx);
      }

      // tick sound on each segment crossing
      if (ctx && !muted) {
        const angleDelta = current - lastTickAngleRef.current;
        if (angleDelta >= SEGMENT_ANGLE) {
          const ticksCount = Math.floor(angleDelta / SEGMENT_ANGLE);
          const speed = progress < 0.5 ? 0.25 : progress < 0.8 ? 0.2 : 0.15;
          for (let i = 0; i < ticksCount; i++) playTick(ctx, speed);
          lastTickAngleRef.current += ticksCount * SEGMENT_ANGLE;
        }
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(endRotation);
        rotationRef.current = endRotation;
        if (stopTension) stopTension();
        setSpinning(false);
        setLastResult(targetNumber);
        onSpin(targetNumber);
        if (ctx && !muted) playWin(ctx);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 3000);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const segments = NUMBERS.map((num, i) => {
    const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = (startAngle + endAngle) / 2;
    const textR = r * 0.78;
    const tx = cx + textR * Math.cos(midAngle);
    const ty = cy + textR * Math.sin(midAngle);
    const textAngle = (midAngle * 180) / Math.PI + 90;
    const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
    return { num, x1, y1, x2, y2, tx, ty, textAngle, largeArc, color: getSegColor(num) };
  });

  const resultColor = lastResult !== null ? getColor(lastResult) : null;
  const resultBg = resultColor === "red" ? "#9b1c1c" : resultColor === "black" ? "#111" : "#1a6b32";

  return (
    <div className="flex flex-col items-center gap-6 relative">
      {showParticles && <WinParticles color={resultColor} />}

      <div className="relative wheel-shadow">
        <div className="wheel-outer" style={{ width: size + 32, height: size + 32 }}>
          <svg
            width={size}
            height={size}
            style={{ transform: `rotate(${rotation}deg)`, transition: "none" }}
            className="rounded-full"
          >
            <circle cx={cx} cy={cy} r={r} fill="#1a1a1a" />
            {segments.map(({ num, x1, y1, x2, y2, tx, ty, textAngle, largeArc, color }) => (
              <g key={num}>
                <path
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={color}
                  stroke="#c9a84c"
                  strokeWidth="0.8"
                />
                <text
                  x={tx}
                  y={ty}
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                  style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
                >
                  {num}
                </text>
              </g>
            ))}
            <circle cx={cx} cy={cy} r={22} fill="#c9a84c" />
            <circle cx={cx} cy={cy} r={18} fill="#1a1a1a" />
            <circle cx={cx} cy={cy} r={10} fill="#c9a84c" />
          </svg>
        </div>

        <div className="pointer absolute top-[-6px] left-1/2 -translate-x-1/2 z-10">
          <div className="w-4 h-8 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-gold drop-shadow-lg" />
          </div>
        </div>
      </div>

      {lastResult !== null && (
        <div className="result-badge animate-scale-in" style={{ backgroundColor: resultBg }}>
          <span className="font-playfair text-5xl font-black text-white">{lastResult}</span>
          <span className="font-oswald text-sm tracking-widest uppercase text-white/80 mt-1">
            {resultColor === "red" ? "Красное" : resultColor === "black" ? "Чёрное" : "Зеро"}
          </span>
        </div>
      )}

      <button onClick={spin} disabled={spinning} className="spin-btn">
        {spinning ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Вращается...
          </span>
        ) : (
          "КРУТИТЬ КОЛЕСО"
        )}
      </button>
    </div>
  );
}