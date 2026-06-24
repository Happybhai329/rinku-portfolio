"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ChevronDown, 
  Mail, 
  Send, 
  Sparkles, 
  Award, 
  Clock, 
  CheckCircle2, 
  Sliders, 
  Play, 
  ExternalLink,
  BookOpen,
  Volume2,
  X
} from "lucide-react";

// Custom SVG components for brand logos because they are removed in Lucide v1.x
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const loadingWords = ["STORYTELLING", "MOTION GRAPHICS", "COLOR GRADING", "SOUND DESIGN", "RINKU DHAKAD"];

import { projectsData, Project } from "@/data/projectsData";
import ColorWheel from "@/components/ColorWheel";
import SpeedRamp from "@/components/SpeedRamp";
import InteractiveTimeline from "@/components/InteractiveTimeline";
import CertificateModal from "@/components/CertificateModal";

export default function Home() {
  // Preloader state
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [loadingWordIndex, setLoadingWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Custom cursor state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorHoverText, setCursorHoverText] = useState("");
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);

  // Selected project for full-screen case study
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Certificate Modal state
  const [isCertOpen, setIsCertOpen] = useState(false);

  // Project hover preview states (which card is hovered)
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Contact form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "Short Form", message: "" });



  // 1. Preloader simulation
  useEffect(() => {
    // Count up from 0 to 100
    const interval = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        // Accelerating curve
        const step = prev < 30 ? 1 : prev < 70 ? 2 : prev < 90 ? 3 : 1;
        return prev + step;
      });
    }, 18);

    // Swap words
    const wordInterval = setInterval(() => {
      setLoadingWordIndex((prev) => (prev + 1) % loadingWords.length);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(wordInterval);
    };
  }, []);

  // 2. Mouse tracker for custom cursor & hover spotlights
  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMoveGlobal);
    return () => window.removeEventListener("mousemove", handleMouseMoveGlobal);
  }, []);

  // Set up custom cursor active class on body
  useEffect(() => {
    if (!isLoading) {
      document.body.classList.add("custom-cursor-active");
    }
    return () => document.body.classList.remove("custom-cursor-active");
  }, [isLoading]);

  // Card Mouse Move Spotlight Hover effect tracker
  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  // Handle Form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit contact form mock
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", projectType: "Short Form", message: "" });
    }, 4000);
  };

  // Scroll smoothly to element id
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ================= PRELOADER ================= */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 bg-dark-950 z-[9999] flex flex-col justify-between p-8 select-none"
          >
            {/* Top Logo */}
            <div className="flex justify-between items-center text-xs font-mono tracking-widest text-zinc-500 uppercase">
              <span>RINKU DHAKAD PORTFOLIO</span>
              <span>EST. 2024</span>
            </div>

            {/* Center Loading Words */}
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="text-[10px] font-mono tracking-widest text-gold-500/80 uppercase">
                POST-PRODUCTION MASTERCLASS
              </span>
              <div className="h-16 flex items-center justify-center overflow-hidden">
                <motion.h2
                  key={loadingWordIndex}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-2xl md:text-4xl font-display font-extrabold uppercase tracking-widest text-white"
                >
                  {loadingWords[loadingWordIndex]}
                </motion.h2>
              </div>
            </div>

            {/* Bottom percentage */}
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">LOADING ASSETS</span>
                <div className="w-48 h-[1px] bg-zinc-900 overflow-hidden relative">
                  <div 
                    className="h-full bg-gold-500 absolute left-0 top-0 transition-all duration-75"
                    style={{ width: `${loadingPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-5xl md:text-7xl font-display font-extrabold text-gold-500/30 font-mono">
                {loadingPercent.toString().padStart(3, "0")}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CUSTOM CURSOR (DESKTOP) ================= */}
      {!isLoading && (
        <div
          className="fixed pointer-events-none z-[10000] hidden lg:block -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 ease-out"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            width: cursorHoverText ? "70px" : isHoveredInteractive ? "40px" : "12px",
            height: cursorHoverText ? "70px" : isHoveredInteractive ? "40px" : "12px",
            backgroundColor: cursorHoverText ? "rgba(197, 168, 128, 0.15)" : isHoveredInteractive ? "rgba(255,255,255,0.05)" : "rgba(197, 168, 128, 1)",
            border: cursorHoverText || isHoveredInteractive ? "1px solid #c5a880" : "none",
            boxShadow: cursorHoverText ? "0 0 20px rgba(197, 168, 128, 0.2)" : "none",
          }}
        >
          {cursorHoverText && (
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold uppercase tracking-widest text-gold-500">
              {cursorHoverText}
            </span>
          )}
        </div>
      )}

      {/* ================= CERTIFICATE MODAL ================= */}
      <CertificateModal isOpen={isCertOpen} onClose={() => setIsCertOpen(false)} />

      {/* ================= WEBSITE HEADER / NAVIGATION ================= */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-950/75 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center select-none">
        {/* Brand logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 cursor-pointer group"
          onMouseEnter={() => setIsHoveredInteractive(true)}
          onMouseLeave={() => setIsHoveredInteractive(false)}
        >
          <div className="w-7 h-7 rounded bg-gold-500 flex items-center justify-center text-dark-950 font-display font-extrabold text-sm tracking-tighter">
            RD
          </div>
          <span className="font-display font-bold uppercase text-sm tracking-widest text-white group-hover:text-gold-500 transition-colors">
            RINKU DHAKAD
          </span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-400">
          {["showreel", "projects", "skills", "about", "why-me", "contact"].map((sec) => (
            <button
              key={sec}
              onClick={() => scrollToId(sec)}
              className="hover:text-gold-500 transition-colors cursor-pointer"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
            >
              {sec.replace("-", " ")}
            </button>
          ))}
        </nav>

        {/* Header CTA */}
        <button
          onClick={() => scrollToId("contact")}
          className="px-4 py-2 border border-gold-500/30 bg-gold-500/5 hover:bg-gold-500 hover:text-dark-950 text-gold-500 text-xs font-mono uppercase tracking-widest rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.1)]"
          onMouseEnter={() => setIsHoveredInteractive(true)}
          onMouseLeave={() => setIsHoveredInteractive(false)}
        >
          Hire Me
        </button>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="w-full flex-1">

        {/* ================= HERO SECTION ================= */}
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black py-20 px-6 md:px-12">
          {/* Loop Reel Video Background */}
          <div className="absolute inset-0 z-0 opacity-40">
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/70 to-dark-950 z-10" />
            <video
              src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-video-of-a-mysterious-planet-41710-large.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          <div className="max-w-5xl w-full z-10 flex flex-col items-center text-center gap-8 md:gap-12 mt-12">
            
            {/* Top Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-zinc-900/60 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full text-xs font-mono text-gold-500/90 uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              Video Editor | Motion graphics | Colorist
            </motion.div>

            {/* Main Headline */}
            <div className="flex flex-col gap-2 max-w-4xl text-reveal-container">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 1.0, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[1.05] tracking-tighter uppercase text-white"
              >
                Editing Stories
              </motion.h1>
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 1.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[1.05] tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-white"
              >
                That People
              </motion.h1>
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[1.05] tracking-tighter uppercase text-white"
              >
                Can&apos;t Skip
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="max-w-2xl text-zinc-400 text-sm md:text-lg leading-relaxed font-sans"
            >
              Video Editor specializing in cinematic storytelling, high-retention short-form content, motion graphics, and commercial advertisements.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center"
            >
              <button
                onClick={() => scrollToId("showreel")}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-dark-950 font-display font-extrabold text-sm uppercase tracking-widest rounded-full transition-all shadow-[0_0_30px_rgba(197,168,128,0.35)] cursor-pointer"
                onMouseEnter={() => {
                  setIsHoveredInteractive(true);
                  setCursorHoverText("PLAY");
                }}
                onMouseLeave={() => {
                  setIsHoveredInteractive(false);
                  setCursorHoverText("");
                }}
              >
                View Showreel
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => scrollToId("contact")}
                className="group flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-gold-500/50 bg-zinc-950/60 backdrop-blur-sm text-white hover:text-gold-500 font-display font-extrabold text-sm uppercase tracking-widest rounded-full transition-all cursor-pointer"
                onMouseEnter={() => setIsHoveredInteractive(true)}
                onMouseLeave={() => setIsHoveredInteractive(false)}
              >
                Hire Me
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Bottom Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-50 select-none">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Scroll Down</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 animate-bounce" />
          </div>
        </section>

        {/* ================= FEATURED SHOWREEL ================= */}
        <section id="showreel" className="w-full py-24 bg-dark-950 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-5xl w-full flex flex-col gap-12">
            
            {/* Header */}
            <div className="flex flex-col gap-3 text-center md:text-left">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Featured Showreel</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                Cinematic Portfolio Master Reel
              </h2>
            </div>

            {/* Custom scrubber player */}
            <InteractiveTimeline />
          </div>
        </section>

        {/* ================= PROJECTS SECTION ================= */}
        <section id="projects" className="w-full py-28 bg-dark-900 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-6xl w-full flex flex-col gap-16">
            
            {/* Section Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Showcase Projects</span>
                <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white">
                  Crafted Visual Work
                </h2>
              </div>
              <p className="max-w-md text-zinc-400 text-sm leading-relaxed">
                Explore individual project showcases highlighting pacing, custom sound design, motion graphics integration, and Resolve color tuning.
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projectsData.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => {
                    setHoveredProjectId(project.id);
                    setIsHoveredInteractive(true);
                    setCursorHoverText("OPEN");
                  }}
                  onMouseLeave={() => {
                    setHoveredProjectId(null);
                    setIsHoveredInteractive(false);
                    setCursorHoverText("");
                  }}
                  className="group cursor-pointer bg-zinc-950 border border-white/5 hover:border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 select-none flex flex-col h-full"
                >
                  {/* Visual Preview Box */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10" />

                    {/* Standard Image Thumbnail */}
                    <div className="w-full h-full relative transition-transform duration-500 scale-100 group-hover:scale-105">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=640&dpr=1`} // placeholder matching style
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Silent Video Preview playing on Hover */}
                    <AnimatePresence>
                      {hoveredProjectId === project.id && (
                        <motion.video
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          src={project.fallbackVideo}
                          className="absolute inset-0 w-full h-full object-cover z-20"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      )}
                    </AnimatePresence>

                    {/* Software Badge */}
                    <div className="absolute top-4 left-4 z-30 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-[10px] font-mono border border-white/10 text-gold-500 uppercase tracking-wider">
                      {project.software}
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                          {project.role}
                        </span>
                        <div className="flex gap-1.5">
                          {project.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="text-[8px] font-mono uppercase tracking-wider bg-zinc-900 border border-white/5 px-2 py-0.5 rounded text-zinc-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-xl font-display font-extrabold uppercase text-white group-hover:text-gold-500 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed truncate-3-lines">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gold-500 font-bold group-hover:translate-x-1.5 transition-transform mt-2">
                      View Case Study
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= IMERSIVE FULL-SCREEN CASE STUDY MODAL ================= */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md p-4 md:p-8 flex items-center justify-center font-sans select-none"
            >
              {/* Click outside container to close */}
              <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedProject(null)} />

              {/* Box */}
              <motion.div
                initial={{ y: 50, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-4xl bg-zinc-950 rounded-2xl border border-white/10 shadow-3xl z-10 overflow-hidden max-h-[90vh] flex flex-col"
              >
                
                {/* Header controls (fixed) */}
                <div className="flex justify-between items-center bg-zinc-900/90 backdrop-blur-md px-6 py-4 border-b border-white/5 z-20 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded border border-gold-500/20 uppercase tracking-widest font-bold">
                      {selectedProject.software}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">|</span>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
                      {selectedProject.role}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Close <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Content Panel (scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8">
                  {/* Large Cinematic Player */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black group select-none shadow-xl shrink-0">
                    <video
                      src={selectedProject.fallbackVideo}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      controls
                      playsInline
                    />
                  </div>

                  {/* Title & Metadata Details */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-2xl md:text-4xl font-display font-extrabold uppercase tracking-tight text-white border-b border-white/5 pb-4">
                      {selectedProject.title}
                    </h3>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-900/30 p-4 rounded-xl border border-white/5 text-xs font-mono uppercase tracking-wider text-zinc-400">
                      <div>
                        <span className="text-zinc-500 block text-[10px] mb-1">ROLE</span>
                        <span className="text-white font-bold">{selectedProject.role}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] mb-1">SOFTWARE</span>
                        <span className="text-white font-bold">{selectedProject.software}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] mb-1">TIMELINE</span>
                        <span className="text-white font-bold">2026 PRO</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] mb-1">DIFFICULTY</span>
                        <span className="text-white font-bold">ADVANCED VFX</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Description & Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Description */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                      <h4 className="text-sm font-mono uppercase tracking-widest text-gold-500 font-bold">
                        Project Overview
                      </h4>
                      <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                        {selectedProject.description}
                      </p>
                      <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                        This workflow involves structural pacing adjustments matching audio queues, tailored keyframe speed ramping curves for extreme viewer retention, DaVinci Resolve color wheel adjustment for cinematic depth, and clean title design to keep advertisements and trailers highly engaging.
                      </p>
                    </div>

                    {/* Right Highlights */}
                    <div className="flex flex-col gap-4 bg-zinc-900/20 p-5 rounded-xl border border-white/5">
                      <h4 className="text-sm font-mono uppercase tracking-widest text-gold-500 font-bold">
                        Workflow Highlights
                      </h4>
                      <ul className="flex flex-col gap-2.5">
                        {selectedProject.highlights.map((hl, idx) => (
                          <li key={idx} className="flex gap-2 text-xs text-zinc-300 leading-relaxed font-sans items-start">
                            <span className="text-gold-500 font-bold shrink-0 mt-0.5">✓</span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer case-study info */}
                <div className="bg-zinc-900/60 px-6 py-4 border-t border-white/5 text-[10px] font-mono text-zinc-500 text-center shrink-0">
                  You can configure this showcase in src/data/projectsData.ts
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= SKILLS SECTION ================= */}
        <section id="skills" className="w-full py-28 bg-dark-950 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-5xl w-full flex flex-col gap-16">
            
            {/* Header */}
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Technical Expertise</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                Post-Production Dashboard
              </h2>
              <p className="max-w-md mx-auto text-zinc-400 text-xs">
                Interact with actual editing tools below to preview custom grading and speed ramping curves.
              </p>
            </div>

            {/* Interactive grading and speed ramping sub-components */}
            <div className="flex flex-col gap-12">
              <ColorWheel />
              <SpeedRamp />
            </div>

            {/* Skill categories progress slides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 select-none">
              
              {/* Box 1 */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono font-bold">Editing Competencies</span>
                <div className="flex flex-col gap-3.5">
                  {[
                    { label: "Video Editing", val: "100%" },
                    { label: "Short Form Content", val: "95%" },
                    { label: "Long Form Content", val: "90%" }
                  ].map((sk, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-mono text-zinc-300">
                        <span>{sk.label}</span>
                        <span className="text-gold-500 font-bold">{sk.val}</span>
                      </div>
                      <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500" style={{ width: sk.val }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono font-bold">Motion & VFX</span>
                <div className="flex flex-col gap-3.5">
                  {[
                    { label: "Fusion Compositing", val: "85%" },
                    { label: "Motion Graphics", val: "90%" },
                    { label: "Animation", val: "85%" }
                  ].map((sk, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-mono text-zinc-300">
                        <span>{sk.label}</span>
                        <span className="text-gold-500 font-bold">{sk.val}</span>
                      </div>
                      <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500" style={{ width: sk.val }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono font-bold">Color & Audio</span>
                <div className="flex flex-col gap-3.5">
                  {[
                    { label: "Color Grading", val: "95%" },
                    { label: "Sound Design", val: "90%" },
                    { label: "DaVinci Resolve Pro", val: "100%" }
                  ].map((sk, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-mono text-zinc-300">
                        <span>{sk.label}</span>
                        <span className="text-gold-500 font-bold">{sk.val}</span>
                      </div>
                      <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500" style={{ width: sk.val }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= TESTIMONIALS SECTION ================= */}
        <section className="w-full py-24 bg-dark-900 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-4xl w-full flex flex-col gap-12">
            
            {/* Header */}
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Testimonials</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                Client Reviews
              </h2>
            </div>

            {/* Testimonials Slides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 select-none">
              {[
                {
                  quote: "Rinku completely transformed our promotional campaigns. His pacing and commercial visual structure doubled our viewer retention and student inquiries. An editing genius!",
                  client: "Amit Patel",
                  role: "Director, The Prime Classes",
                  accent: "border-gold-500/20 shadow-[0_0_30px_rgba(197,168,128,0.02)]"
                },
                {
                  quote: "Working with Rinku on our short-form content was seamless. He has an outstanding sense of beat-syncing, color correction, and custom graphics. Super fast turnaround!",
                  client: "Sarah Jenkins",
                  role: "Brand Campaign Manager",
                  accent: "border-white/5"
                }
              ].map((t, idx) => (
                <div
                  key={idx}
                  className={`bg-zinc-950 p-8 rounded-2xl border flex flex-col justify-between gap-6 hover:border-gold-500/20 transition-all ${t.accent}`}
                >
                  <p className="text-sm md:text-base italic text-zinc-300 leading-relaxed font-sans">
                    “{t.quote}”
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-mono text-gold-500 font-bold uppercase select-none">
                      {t.client.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{t.client}</span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mt-0.5">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= ABOUT ME SECTION ================= */}
        <section id="about" className="w-full py-28 bg-dark-950 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-12 items-center">
            
            {/* Left Image Placeholder Frame */}
            <div className="w-full lg:w-2/5 flex justify-center">
              <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 group select-none shadow-2xl">
                {/* Overlay vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                
                {/* Base photo placeholder */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Rinku Dhakad profile"
                  className="w-full h-full object-cover opacity-60 filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                />

                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-1.5">
                  <span className="text-xs font-mono text-gold-500 uppercase tracking-widest">POST-PRODUCTION PROFESSIONAL</span>
                  <span className="text-xl font-display font-extrabold uppercase text-white">RINKU DHAKAD</span>
                </div>
              </div>
            </div>

            {/* Right Story Details */}
            <div className="w-full lg:w-3/5 flex flex-col gap-6 select-none">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">About Me</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                Crafting Stories Frame by Frame
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                I believe great editing is invisible. It keeps audiences engaged, drives emotion, and transforms raw footage into unforgettable experiences. Through cinematic storytelling, motion graphics, sound design, and color grading, I create videos that capture attention and leave lasting impressions.
              </p>
              
              {/* Credentials / Certification */}
              <div className="mt-4 p-5 rounded-2xl border border-white/5 bg-zinc-900/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0 shadow-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block uppercase tracking-wide">Editing Skool Masterclass Graduate</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5 block">Official Video Certification</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsCertOpen(true)}
                  className="px-5 py-2.5 bg-zinc-950 border border-gold-500/30 hover:border-gold-500 text-gold-500 hover:text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center gap-2 group shrink-0"
                  onMouseEnter={() => setIsHoveredInteractive(true)}
                  onMouseLeave={() => setIsHoveredInteractive(false)}
                >
                  Verify Certificate
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ================= WHY HIRE ME SECTION ================= */}
        <section id="why-me" className="w-full py-28 bg-dark-900 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-5xl w-full flex flex-col gap-16">
            
            {/* Header */}
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold font-mono">Why Hire Me</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white">
                Creative Advantages
              </h2>
            </div>

            {/* Cards Grid with mouse follow glow */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Fast Turnaround",
                  desc: "Efficient project assembly workflows ensuring commercial, promotional, and trailer deliveries hit tight deadlines.",
                  ico: <Clock className="w-5 h-5" />
                },
                {
                  title: "Cinematic Quality",
                  desc: "DaVinci Resolve Node-based workflows guaranteeing high-end grading profiles and professional image fidelity.",
                  ico: <Sparkles className="w-5 h-5" />
                },
                {
                  title: "Attention to Detail",
                  desc: "Precise frame-by-frame cuts, keyframe curves, speed ramps, visual effect tracking, and seamless audio synchronization.",
                  ico: <CheckCircle2 className="w-5 h-5" />
                },
                {
                  title: "Strong Storytelling",
                  desc: "Graduated masterclass workflows focused on pacing, dramatic retention hooks, emotional arches, and storytelling consistency.",
                  ico: <BookOpen className="w-5 h-5" />
                },
                {
                  title: "Motion Graphics",
                  desc: "Fusion compositing capability allowing interactive graphics, title slides, glitch transitions, and 3D titles.",
                  ico: <Sliders className="w-5 h-5" />
                },
                {
                  title: "Brand Focused Editing",
                  desc: "Adapting video cuts, color tones, and typography to fit custom corporate guidelines and target audiences.",
                  ico: <Award className="w-5 h-5" />
                }
              ].map((card, idx) => (
                <div
                  key={idx}
                  onMouseMove={handleSpotlightMouseMove}
                  onMouseEnter={() => setIsHoveredInteractive(true)}
                  onMouseLeave={() => setIsHoveredInteractive(false)}
                  className="glow-card radial-glow-gold p-6 rounded-2xl flex flex-col gap-4 select-none relative overflow-hidden transition-all duration-300 cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0">
                    {card.ico}
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h3 className="text-lg font-display font-extrabold uppercase tracking-wide text-white">
                      {card.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="w-full py-28 bg-dark-950 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-12">
            
            {/* Left Contact details */}
            <div className="w-full lg:w-2/5 flex flex-col gap-8 justify-between select-none">
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Get In Touch</span>
                <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                  Let&apos;s Create Something Unforgettable
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm">
                  Ready to elevate your video content? Drop me an email, verify my certifications, check social reels, or schedule a direct consultation call.
                </p>
              </div>

              {/* Direct links list */}
              <div className="flex flex-col gap-4">
                {/* Scheduler CTA */}
                <a
                  href="https://calendly.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-gold-500 hover:bg-gold-600 text-dark-950 font-display font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(197,168,128,0.2)]"
                  onMouseEnter={() => setIsHoveredInteractive(true)}
                  onMouseLeave={() => setIsHoveredInteractive(false)}
                >
                  Schedule Consultation Call
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                {/* Social Handles */}
                <div className="flex gap-3 text-zinc-400 font-mono text-xs uppercase tracking-wider mt-2">
                  <a
                    href="https://www.linkedin.com/in/rinku-dhakad-97a55a403/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors bg-zinc-900 border border-white/5 px-4 py-2.5 rounded-lg"
                    onMouseEnter={() => setIsHoveredInteractive(true)}
                    onMouseLeave={() => setIsHoveredInteractive(false)}
                  >
                    <LinkedinIcon className="w-4 h-4 text-blue-500" /> LinkedIn
                  </a>
                  <a
                    href="https://www.instagram.com/rinku.dhakadd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors bg-zinc-900 border border-white/5 px-4 py-2.5 rounded-lg"
                    onMouseEnter={() => setIsHoveredInteractive(true)}
                    onMouseLeave={() => setIsHoveredInteractive(false)}
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-500" /> Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="w-full lg:w-3/5">
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 md:p-8 relative">
                
                <AnimatePresence>
                  {formSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-zinc-950/95 backdrop-blur-sm rounded-2xl"
                    >
                      <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-display font-extrabold uppercase text-white mb-2">Message Sent!</h4>
                      <p className="text-xs text-zinc-400 font-sans max-w-xs leading-relaxed">
                        Thank you for reaching out, Rinku. We will review your project details and get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter your name"
                      className="w-full bg-black/60 border border-white/5 hover:border-white/10 focus:border-gold-500 outline-none px-4 py-3 rounded-xl text-sm font-sans text-white placeholder-zinc-600 transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email"
                      className="w-full bg-black/60 border border-white/5 hover:border-white/10 focus:border-gold-500 outline-none px-4 py-3 rounded-xl text-sm font-sans text-white placeholder-zinc-600 transition-colors"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="projectType" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                      Project Format
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleFormChange}
                      className="w-full bg-black/60 border border-white/5 hover:border-white/10 focus:border-gold-500 outline-none px-4 py-3 rounded-xl text-sm font-sans text-white transition-colors cursor-pointer"
                    >
                      <option value="Short Form">High-Retention Short Form (Reels/TikTok)</option>
                      <option value="Long Form">Long Form Narrative/Documentary</option>
                      <option value="Commercial">Brand Advertisement/Promo</option>
                      <option value="Motion Intro">Fusion Motion graphics / VFX Intro</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                      Project Brief
                    </label>
                    <textarea
                      required
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Briefly describe your project details, timeline and goals..."
                      className="w-full bg-black/60 border border-white/5 hover:border-white/10 focus:border-gold-500 outline-none px-4 py-3 rounded-xl text-sm font-sans text-white placeholder-zinc-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-950 border border-gold-500/30 hover:border-gold-500 hover:bg-gold-500 hover:text-dark-950 text-gold-500 font-display font-extrabold text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
                    onMouseEnter={() => setIsHoveredInteractive(true)}
                    onMouseLeave={() => setIsHoveredInteractive(false)}
                  >
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ================= WEBSITE FOOTER ================= */}
      <footer className="w-full bg-black border-t border-white/5 py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px] text-zinc-500 select-none uppercase tracking-widest">
        <div>
          © {currentYear} Rinku Dhakad. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:rinkudhakad@example.com" className="hover:text-gold-500 transition-colors">
            rinkudhakad@example.com
          </a>
          <span>|</span>
          <span className="text-zinc-600">Location: India</span>
        </div>
      </footer>
    </>
  );
}
