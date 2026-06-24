"use client";

import React, { useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";

interface WheelState {
  x: number;
  y: number;
  hue: number;
  sat: number;
}

export default function ColorWheel() {
  const [lift, setLift] = useState<WheelState>({ x: 0, y: 0, hue: 0, sat: 0 });
  const [gamma, setGamma] = useState<WheelState>({ x: 0, y: 0, hue: 0, sat: 0 });
  const [gain, setGain] = useState<WheelState>({ x: 0, y: 0, hue: 0, sat: 0 });

  // Wheel sliders (Master Wheel values)
  const [liftVal, setLiftVal] = useState<number>(0); // -100 to 100
  const [gammaVal, setGammaVal] = useState<number>(0);
  const [gainVal, setGainVal] = useState<number>(0);

  const maxDrag = 42;    // Max drag radius for the crosshair indicator

  const handleReset = (type: "lift" | "gamma" | "gain") => {
    if (type === "lift") {
      setLift({ x: 0, y: 0, hue: 0, sat: 0 });
      setLiftVal(0);
    } else if (type === "gamma") {
      setGamma({ x: 0, y: 0, hue: 0, sat: 0 });
      setGammaVal(0);
    } else if (type === "gain") {
      setGain({ x: 0, y: 0, hue: 0, sat: 0 });
      setGainVal(0);
    }
  };

  const handleResetAll = () => {
    handleReset("lift");
    handleReset("gamma");
    handleReset("gain");
  };

  const processDrag = useCallback((
    clientX: number,
    clientY: number,
    element: HTMLDivElement,
    setState: React.Dispatch<React.SetStateAction<WheelState>>
  ) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDrag) {
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * maxDrag;
      dy = Math.sin(angle) * maxDrag;
    }

    const angleRad = Math.atan2(-dy, dx); // Invert Y for standard coordinate grid
    let hueDegree = (angleRad * 180) / Math.PI;
    if (hueDegree < 0) hueDegree += 360;

    const satPercentage = Math.round((Math.sqrt(dx * dx + dy * dy) / maxDrag) * 100);

    setState({
      x: dx,
      y: dy,
      hue: Math.round(hueDegree),
      sat: satPercentage,
    });
  }, []);

  const setupDrag = (
    setState: React.Dispatch<React.SetStateAction<WheelState>>
  ) => {
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      const element = e.currentTarget;
      const moveHandler = (moveEvent: MouseEvent) => {
        processDrag(moveEvent.clientX, moveEvent.clientY, element, setState);
      };
      const upHandler = () => {
        window.removeEventListener("mousemove", moveHandler);
        window.removeEventListener("mouseup", upHandler);
      };
      window.addEventListener("mousemove", moveHandler);
      window.addEventListener("mouseup", upHandler);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const moveHandler = (moveEvent: TouchEvent) => {
        if (moveEvent.touches.length === 0) return;
        processDrag(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY, element, setState);
      };
      const upHandler = () => {
        window.removeEventListener("touchmove", moveHandler);
        window.removeEventListener("touchend", upHandler);
      };
      window.addEventListener("touchmove", moveHandler, { passive: true });
      window.addEventListener("touchend", upHandler);
    };

    return {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    };
  };

  // Build overlay style string based on color wheels values
  // We use CSS variables to tint overlays on the thumbnail image
  const liftColor = lift.sat > 0 ? `hsla(${lift.hue}, 100%, 30%, ${lift.sat * 0.003})` : "transparent";
  const gammaColor = gamma.sat > 0 ? `hsla(${gamma.hue}, 100%, 50%, ${gamma.sat * 0.0035})` : "transparent";
  const gainColor = gain.sat > 0 ? `hsla(${gain.hue}, 100%, 75%, ${gain.sat * 0.004})` : "transparent";

  // Brightness, Contrast & Saturation calculations from Master Sliders
  // Lift values affect dark tones brightness
  // Gamma values affect midtone brightness
  // Gain values affect highlight brightness
  const brightness = 100 + (liftVal * 0.15) + (gammaVal * 0.1) + (gainVal * 0.05);
  const contrast = 100 + (gainVal * 0.2) - (liftVal * 0.1);
  const saturation = 100 + (gammaVal * 0.2);

  const imageFilterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-center bg-zinc-950 p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Absolute faint background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Left: Preview Panel */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Resolve Live Grading Preview</span>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-500 hover:text-white transition-colors font-mono cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        </div>

        {/* Thumbnail Frame */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black group select-none">
          {/* Base Cinematic Image (Pexels premium landscape) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&dpr=1"
            alt="Color grading source"
            className="w-full h-full object-cover transition-all duration-75 pointer-events-none"
            style={imageFilterStyle}
          />

          {/* Color Wheel Overlay Layers mimicking Lift, Gamma, Gain */}
          <div
            className="absolute inset-0 mix-blend-multiply pointer-events-none transition-all duration-75"
            style={{ backgroundColor: liftColor }}
          />
          <div
            className="absolute inset-0 mix-blend-overlay pointer-events-none transition-all duration-75"
            style={{ backgroundColor: gammaColor }}
          />
          <div
            className="absolute inset-0 mix-blend-screen pointer-events-none transition-all duration-75"
            style={{ backgroundColor: gainColor }}
          />

          {/* Info Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded text-[10px] font-mono text-white flex gap-3 border border-white/5">
            <div><span className="text-zinc-500">LIFT:</span> <span className="text-gold-500 font-bold">{liftVal > 0 ? `+${liftVal}` : liftVal}</span></div>
            <div><span className="text-zinc-500">GAMMA:</span> <span className="text-gold-500 font-bold">{gammaVal > 0 ? `+${gammaVal}` : gammaVal}</span></div>
            <div><span className="text-zinc-500">GAIN:</span> <span className="text-gold-500 font-bold">{gainVal > 0 ? `+${gainVal}` : gainVal}</span></div>
          </div>
          
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[9px] font-mono text-zinc-400 border border-white/5 uppercase tracking-wider">
            Active Nodes: 03
          </div>
        </div>
      </div>

      {/* Right: Wheels Panel */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 select-none">
        <div className="grid grid-cols-3 gap-4">
          {/* Wheel 1: Lift */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Lift</span>
            <div
              className="relative w-28 h-28 rounded-full border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner group"
              {...setupDrag(setLift)}
              onDoubleClick={() => handleReset("lift")}
            >
              {/* Outer tick marks for aesthetic */}
              <div className="absolute inset-1.5 rounded-full border border-dashed border-zinc-800/60 pointer-events-none" />
              
              {/* Scope cross lines */}
              <div className="absolute left-1/2 top-2 bottom-2 w-[1px] bg-zinc-900/40 pointer-events-none -translate-x-1/2" />
              <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-zinc-900/40 pointer-events-none -translate-y-1/2" />

              {/* Dynamic color dial gradient track */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-950 via-magenta-950 to-yellow-950/40 opacity-20 pointer-events-none" />

              {/* The Drag indicator */}
              <div
                className="absolute w-3 h-3 rounded-full bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-75"
                style={{
                  transform: `translate(${lift.x}px, ${lift.y}px)`,
                }}
              />
            </div>
            
            {/* Master Wheel slider */}
            <div className="w-full flex flex-col items-center gap-1">
              <input
                type="range"
                min="-100"
                max="100"
                value={liftVal}
                onChange={(e) => setLiftVal(Number(e.target.value))}
                className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <span className="text-[10px] font-mono text-zinc-500">Y: {liftVal}</span>
            </div>
          </div>

          {/* Wheel 2: Gamma */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Gamma</span>
            <div
              className="relative w-28 h-28 rounded-full border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner group"
              {...setupDrag(setGamma)}
              onDoubleClick={() => handleReset("gamma")}
            >
              <div className="absolute inset-1.5 rounded-full border border-dashed border-zinc-800/60 pointer-events-none" />
              <div className="absolute left-1/2 top-2 bottom-2 w-[1px] bg-zinc-900/40 pointer-events-none -translate-x-1/2" />
              <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-zinc-900/40 pointer-events-none -translate-y-1/2" />
              
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-950 via-magenta-950 to-yellow-950/40 opacity-20 pointer-events-none" />

              <div
                className="absolute w-3 h-3 rounded-full bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-75"
                style={{
                  transform: `translate(${gamma.x}px, ${gamma.y}px)`,
                }}
              />
            </div>
            
            {/* Master Wheel slider */}
            <div className="w-full flex flex-col items-center gap-1">
              <input
                type="range"
                min="-100"
                max="100"
                value={gammaVal}
                onChange={(e) => setGammaVal(Number(e.target.value))}
                className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <span className="text-[10px] font-mono text-zinc-500">Y: {gammaVal}</span>
            </div>
          </div>

          {/* Wheel 3: Gain */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Gain</span>
            <div
              className="relative w-28 h-28 rounded-full border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner group"
              {...setupDrag(setGain)}
              onDoubleClick={() => handleReset("gain")}
            >
              <div className="absolute inset-1.5 rounded-full border border-dashed border-zinc-800/60 pointer-events-none" />
              <div className="absolute left-1/2 top-2 bottom-2 w-[1px] bg-zinc-900/40 pointer-events-none -translate-x-1/2" />
              <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-zinc-900/40 pointer-events-none -translate-y-1/2" />
              
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-950 via-magenta-950 to-yellow-950/40 opacity-20 pointer-events-none" />

              <div
                className="absolute w-3 h-3 rounded-full bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-75"
                style={{
                  transform: `translate(${gain.x}px, ${gain.y}px)`,
                }}
              />
            </div>
            
            {/* Master Wheel slider */}
            <div className="w-full flex flex-col items-center gap-1">
              <input
                type="range"
                min="-100"
                max="100"
                value={gainVal}
                onChange={(e) => setGainVal(Number(e.target.value))}
                className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <span className="text-[10px] font-mono text-zinc-500">Y: {gainVal}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Guide */}
        <p className="text-[10px] font-mono text-center text-zinc-500 uppercase tracking-widest mt-2">
          Drag wheel centers to adjust tints. Double-click wheels to reset.
        </p>
      </div>
    </div>
  );
}
