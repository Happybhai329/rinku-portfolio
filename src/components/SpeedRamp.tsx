"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";

interface ControlPoint {
  id: number;
  x: number;
  y: number;
  label: string;
}

export default function SpeedRamp() {
  const [points, setPoints] = useState<ControlPoint[]>([
    { id: 0, x: 50, y: 130, label: "Intro" },      // 100% speed
    { id: 1, x: 150, y: 40, label: "Ramp Up" },     // 400% speed
    { id: 2, x: 250, y: 170, label: "Freeze/Slow" }, // 25% speed
    { id: 3, x: 350, y: 130, label: "Outro" }      // 100% speed
  ]);

  const [isPlaying, setIsPlaying] = useState(true);
  const [playheadT, setPlayheadT] = useState(0); // 0 to 1
  const [shutterAngle, setShutterAngle] = useState(0);
  const containerRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Height is 200px. Y=180 is 0% speed. Y=20 is 800% speed.
  const yToSpeed = (y: number) => {
    const clampedY = Math.max(20, Math.min(180, y));
    // Linear mapping: Y=180 -> 0%, Y=20 -> 800%
    const percentage = ((180 - clampedY) / 160) * 800;
    return Math.round(percentage);
  };

  // Convert speed percentage to slider height
  const speedToY = (speed: number) => {
    const percentage = speed / 800;
    return 180 - percentage * 160;
  };

  // Evaluate cubic bezier coordinates at t
  // P0, P1, P2, P3 are the control points
  const evaluateBezier = useCallback((t: number) => {
    const p0 = points[0];
    const p1 = points[1];
    const p2 = points[2];
    const p3 = points[3];

    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    // Bezier curve formula
    const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
    const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;

    return { x, y };
  }, [points]);

  // Update playhead and shutter rotation
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = 0;
      return;
    }

    const tick = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = (timestamp - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = timestamp;

      // Speed up playhead cycle (cycle every 3.5 seconds)
      setPlayheadT((prevT) => {
        const nextT = prevT + elapsed * 0.28;
        return nextT > 1 ? 0 : nextT;
      });

      // Calculate current speed from curve
      const pos = evaluateBezier(playheadT);
      const speedPct = yToSpeed(pos.y); // e.g. 100, 400, 25
      const speedFactor = speedPct / 100; // e.g. 1.0, 4.0, 0.25

      // Spin the shutter reel based on current speed
      setShutterAngle((prevAngle) => (prevAngle + elapsed * 360 * speedFactor * 0.8) % 360);

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, playheadT, evaluateBezier]);

  // Handle Dragging of Control Points (Y-axis only to keep timeline order logical)
  const handleDrag = (id: number) => (e: React.MouseEvent<SVGCircleElement> | React.TouchEvent<SVGCircleElement>) => {
    e.preventDefault();
    const isTouch = "touches" in e;
    
    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const clientY = "touches" in moveEvent 
        ? moveEvent.touches[0].clientY 
        : (moveEvent as MouseEvent).clientY;

      // Calculate relative Y inside the SVG coordinates (0 - 200)
      const relativeY = ((clientY - rect.top) / rect.height) * 200;
      // Clamp Y to grid bounds
      const clampedY = Math.max(20, Math.min(180, relativeY));

      setPoints((prevPoints) =>
        prevPoints.map((p) => (p.id === id ? { ...p, y: clampedY } : p))
      );
    };

    const upHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", upHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
    window.addEventListener("touchmove", moveHandler, { passive: true });
    window.addEventListener("touchend", upHandler);
  };

  const handleReset = () => {
    setPoints([
      { id: 0, x: 50, y: 130, label: "Intro" },
      { id: 1, x: 150, y: 40, label: "Ramp Up" },
      { id: 2, x: 250, y: 170, label: "Freeze/Slow" },
      { id: 3, x: 350, y: 130, label: "Outro" }
    ]);
  };

  // Build SVG path string for bezier curve
  // P0 to P3 path
  const p0 = points[0];
  const p1 = points[1];
  const p2 = points[2];
  const p3 = points[3];
  
  // Custom path using cubic bezier segments
  const pathD = `M 0 ${p0.y} C 100 ${p0.y}, 100 ${p1.y}, 150 ${p1.y} C 200 ${p1.y}, 200 ${p2.y}, 250 ${p2.y} C 300 ${p2.y}, 300 ${p3.y}, 400 ${p3.y}`;

  // Evaluate current point values
  const currentPos = evaluateBezier(playheadT);
  const currentSpeed = yToSpeed(currentPos.y);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-center bg-zinc-950 p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Left: Bezier Speed Graph */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">DaVinci Speed Ramp Editor</span>
            <span className="text-[10px] bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded font-mono uppercase">
              Speed: {currentSpeed}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center p-1.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-gold-500 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-500 hover:text-white transition-colors font-mono cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Curve
            </button>
          </div>
        </div>

        {/* SVG Editor Area */}
        <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border border-white/10 bg-black/60 select-none">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 pointer-events-none opacity-[0.03] border-b border-r border-white" />

          {/* Reference Lines (100% speed line) */}
          <div className="absolute top-[65%] left-0 right-0 h-[1px] border-t border-dashed border-zinc-700/60 pointer-events-none" />
          <span className="absolute right-2 top-[60%] text-[8px] font-mono text-zinc-600">100% (Normal Speed)</span>
          <span className="absolute right-2 top-[12%] text-[8px] font-mono text-zinc-600">800% (Fast Motion)</span>
          <span className="absolute right-2 top-[88%] text-[8px] font-mono text-zinc-600">0% (Freeze)</span>

          <svg
            ref={containerRef}
            viewBox="0 0 400 200"
            className="w-full h-full overflow-visible"
          >
            {/* The Bezier Curve Path */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="3"
              className="drop-shadow-[0_0_8px_rgba(197,168,128,0.3)]"
            />

            {/* Playhead vertical line */}
            <line
              x1={currentPos.x}
              y1="0"
              x2={currentPos.x}
              y2="200"
              stroke="#c5a880"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="opacity-70"
            />

            {/* Pulsing playhead center intersection node */}
            <circle
              cx={currentPos.x}
              cy={currentPos.y}
              r="5"
              fill="#c5a880"
              className="animate-pulse"
            />

            {/* Interactive Control Points */}
            {points.map((pt) => (
              <g key={pt.id} className="cursor-ns-resize group/pt">
                {/* Invisible larger hover zone for easier touch target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="16"
                  fill="transparent"
                  onMouseDown={handleDrag(pt.id)}
                  onTouchStart={handleDrag(pt.id)}
                />
                {/* Visual point */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill="#050505"
                  stroke="#c5a880"
                  strokeWidth="2.5"
                  className="transition-transform group-hover/pt:scale-125"
                  onMouseDown={handleDrag(pt.id)}
                  onTouchStart={handleDrag(pt.id)}
                />
                {/* Control Point text */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="8"
                  fontFamily="monospace"
                  className="pointer-events-none uppercase tracking-wider group-hover/pt:fill-white transition-colors"
                >
                  {pt.label}
                </text>
              </g>
            ))}

            {/* Definitions */}
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8f6227" />
                <stop offset="50%" stopColor="#c5a880" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Right: Motion/Pacing Shutter Demo */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-4 border border-white/5 bg-zinc-900/40 rounded-xl">
        <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-4 text-center">Pacing & Speed Ramping</span>
        
        {/* Shutter Animation Graphic */}
        <div className="relative w-32 h-32 flex items-center justify-center border-4 border-zinc-800 rounded-full bg-black shadow-inner overflow-hidden select-none">
          {/* Shutter Blades group rotating */}
          <div
            className="w-28 h-28 relative transition-transform duration-75 ease-linear"
            style={{ transform: `rotate(${shutterAngle}deg)` }}
          >
            {/* 6 Camera/Film shutter blades */}
            {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
              <div
                key={idx}
                className="absolute top-0 left-1/2 w-14 h-28 origin-bottom bg-zinc-900 border-r border-black/40"
                style={{
                  transform: `translateX(-50%) rotate(${angle}deg) skewX(25deg)`,
                }}
              />
            ))}
            
            {/* Center golden lens circle */}
            <div className="absolute inset-8 rounded-full border border-gold-500/20 bg-gradient-to-tr from-gold-900/10 to-gold-500/40 backdrop-blur-sm" />
          </div>
          
          {/* Static crosshairs over lens */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-[1px] bg-white/20" />
            <div className="h-4 w-[1px] bg-white/20" />
          </div>
        </div>

        {/* Speed indicator text */}
        <div className="mt-4 flex flex-col items-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Simulation Speed</span>
          <span className="text-lg font-mono text-gold-500 font-bold mt-0.5">
            {currentSpeed === 100 ? "1.0x" : `${(currentSpeed / 100).toFixed(2)}x`}
          </span>
        </div>
      </div>
    </div>
  );
}
