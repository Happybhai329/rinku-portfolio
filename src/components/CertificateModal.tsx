"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Copy, Award, ShieldCheck, Calendar } from "lucide-react";
import confetti from "canvas-confetti";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const certId = "6928f1728d106c745a68265f";

  // Trigger luxury gold confetti when opened
  useEffect(() => {
    if (isOpen) {
      const duration = 1.8 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);
        // Gold and white confetti
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#C5A880", "#D4AF37", "#FFFFFF", "#E5E7EB"]
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#C5A880", "#D4AF37", "#FFFFFF", "#E5E7EB"]
        });
      }, 250);

      // Lock scroll while open
      document.body.style.overflow = "hidden";

      return () => {
        clearInterval(interval);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(certId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fail silently
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-zinc-950 rounded-2xl border border-white/10 shadow-3xl z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/5 text-zinc-400 hover:text-white hover:border-gold-500 transition-colors z-20 cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Left Panel: Verified Info */}
        <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between bg-zinc-900/30">
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Credential</span>
                <span className="text-xs font-bold font-display uppercase tracking-wider text-white">Editing Skool Graduate</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Certification</span>
              <span className="text-sm font-bold text-white leading-snug">Video Editing Masterclass</span>
              <span className="text-xs text-zinc-400">Editing, pacing, sound design, grading, motion and compositing.</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-400">
              <Calendar className="w-4 h-4 text-gold-500/80" />
              <span className="text-xs font-mono">Issued Dec 06, 2025</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs font-mono text-green-400">Officially Verified Online</span>
            </div>
          </div>

          {/* Certificate ID Box */}
          <div className="mt-8 bg-black/60 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Credential ID</span>
            <div className="flex items-center justify-between gap-2 bg-zinc-950 px-3 py-2 rounded border border-white/5 font-mono text-xs text-zinc-300">
              <span className="truncate">{certId}</span>
              <button
                onClick={copyToClipboard}
                className="text-zinc-500 hover:text-gold-500 transition-colors shrink-0 cursor-pointer"
                title="Copy Credential ID"
              >
                {copied ? <Check className="w-4.5 h-4.5 text-green-500" /> : <Copy className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Certificate Render (High-fidelity digital replica) */}
        <div className="flex-1 p-6 md:p-8 bg-zinc-950 flex items-center justify-center overflow-y-auto">
          <div className="w-full aspect-[4/3] max-w-md border-[12px] border-zinc-900 bg-white text-zinc-950 p-6 md:p-8 flex flex-col justify-between relative shadow-2xl rounded-sm">
            
            {/* Elegant Border Corners */}
            <div className="absolute inset-2 border border-zinc-200 pointer-events-none" />
            <div className="absolute inset-4 border-2 border-double border-zinc-300 pointer-events-none" />

            {/* Top Logo / Stamp */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-400 tracking-widest font-bold">ES MASTERCLASS</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-400 bg-zinc-50">
                ★
              </div>
            </div>

            {/* Certificate Header */}
            <div className="text-center flex flex-col gap-2 my-2">
              <h3 className="text-2xl font-serif tracking-widest text-zinc-900 font-bold uppercase">Certificate</h3>
              <p className="text-[8px] tracking-widest text-zinc-400 font-bold uppercase border-y border-zinc-100 py-1 max-w-[200px] mx-auto">
                OF COMPLETION
              </p>
            </div>

            {/* Recipient info */}
            <div className="text-center flex flex-col gap-1">
              <p className="text-[9px] font-serif italic text-zinc-400">This certificate is proudly presented to</p>
              <h4 className="text-xl md:text-2xl font-serif text-zinc-950 font-bold border-b border-zinc-300 pb-1 max-w-[260px] mx-auto">
                Rinku Dhakad
              </h4>
            </div>

            {/* Achievement text */}
            <div className="text-center px-4">
              <p className="text-[9px] leading-relaxed text-zinc-500">
                for successfully completing the comprehensive <strong>Video Editing Masterclass</strong>, covering post-production assembly, storytelling pacing, sound design, color grading, and advanced Fusion motion graphics.
              </p>
            </div>

            {/* Bottom: Date, Signature, ID */}
            <div className="flex justify-between items-end border-t border-zinc-100 pt-4 text-[8px] font-mono text-zinc-400">
              <div className="flex flex-col text-left">
                <span>DATE</span>
                <span className="text-zinc-900 font-semibold mt-0.5">December 06, 2025</span>
              </div>

              {/* Signature Line */}
              <div className="flex flex-col items-center">
                {/* Mock Signature graphic */}
                <div className="w-14 h-4 relative overflow-visible flex items-center justify-center">
                  <svg viewBox="0 0 100 30" className="w-full h-full stroke-zinc-900 stroke-2 fill-none overflow-visible opacity-80">
                    <path d="M10 20 Q 30 5, 50 25 T 90 15 M 20 25 L 80 10" />
                  </svg>
                </div>
                <div className="w-16 border-t border-zinc-200 mt-1" />
                <span className="mt-0.5">AUTHORISED SIGNATURE</span>
              </div>

              <div className="flex flex-col text-right">
                <span>VERIFICATION ID</span>
                <span className="text-zinc-900 font-semibold mt-0.5">{certId.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
