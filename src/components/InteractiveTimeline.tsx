"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Maximize, Volume2, VolumeX, SkipBack, Info } from "lucide-react";
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
  const [duration, setDuration] = useState(30); // Default fallback duration
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(true); // Default muted for autoplay-friendliness
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [videoSrc, setVideoSrc] = useState(showreelData.fallbackVideo);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const chapters: Chapter[] = [
    { id: 1, name: "Cinematic Hook", start: 0, end: 7, color: "rgba(239, 68, 68, 0.15)", textColor: "text-red-400" },      // Red tint
    { id: 2, name: "Narrative Pacing", start: 7, end: 14, color: "rgba(59, 130, 246, 0.15)", textColor: "text-blue-400" },  // Blue tint
    { id: 3, name: "Color Grading", start: 14, end: 22, color: "rgba(197, 168, 128, 0.2)", textColor: "text-gold-400" },     // Gold tint
    { id: 4, name: "VFX & Outro", start: 22, end: 30, color: "rgba(168, 85, 247, 0.15)", textColor: "text-purple-400" }     // Purple tint
  ];

  // Try to use local showreel video if available
  useEffect(() => {
    const checkLocalVideo = async () => {
      try {
        const res = await fetch(showreelData.localVideo, { method: "HEAD" });
        if (res.ok) {
          setVideoSrc(showreelData.localVideo);
        }
      } catch (e) {
        // Fallback already set
      }
    };
    checkLocalVideo();
  }, []);

  // Update duration when metadata loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 30);
    }
  };

  // Sync play state
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Update current time during playback
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Identify current chapter
    const currentChapter = chapters.find((ch) => time >= ch.start && time < ch.end);
    if (currentChapter && currentChapter.id !== activeChapter) {
      setActiveChapter(currentChapter.id);
    }
  };

  // Format time (00:00)
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 24); // Resolve 24fps mock
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  };

  // Timeline scrubbing handler
  const handleTimelineInteraction = (clientX: number) => {
    if (!timelineRef.current || !videoRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, relativeX / rect.width));
    
    const targetTime = pct * duration;
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    handleTimelineInteraction(e.touches[0].clientX);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 0) return;
      handleTimelineInteraction(moveEvent.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Handle Mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Fullscreen trigger
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Go to chapter start
  const seekToChapter = (chapter: Chapter) => {
    if (videoRef.current) {
      videoRef.current.currentTime = chapter.start;
      setCurrentTime(chapter.start);
      setActiveChapter(chapter.id);
      if (!isPlaying) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Playhead percentage for styling
  const playheadPercent = (currentTime / duration) * 100;

  // Generate mock waveform bars (constant pattern, size varying)
  const waveformBarsCount = 120;
  const waveformSeed = Array.from({ length: waveformBarsCount }).map((_, i) => {
    // Make it look like waves
    const sin1 = Math.sin(i * 0.15) * 20 + 20;
    const sin2 = Math.sin(i * 0.3) * 10;
    const noise = Math.cos(i * 0.8) * 5;
    return Math.max(5, Math.min(45, sin1 + sin2 + noise));
  });

  return (
    <div className="w-full flex flex-col gap-6 bg-zinc-950 p-6 rounded-2xl border border-white/5 shadow-2xl relative">
      
      {/* 1. Showreel Video Player Frame */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black group shadow-3xl">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover cursor-pointer"
          loop
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          playsInline
        />

        {/* Large Centered Play Button when Paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px] transition-all duration-300 cursor-pointer group-hover:bg-black/30"
          >
            <div className="w-20 h-20 rounded-full border border-gold-500/30 bg-black/60 hover:bg-gold-500/10 hover:border-gold-500 text-gold-500 flex items-center justify-center transition-all duration-300 scale-95 hover:scale-105 group/play shadow-[0_0_50px_rgba(197,168,128,0.25)]">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Floating Chapter Info HUD */}
        <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
          <div className="bg-black/85 backdrop-blur-md px-3.5 py-2 rounded border border-white/10 text-xs font-mono flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <div>
              <span className="text-zinc-500 mr-2 font-semibold">ACTIVE SCENE:</span>
              <span className="text-white font-bold uppercase tracking-wider">
                {chapters.find((c) => c.id === activeChapter)?.name || "Showreel Loop"}
              </span>
            </div>
          </div>
        </div>

        {/* Video Player Controls HUD (Bottom bar inside video) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-white font-mono text-xs select-none">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-gold-500 transition-colors cursor-pointer">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button 
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              className="hover:text-gold-500 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            
            {/* Timecode */}
            <div>
              <span className="text-gold-500 font-bold">{formatTime(currentTime)}</span>
              <span className="text-zinc-500"> / {formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="hover:text-gold-500 transition-colors cursor-pointer">
                {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500 group-hover/volume:w-20 transition-all"
              />
            </div>
            <button onClick={toggleFullscreen} className="hover:text-gold-500 transition-colors cursor-pointer">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Resolve-Style Multi-Track Timeline */}
      <div className="flex flex-col bg-zinc-900/60 border border-white/5 rounded-xl p-4 select-none">
        
        {/* Timeline Header (Timecode ticks) */}
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono pb-2 border-b border-white/5 mb-3">
          <div className="flex gap-4">
            <span className="text-zinc-400 font-semibold">DAVINCI RESOLVE EDIT TIMELINE</span>
            <span className="text-zinc-600">|</span>
            <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Scrub tracks below to seek showreel</span>
          </div>
          <div>FPS: 24.00</div>
        </div>

        {/* Multi-Track Workspace */}
        <div 
          ref={timelineRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative w-full flex flex-col gap-1.5 cursor-ew-resize py-1 select-none"
        >
          {/* Global Playhead (Red overlay line and pointer tab) */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-red-600 z-30 pointer-events-none"
            style={{ left: `${playheadPercent}%` }}
          >
            {/* Top Red Handle */}
            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 border border-red-400 rotate-45 rounded-sm" />
          </div>

          {/* TRACK 1: Titles (V2) */}
          <div className="flex w-full h-6 items-center text-[9px] font-mono text-zinc-400 bg-zinc-950/40 rounded border border-white/5 overflow-hidden">
            <div className="w-8 flex items-center justify-center border-r border-white/5 bg-zinc-950 font-bold shrink-0">V2</div>
            <div className="flex-1 h-full relative">
              {/* Text Blocks representing typography edits */}
              <div className="absolute top-1 bottom-1 left-[2%] w-[20%] bg-gold-600/20 border border-gold-500/40 rounded flex items-center justify-center text-[8px] font-semibold text-gold-400 uppercase tracking-widest pointer-events-none truncate">
                Cinematic Intro
              </div>
              <div className="absolute top-1 bottom-1 left-[26%] w-[18%] bg-zinc-800/40 border border-zinc-700/40 rounded flex items-center justify-center text-[8px] font-semibold text-zinc-400 uppercase tracking-widest pointer-events-none truncate">
                Text FX
              </div>
              <div className="absolute top-1 bottom-1 left-[48%] w-[22%] bg-gold-600/20 border border-gold-500/40 rounded flex items-center justify-center text-[8px] font-semibold text-gold-400 uppercase tracking-widest pointer-events-none truncate">
                LUTS/Grade
              </div>
              <div className="absolute top-1 bottom-1 left-[75%] w-[20%] bg-zinc-800/40 border border-zinc-700/40 rounded flex items-center justify-center text-[8px] font-semibold text-zinc-400 uppercase tracking-widest pointer-events-none truncate">
                Title Fade
              </div>
            </div>
          </div>

          {/* TRACK 2: Video Clips (V1) - The main chapters */}
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
                      e.stopPropagation(); // Avoid triggering timeline seek twice
                      seekToChapter(ch);
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

          {/* TRACK 3: Audio Waveform (A1) */}
          <div className="flex w-full h-10 items-center bg-zinc-950/40 rounded border border-white/5 overflow-hidden">
            <div className="w-8 h-full flex items-center justify-center border-r border-white/5 bg-zinc-950 font-bold shrink-0 text-[10px] text-zinc-400">A1</div>
            <div className="flex-1 h-full flex items-center justify-around px-2 relative opacity-50">
              
              {/* Mock Audio Waveform Render */}
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

              {/* Volume keyframe line visual */}
              <div className="absolute top-[40%] left-0 right-0 h-[1.5px] bg-green-500/20 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Timeline Footer Actions */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
          <div className="flex gap-2">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => seekToChapter(ch)}
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
            Node Tree: <span className="text-zinc-400 font-semibold">Grading_Final_v2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
