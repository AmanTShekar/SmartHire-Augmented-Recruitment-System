import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Video, Activity, Globe, Eye, User, Cpu } from 'lucide-react';
import SentinelVerify from '../components/SentinelVerify';

const InterviewHUD = () => {
    const [pulse, setPulse] = useState(1);
    const [isVerified, setIsVerified] = useState(false);
    const [candidateData, setCandidateData] = useState({ id: "CAND_99", name: "Alex Driver" });

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(prev => prev === 1 ? 1.2 : 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!isVerified) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
                <div className="void-scanline" />
                <div className="void-noise" />
                <div className="z-10 w-full max-w-2xl">
                    <SentinelVerify
                        candidateId={candidateData.id}
                        onVerified={(res) => {
                            console.log("Biometric Auth Success:", res);
                            setIsVerified(true);
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 font-geist flex flex-col relative overflow-hidden">
            <div className="void-scanline" />
            <div className="void-noise" />

            {/* Top HUD */}
            <header className="flex justify-between items-center z-10 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                    <div className="text-xs uppercase tracking-[0.4em] text-zinc-400 font-bold">Session // Alpha_Interrogate_09</div>
                </div>
                <div className="flex gap-8 text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                    <div className="flex items-center gap-2"><Globe size={12} className="text-terminal-green" /> Latency: 42ms</div>
                    <div className="flex items-center gap-2"><Globe size={12} className="text-terminal-green" /> Stream: Encrypted</div>
                </div>
            </header>

            {/* Main Experience */}
            <div className="flex-1 grid grid-cols-12 gap-6 items-center">

                {/* Left Side: Candidate Feed */}
                <div className="col-span-8 h-full relative group">
                    <div className="absolute inset-0 border border-white/5 rounded-3xl overflow-hidden bg-zinc-900/10 backdrop-blur-sm">
                        {/* Placeholder for Video Feed */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <User size={64} className="text-zinc-800" />
                        </div>

                        {/* Proctoring Mesh Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <path d="M50 20 L30 40 L50 60 L70 40 Z" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.5" />
                                <circle cx="50" cy="40" r="15" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.2" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="0.1" />
                                <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="0.1" />
                            </svg>
                        </div>

                        {/* Face ID Tag */}
                        <div className="absolute top-8 left-8 flex items-center gap-2 bg-terminal-green/20 border border-terminal-green/40 px-3 py-1 rounded text-[10px] tracking-widest uppercase text-terminal-green">
                            <Eye size={12} /> ID_VERIFIED: ALEX_DRIVER
                        </div>
                    </div>

                    {/* Bottom Feed Overlay */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-2/3 glass-morphism rounded-2xl p-6 border border-terminal-green/30">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded bg-terminal-green/10">
                                <Mic size={16} className="text-terminal-green" />
                            </div>
                            <div className="flex-1 h-8 flex items-center gap-1">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, Math.random() * 24 + 4, 4] }}
                                        transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: i * 0.05 }}
                                        className="flex-1 bg-terminal-green opacity-40 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Aria Orb */}
                <div className="col-span-4 flex flex-col items-center justify-center gap-12">
                    <div className="relative">
                        <motion.div
                            animate={{ scale: pulse, opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-64 h-64 rounded-full bg-terminal-green filter blur-[60px] opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-48 h-48 rounded-full border border-terminal-green/40 flex items-center justify-center relative bg-black shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        >
                            <div className="w-32 h-32 rounded-full border border-terminal-green/20 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full border border-terminal-green/60 animate-pulse flex items-center justify-center">
                                    <Cpu size={24} className="text-terminal-green opacity-50" />
                                </div>
                            </div>
                            {/* Orbital dots */}
                            {[0, 90, 180, 270].map((deg) => (
                                <motion.div
                                    key={deg}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 p-2"
                                >
                                    <div className="w-2 h-2 rounded-full bg-terminal-green" style={{ transform: `rotate(${deg}deg) translateY(-24px)` }} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-bold tracking-[0.5em] uppercase text-terminal-green">ARIA_V3</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest max-w-xs leading-relaxed italic">
                            "Analyzing speech patterns // Sentiment: Neutral to Positive // Recommended next question: Conflict Resolution"
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-terminal-green transition-all">
                            <Video size={20} className="text-zinc-600" />
                        </button>
                        <button className="w-12 h-12 rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center hover:bg-red-500 transition-all group">
                            <Globe size={20} className="text-red-500 group-hover:text-black" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats HUD Footer */}
            <footer className="mt-6 grid grid-cols-4 gap-4 z-10">
                {[
                    { label: "Stability", val: "Optimal" },
                    { label: "Stress_Idx", val: "L-2" },
                    { label: "Cognition", val: "High" },
                    { label: "Encryption", val: "AES_256" },
                ].map((stat, i) => (
                    <div key={i} className="glass-morphism p-3 rounded-lg border border-white/5 flex flex-col items-center">
                        <span className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1">{stat.label}</span>
                        <span className="text-xs font-bold font-mono text-zinc-300">{stat.val}</span>
                    </div>
                ))}
            </footer>
        </div>
    );
};

export default InterviewHUD;
