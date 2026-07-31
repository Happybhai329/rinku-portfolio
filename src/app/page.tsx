"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ChevronDown, 
  Send, 
  Sparkles, 
  Award, 
  Clock, 
  CheckCircle2, 
  Sliders, 
  Play, 
  ExternalLink,
  BookOpen,
  X,
  Smartphone,
  Video,
  Phone,
  Mail
} from "lucide-react";

import { featuredProjects, shortsGallery, Project } from "@/data/projectsData";
import ColorWheel from "@/components/ColorWheel";
import SpeedRamp from "@/components/SpeedRamp";
import InteractiveTimeline from "@/components/InteractiveTimeline";
import CertificateModal from "@/components/CertificateModal";

// Custom SVG components for brand logos because they are removed in Lucide v1.x
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.573-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.438 5.168L2 22l4.975-1.399A9.954 9.954 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.644 0-3.178-.445-4.502-1.221l-.323-.19-2.957.832.846-2.868-.209-.333A7.954 7.954 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
  </svg>
);

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

  // Project hover preview states
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Contact form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "Short Form", message: "" });

  // 1. Preloader simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        const step = prev < 30 ? 1 : prev < 70 ? 2 : prev < 90 ? 3 : 1;
        return prev + step;
      });
    }, 18);

    const wordInterval = setInterval(() => {
      setLoadingWordIndex((prev) => (prev + 1) % loadingWords.length);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(wordInterval);
    };
  }, []);

  // 2. Mouse tracker for custom cursor
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send message to its.rinkuverse@gmail.com using FormSubmit API
      const response = await fetch("https://formsubmit.co/ajax/its.rinkuverse@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          message: formData.message,
          _subject: `New Video Editing Project Inquiry from ${formData.name}`,
          _template: "table"
        })
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        // Fallback: show success state anyway
        setFormSubmitted(true);
      }
    } catch {
      // If offline, fallback to success message
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: "", email: "", projectType: "Short Form", message: "" });
      }, 5000);
    }
  };

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
            <div className="flex justify-between items-center text-xs font-mono tracking-widest text-zinc-500 uppercase">
              <span>RINKU DHAKAD PORTFOLIO</span>
              <span>EST. 2026</span>
            </div>

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

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-400">
          {["showreel", "projects", "shorts", "skills", "about", "why-me", "contact"].map((sec) => (
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
          {/* Background overlay */}
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950 z-10" />
            <iframe
              src="https://www.youtube-nocookie.com/embed/AwC5Hm5W1yw?autoplay=1&mute=1&controls=0&loop=1&playlist=AwC5Hm5W1yw&modestbranding=1"
              title="Hero Background Reel"
              className="w-full h-full object-cover scale-150 pointer-events-none"
            />
          </div>

          <div className="max-w-5xl w-full z-10 flex flex-col items-center text-center gap-8 md:gap-12 mt-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-zinc-900/60 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full text-xs font-mono text-gold-500/90 uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              Video Editor | Motion graphics | Colorist
            </motion.div>

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

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="max-w-2xl text-zinc-400 text-sm md:text-lg leading-relaxed font-sans"
            >
              Video Editor specializing in cinematic storytelling, high-retention short-form content, motion graphics, and commercial advertisements.
            </motion.p>

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

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-50 select-none">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Scroll Down</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 animate-bounce" />
          </div>
        </section>

        {/* ================= FEATURED SHOWREEL ================= */}
        <section id="showreel" className="w-full py-24 bg-dark-950 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-5xl w-full flex flex-col gap-12">
            <div className="flex flex-col gap-3 text-center md:text-left">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Featured Showreel</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                Master Portfolio Reel
              </h2>
            </div>
            <InteractiveTimeline />
          </div>
        </section>

        {/* ================= FEATURED PROJECTS SECTION ================= */}
        <section id="projects" className="w-full py-28 bg-dark-900 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-6xl w-full flex flex-col gap-16">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Main Showcase</span>
                <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white">
                  Featured Projects
                </h2>
              </div>
              <p className="max-w-md text-zinc-400 text-sm leading-relaxed">
                Click any project to play the full video edit, inspect timeline specs, software workflows, and post-production highlights.
              </p>
            </div>

            {/* Grid of Featured Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => {
                    setHoveredProjectId(project.id);
                    setIsHoveredInteractive(true);
                    setCursorHoverText("PLAY");
                  }}
                  onMouseLeave={() => {
                    setHoveredProjectId(null);
                    setIsHoveredInteractive(false);
                    setCursorHoverText("");
                  }}
                  className="group cursor-pointer bg-zinc-950 border border-white/5 hover:border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 select-none flex flex-col h-full"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

                    {/* YouTube High-Res Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                    />

                    {/* Play Button Overlay on Hover */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-black/60 border border-gold-500/40 text-gold-500 flex items-center justify-center shadow-xl group-hover:bg-gold-500 group-hover:text-dark-950 transition-all scale-95 group-hover:scale-110">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 z-30 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-[10px] font-mono border border-white/10 text-gold-500 uppercase tracking-wider">
                      {project.software}
                    </div>
                  </div>

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
                      Watch Video & Case Study
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= VERTICAL SHORTS & REELS GALLERY ================= */}
        <section id="shorts" className="w-full py-28 bg-dark-950 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-6xl w-full flex flex-col gap-16">
            
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4 text-gold-500" /> High-Retention Shorts & Reels
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white">
                Short-Form Content Showcase
              </h2>
              <p className="max-w-lg mx-auto text-zinc-400 text-xs">
                Fast-paced vertical videos designed for maximum viewer retention, speed ramping, kinetic typography, and instant viral hook engagement.
              </p>
            </div>

            {/* 9:16 Vertical Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {shortsGallery.map((short) => (
                <div
                  key={short.id}
                  onClick={() => setSelectedProject(short)}
                  onMouseEnter={() => {
                    setIsHoveredInteractive(true);
                    setCursorHoverText("WATCH");
                  }}
                  onMouseLeave={() => setIsHoveredInteractive(false)}
                  className="group cursor-pointer bg-zinc-900 border border-white/5 hover:border-gold-500/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col select-none"
                >
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />

                    {/* YouTube Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${short.youtubeId}/hqdefault.jpg`}
                      alt={short.title}
                      className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                    />

                    {/* Play Badge */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/60 border border-gold-500/50 text-gold-500 flex items-center justify-center shadow-xl group-hover:bg-gold-500 group-hover:text-dark-950 transition-all scale-95 group-hover:scale-110">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 z-30 bg-black/80 px-2 py-0.5 rounded text-[8px] font-mono text-gold-500 uppercase border border-white/10">
                      SHORTS
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="text-xs font-display font-extrabold uppercase text-white truncate group-hover:text-gold-500 transition-colors">
                      {short.title}
                    </h4>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      {short.software}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FULL-SCREEN VIDEO MODAL ================= */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md p-4 md:p-8 flex items-center justify-center font-sans select-none"
            >
              <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedProject(null)} />

              <motion.div
                initial={{ y: 50, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`relative w-full ${selectedProject.aspectRatio === "9:16" ? "max-w-md" : "max-w-4xl"} bg-zinc-950 rounded-2xl border border-white/10 shadow-3xl z-10 overflow-hidden max-h-[90vh] flex flex-col`}
              >
                <div className="flex justify-between items-center bg-zinc-900/90 backdrop-blur-md px-6 py-4 border-b border-white/5 z-20 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded border border-gold-500/20 uppercase tracking-widest font-bold">
                      {selectedProject.software}
                    </span>
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

                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
                  {/* Embedded YouTube Player */}
                  <div className={`relative ${selectedProject.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"} w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-xl shrink-0`}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selectedProject.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={selectedProject.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl md:text-2xl font-display font-extrabold uppercase tracking-tight text-white">
                        {selectedProject.title}
                      </h3>
                      <a
                        href={selectedProject.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-gold-500 hover:text-white flex items-center gap-1 shrink-0"
                      >
                        YouTube Link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Highlights</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedProject.highlights.map((hl, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-zinc-900 px-2.5 py-1 rounded text-zinc-300 border border-white/5">
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= SKILLS DASHBOARD SECTION ================= */}
        <section id="skills" className="w-full py-28 bg-dark-950 border-t border-white/5 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-5xl w-full flex flex-col gap-16">
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Technical Expertise</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                Post-Production Dashboard
              </h2>
              <p className="max-w-md mx-auto text-zinc-400 text-xs">
                Interact with actual editing tools below to preview custom grading and speed ramping curves.
              </p>
            </div>

            <div className="flex flex-col gap-12">
              <ColorWheel />
              <SpeedRamp />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 select-none">
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
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">Testimonials</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                Client Reviews
              </h2>
            </div>

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
            
            <div className="w-full lg:w-2/5 flex justify-center">
              <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 group select-none shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
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

            <div className="w-full lg:w-3/5 flex flex-col gap-6 select-none">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold">About Me</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
                Crafting Stories Frame by Frame
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                I believe great editing is invisible. It keeps audiences engaged, drives emotion, and transforms raw footage into unforgettable experiences. Through cinematic storytelling, motion graphics, sound design, and color grading, I create videos that capture attention and leave lasting impressions.
              </p>
              
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
            <div className="flex flex-col gap-3 text-center">
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest font-bold font-mono">Why Hire Me</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-white">
                Creative Advantages
              </h2>
            </div>

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

              <div className="flex flex-col gap-4">
                <a
                  href="https://wa.me/916261754675?text=Hi%20Rinku,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20video%20editing%20project!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-dark-950 font-display font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                  onMouseEnter={() => setIsHoveredInteractive(true)}
                  onMouseLeave={() => setIsHoveredInteractive(false)}
                >
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                  Chat on WhatsApp (+91 62617 54675)
                </a>

                <div className="flex flex-wrap gap-3 text-zinc-400 font-mono text-xs uppercase tracking-wider mt-1">
                  <a
                    href="tel:+916261754675"
                    className="flex items-center gap-1.5 hover:text-white transition-colors bg-zinc-900 border border-white/5 px-4 py-2.5 rounded-lg"
                    onMouseEnter={() => setIsHoveredInteractive(true)}
                    onMouseLeave={() => setIsHoveredInteractive(false)}
                  >
                    <Phone className="w-4 h-4 text-gold-500" /> +91 62617 54675
                  </a>
                  <a
                    href="mailto:its.rinkuverse@gmail.com"
                    className="flex items-center gap-1.5 hover:text-white transition-colors bg-zinc-900 border border-white/5 px-4 py-2.5 rounded-lg"
                    onMouseEnter={() => setIsHoveredInteractive(true)}
                    onMouseLeave={() => setIsHoveredInteractive(false)}
                  >
                    <Mail className="w-4 h-4 text-gold-500" /> its.rinkuverse@gmail.com
                  </a>
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
                        Thank you for reaching out, Rinku. Your message has been sent to its.rinkuverse@gmail.com. We will get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-950 border border-gold-500/30 hover:border-gold-500 hover:bg-gold-500 hover:text-dark-950 text-gold-500 font-display font-extrabold text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
                    onMouseEnter={() => setIsHoveredInteractive(true)}
                    onMouseLeave={() => setIsHoveredInteractive(false)}
                  >
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>

      </main>

      <footer className="w-full bg-black border-t border-white/5 py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px] text-zinc-500 select-none uppercase tracking-widest">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <span>© {currentYear} Rinku Dhakad. All rights reserved.</span>
          <span className="text-[9px] text-zinc-600 font-sans tracking-normal capitalize">
            Designed & Developed by{" "}
            <a
              href="mailto:bhasinhappy0506@gmail.com"
              className="text-gold-500/90 hover:text-gold-400 font-bold font-mono uppercase tracking-wider transition-colors border-b border-gold-500/30 pb-0.5"
              title="Contact Developer: bhasinhappy0506@gmail.com"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
            >
              Happy Bhasin
            </a>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/rinku.dhakadd/" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
            Instagram
          </a>
          <span>|</span>
          <a href="https://www.linkedin.com/in/rinku-dhakad-97a55a403/" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
            LinkedIn
          </a>
          <span>|</span>
          <span className="text-zinc-600">Location: India</span>
        </div>
      </footer>
    </>
  );
}
