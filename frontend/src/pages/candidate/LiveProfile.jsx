import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Shield, Zap, Target, TrendingUp, Cpu, Braces } from 'lucide-react';

const LiveProfile = () => {
    const [activeResume, setActiveResume] = useState(true);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-geist overflow-hidden relative">
            <div className="void-scanline" />
            <div className="void-noise" />

            {/* Header */}
            <header className="mb-12 flex justify-between items-end border-b border-terminal-green/20 pb-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-widest uppercase text-terminal-green">Nexus // Candidate_01</h1>
                    <p className="text-zinc-500 text-sm mt-1">Status: <span className="text-terminal-green animate-pulse">Synchronized</span></p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-zinc-600 tracking-tighter italic">Identity Verified // Bio-Signature Match</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Col: Holographic Resume */}
                <div className="lg:col-span-5 flex flex-col items-center">
                    <h2 className="text-xs uppercase tracking-[0.3em] mb-6 text-zinc-400">Holographic_Resume.pen</h2>

                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="w-full max-w-md aspect-[3/4] glass-morphism rounded-2xl relative p-8 cursor-crosshair group glow-border"
                    >
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 to-transparent rounded-2xl pointer-events-none" />

                        {/* Content Content Content */}
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 rounded bg-terminal-green/20 border border-terminal-green flex items-center justify-center">
                                        <Cpu className="text-terminal-green" size={24} />
                                    </div>
                                    <div className="text-[10px] uppercase text-terminal-green/60 tracking-widest border border-terminal-green/30 px-2 py-1">
                                        Encrypted_v2.4
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-1 w-2/3 bg-terminal-green/40" />
                                    <h3 className="text-2xl font-bold tracking-tight">ALEX DRIVER</h3>
                                    <p className="text-xs text-terminal-green/80 uppercase tracking-widest">Senior Neural Architect</p>

                                    <div className="mt-8 space-y-3">
                                        <div className="h-2 w-full bg-zinc-900 rounded" />
                                        <div className="h-2 w-5/6 bg-zinc-900 rounded" />
                                        <div className="h-2 w-4/6 bg-zinc-900 rounded" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <div className="flex gap-4">
                                    <div className="text-[10px] text-zinc-500 font-mono">
                                        <p>UUID: 8F32-K9LX</p>
                                        <p>LOC: Neo-Tokyo // Sector 7</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floaties */}
                        <motion.div
                            style={{ translateZ: "50px" }}
                            className="absolute -top-4 -right-4 bg-terminal-green text-black px-3 py-1 text-xs font-bold uppercase"
                        >
                            98% Match
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Col: DNA & Feed */}
                <div className="lg:col-span-7 space-y-12">
                    {/* Skill DNA */}
                    <section className="glass-morphism rounded-xl p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Zap className="text-system-amber animate-pulse" size={20} />
                        </div>

                        <h3 className="text-sm uppercase tracking-widest mb-8 text-zinc-400">Skill_DNA.sys // Visualizer</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {[
                                { name: "React / Vite", val: "98%", icon: <Braces size={16} /> },
                                { name: "System Design", val: "85%", icon: <Shield size={16} /> },
                                { name: "Neural Logic", val: "92%", icon: <Cpu size={16} /> },
                                { name: "Cloud Sprawl", val: "78%", icon: <TrendingUp size={16} /> },
                                { name: "Protocol V6", val: "88%", icon: <Target size={16} /> },
                            ].map((skill, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-terminal-green opacity-50">{skill.icon}</span>
                                        <span className="text-[10px] uppercase text-zinc-500 tracking-wider group-hover:text-zinc-300 transition-colors">{skill.name}</span>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-bold">{skill.val}</span>
                                        <div className="flex-1 h-px bg-zinc-800 mb-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: skill.val }}
                                                className="h-full bg-terminal-green/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Career Trajectory Prediction */}
                    <section className="glass-morphism rounded-xl p-8 border border-white/5">
                        <h3 className="text-sm uppercase tracking-widest mb-6 text-zinc-400">Career_Trajectory // Predictive_Model</h3>

                        <div className="h-32 flex items-end gap-1">
                            {[40, 65, 55, 80, 75, 95, 100].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.1, type: "spring" }}
                                        className="w-full bg-gradient-to-t from-terminal-green/5 to-terminal-green/30 group-hover:from-terminal-green/20 group-hover:to-terminal-green/60 transition-colors relative"
                                    >
                                        {i === 6 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-terminal-green whitespace-nowrap">NEXT ROLE: PRINCIPAL</div>}
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between text-[9px] text-zinc-600 uppercase tracking-widest">
                            <span>2022</span>
                            <span>2023</span>
                            <span>2024</span>
                            <span>2025</span>
                            <span>2026_EST</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default LiveProfile;
