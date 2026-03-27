'use client';
import { useRef, useEffect, useCallback, useMemo } from 'react';

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  vx: number;
  vy: number;
  returning: boolean;
}

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export default function DotGrid({
  dotSize = 2,
  gap = 20,
  baseColor = '#232323',
  activeColor = '#d1fe17',
  proximity = 50,
  shockRadius = 100,
  shockStrength = 1,
  maxSpeed = 6000,
  resistance = 100,
  returnDuration = 0.1,
  className = '',
}: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, speed: 0, lastX: 0, lastY: 0, lastTime: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    sizeRef.current = { w: width, h: height };

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cell = dotSize + gap;
    const cols = Math.floor((width + gap) / cell);
    const rows = Math.floor((height + gap) / cell);
    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          vx: 0,
          vy: 0,
          returning: false,
        });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    const parent = canvasRef.current?.parentElement;
    if (parent) ro.observe(parent);
    return () => ro.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    let rafId: number;
    const proxSq = proximity * proximity;
    const returnSpeed = 1 / Math.max(returnDuration, 0.016);
    const dampFactor = Math.max(1, resistance) * 0.001;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const { x: px, y: py } = pointerRef.current;
      const dt = 1 / 60;

      for (const dot of dotsRef.current) {
        // Physics: return to origin with spring
        if (dot.xOffset !== 0 || dot.yOffset !== 0) {
          const springX = -dot.xOffset * returnSpeed * 8;
          const springY = -dot.yOffset * returnSpeed * 8;
          dot.vx += springX * dt;
          dot.vy += springY * dt;
          dot.vx *= 1 - dampFactor;
          dot.vy *= 1 - dampFactor;
          dot.xOffset += dot.vx * dt;
          dot.yOffset += dot.vy * dt;

          if (Math.abs(dot.xOffset) < 0.01 && Math.abs(dot.yOffset) < 0.01 && Math.abs(dot.vx) < 0.1 && Math.abs(dot.vy) < 0.1) {
            dot.xOffset = 0;
            dot.yOffset = 0;
            dot.vx = 0;
            dot.vy = 0;
          }
        }

        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let r = baseRgb.r, g = baseRgb.g, b = baseRgb.b;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        }

        ctx.beginPath();
        ctx.arc(ox, oy, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseRgb, activeRgb, dotSize, returnDuration, resistance]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const s = maxSpeed / speed;
        vx *= s;
        vy *= s;
        speed = maxSpeed;
      }

      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      // Push dots away on fast movement
      if (speed > 80) {
        for (const dot of dotsRef.current) {
          const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
          if (dist < proximity && dist > 0) {
            const pushX = (dot.cx - pr.x) / dist * speed * 0.003 + vx * 0.003;
            const pushY = (dot.cy - pr.y) / dist * speed * 0.003 + vy * 0.003;
            dot.vx += pushX;
            dot.vy += pushY;
          }
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && dist > 0) {
          const falloff = 1 - dist / shockRadius;
          const pushX = (dot.cx - cx) / dist * shockStrength * falloff * 30;
          const pushY = (dot.cy - cy) / dist * shockStrength * falloff * 30;
          dot.vx += pushX;
          dot.vy += pushY;
        }
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, [maxSpeed, proximity, shockRadius, shockStrength]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
