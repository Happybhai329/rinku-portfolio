"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Maximize, Volume2, VolumeX, Info, ExternalLink } from "lucide-react";
import { showreelData } from "@/data/projectsData";

interface Chapter {
  id: number;
  name: string;
  start: number;
  end: number;
  color: string;
  textColor: string;
}

export default function InteractiveTimeline() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const duration = 120; // 2 minute mock timeline for the showreel

  const timelineRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const chapters: Chapter[] = [
    { id: 1, name: "Cinematic Hook", start: 0, end: 30, color: "rgba(239, 68, 68, 0.2)", textColor: "text-red-400" },
    { id: 2, name: "Narrative Pacing", start: 30, end: 60, color: "rgba(59, 130, 246, 0.2)", textColor: "text-blue-400" },
    { id: 3, name: "Color Grading", start: 60, end: 90, color: "rgba(197, 168, 128, 0.25)", textColor: "text-gold-400" },
    { id: 4, name: "VFX & Outro", start: 90, end: 120, color: "rgba(168, 85, 247, 0.2)", textColor: "text-purple-400" }
  ];

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 24);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  };

  const handleTimelineInteraction = (clientX: number) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, relativeX / rect.width));
    const targetTime = pct * duration;
    setCurrentTime(targetTime);

    const currentChapter = chapters.find((ch) => targetTime >= ch.start && targetTime < ch.end);
    if (currentChapter) {
      setActiveChapter(currentChapter.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleTimelineInteraction(e.clientX);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleTimelineInteraction(moveEvent.clientX);
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const playheadPercent = (currentTime / duration) * 100;

  const waveformBarsCount = 120;
  const waveformSeed = Array.from({ length: waveformBarsCount }).map((_, i) => {
    const sin1 = Math.sin(i * 0.15) * 20 + 20;
    const sin2 = Math.sin(i * 0.3) * 10;
    const noise = Math.cos(i * 0.8) * 5;
    return Math.max(5, Math.min(45, sin1 + sin2 + noise));
  });

  return (
    <div className="w-full flex flex-col gap-6 bg-zinc-950 p-6 rounded-2xl border border-white/5 shadow-2xl relative">
      
      {/* 1. Showreel Video Player Frame (YouTube Embed) */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black group shadow-3xl">
        {!isPlaying ? (
          <div className="relative w-full h-full">
            {/* High-res YouTube thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${showreelData.youtubeId}/maxresdefault.jpg`}
              alt={showreelData.title}
              className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-500 scale-100 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* Play Button Overlay */}
            <div 
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
            >
              <div className="w-20 h-20 rounded-full border border-gold-500/40 bg-black/70 hover:bg-gold-500 text-gold-500 hover:text-dark-950 flex items-center justify-center transition-all duration-300 scale-95 hover:scale-110 shadow-[0_0_50px_rgba(197,168,128,0.35)]">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1 pointer-events-none">
              <span className="text-xs font-mono text-gold-500 font-bold uppercase tracking-widest">
                OFFICIAL SHOWREEL 2026
              </span>
              <h3 className="text-xl md:text-2xl font-display font-extrabold uppercase text-white">
                {showreelData.title}
              </h3>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${showreelData.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
            title={showreelData.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* HUD Overlay */}
        <div className="absolute top-4 left-4 flex gap-2 pointer-events-none z-10">
          <div className="bg-black/85 backdrop-blur-md px-3.5 py-2 rounded border border-white/10 text-xs font-mono flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <div>
              <span className="text-zinc-500 mr-2 font-semibold">DAVINCI TIMELINE:</span>
              <span className="text-white font-bold uppercase tracking-wider">
                {chapters.find((c) => c.id === activeChapter)?.name || "Showreel Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Watch on YouTube Direct Link */}
        <a
          href={showreelData.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-10 bg-black/85 backdrop-blur-md hover:bg-gold-500 text-zinc-400 hover:text-dark-950 px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
        >
          Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 2. Interactive Resolve-Style Multi-Track Timeline */}
      <div className="flex flex-col bg-zinc-900/60 border border-white/5 rounded-xl p-4 select-none">
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono pb-2 border-b border-white/5 mb-3">
          <div className="flex gap-4">
            <span className="text-zinc-400 font-semibold">DAVINCI RESOLVE TIMELINE</span>
            <span className="text-zinc-600">|</span>
            <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Drag timeline to inspect chapters</span>
          </div>
          <div>TIMECODE: <span className="text-gold-500 font-bold">{formatTime(currentTime)}</span></div>
        </div>

        {/* Tracks Area */}
        <div 
          ref={timelineRef}
          onMouseDown={handleMouseDown}
          className="relative w-full flex flex-col gap-1.5 cursor-ew-resize py-1 select-none"
        >
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-red-600 z-30 pointer-events-none"
            style={{ left: `${playheadPercent}%` }}
          >
            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 border border-red-400 rotate-45 rounded-sm" />
          </div>

          {/* V2 Title Track */}
          <div className="flex w-full h-6 items-center text-[9px] font-mono text-zinc-400 bg-zinc-950/40 rounded border border-white/5 overflow-hidden">
            <div className="w-8 flex items-center justify-center border-r border-white/5 bg-zinc-950 font-bold shrink-0">V2</div>
            <div className="flex-1 h-full relative">
              <div className="absolute top-1 bottom-1 left-[2%] w-[20%] bg-gold-600/20 border border-gold-500/40 rounded flex items-center justify-center text-[8px] font-semibold text-gold-400 uppercase tracking-widest pointer-events-none truncate">
                Cinematic Hook
              </div>
              <div className="absolute top-1 bottom-1 left-[26%] w-[18%] bg-zinc-800/40 border border-zinc-700/40 rounded flex items-center justify-center text-[8px] font-semibold text-zinc-400 uppercase tracking-widest pointer-events-none truncate">
                Pacing Text
              </div>
              <div className="absolute top-1 bottom-1 left-[48%] w-[22%] bg-gold-600/20 border border-gold-500/40 rounded flex items-center justify-center text-[8px] font-semibold text-gold-400 uppercase tracking-widest pointer-events-none truncate">
                Resolve LUTS
              </div>
              <div className="absolute top-1 bottom-1 left-[75%] w-[20%] bg-zinc-800/40 border border-zinc-700/40 rounded flex items-center justify-center text-[8px] font-semibold text-zinc-400 uppercase tracking-widest pointer-events-none truncate">
                Fusion Intro
              </div>
            </div>
          </div>

          {/* V1 Video Track */}
          <div className="flex w-full h-12 items-center text-[10px] font-mono bg-zinc-950/40 rounded border border-white/5 overflow-hidden">
            <div className="w-8 h-full flex items-center justify-center border-r border-white/5 bg-zinc-950 font-bold shrink-0 text-zinc-400">V1</div>
            <div className="flex-1 h-full flex relative">
              {chapters.map((ch) => {
                const startPct = (ch.start / duration) * 100;
                const widthPct = ((ch.end - ch.start) / duration) * 100;
                const isActive = currentTime >= ch.start && currentTime < ch.end;

                return (
                  <div
                    key={ch.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTime(ch.start);
                      setActiveChapter(ch.id);
                      setIsPlaying(true);
                    }}
                    className="absolute top-1 bottom-1 rounded border flex flex-col justify-between p-1.5 transition-all cursor-pointer font-bold"
                    style={{
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                      backgroundColor: ch.color,
                      borderColor: isActive ? "#c5a880" : "rgba(255,255,255,0.05)",
                      boxShadow: isActive ? "inset 0 0 10px rgba(197,168,128,0.2)" : "none"
                    }}
                  >
                    <span className={`text-[9px] uppercase tracking-wider truncate ${isActive ? "text-white font-extrabold" : "text-zinc-500"}`}>
                      {ch.name}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-600 block text-right mt-1">
                      {formatTime(ch.start).slice(3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* A1 Audio Track */}
          <div className="flex w-full h-10 items-center bg-zinc-950/40 rounded border border-white/5 overflow-hidden">
            <div className="w-8 h-full flex items-center justify-center border-r border-white/5 bg-zinc-950 font-bold shrink-0 text-[10px] text-zinc-400">A1</div>
            <div className="flex-1 h-full flex items-center justify-around px-2 relative opacity-60">
              <div className="w-full h-full flex items-center justify-between pointer-events-none">
                {waveformSeed.map((heightVal, idx) => {
                  const isActive = (idx / waveformBarsCount) * 100 <= playheadPercent;
                  return (
                    <div
                      key={idx}
                      className="w-[2px] rounded-full transition-colors"
                      style={{
                        height: `${heightVal}%`,
                        backgroundColor: isActive ? "#c5a880" : "#27272a"
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
          <div className="flex gap-2">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setCurrentTime(ch.start);
                  setActiveChapter(ch.id);
                  setIsPlaying(true);
                }}
                className={`px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                  activeChapter === ch.id
                    ? "bg-gold-500/10 border-gold-500/30 text-gold-400 font-bold"
                    : "bg-zinc-950 border-white/5 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {ch.name}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            Render Profile: <span className="text-zinc-400 font-semibold">ProRes_422_HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
