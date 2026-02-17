import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Briefcase, MapPin, DollarSign, Zap, MessageSquare, Filter } from 'lucide-react';

const SmartFeed = () => {
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [jobs, setJobs] = useState([
        { id: 1, title: "Lead Systems Architect", company: "NeuroLink", location: "San Francisco / Remote", salary: "$220k - $280k", resonance: 94, tags: ["Rust", "Distributed Systems"] },
        { id: 2, title: "Senior Frontend Engineer", company: "CyberPulse", location: "London / Remote", salary: "£120k - £160k", resonance: 88, tags: ["React", "WebGL", "Vite"] },
        { id: 3, title: "AI Deployment Ops", company: "Void.ai", location: "Neo-Tokyo", salary: "$180k - $210k", resonance: 72, tags: ["Docker", "K8s", "Phi-3"] },
    ]);

    // Handle Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsPaletteOpen(true);
            }
            if (e.key === 'Escape') {
                setIsPaletteOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-6 font-geist relative">
            <div className="void-scanline" />
            <div className="void-noise" />

            {/* Top Nav / Search */}
            <div className="max-w-3xl mx-auto mb-12">
                <div
                    onClick={() => setIsPaletteOpen(true)}
                    className="glass-morphism rounded-full px-6 py-4 border border-terminal-green/20 flex items-center justify-between cursor-text hover:border-terminal-green/50 transition-all group"
                >
                    <div className="flex items-center gap-4 text-zinc-500">
                        <Search size={20} className="group-hover:text-terminal-green transition-colors" />
                        <span className="text-sm tracking-widest uppercase">Initiate Semantic Search...</span>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-[10px] text-zinc-400 font-mono">
                        <Command size={10} />
                        <span>K</span>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs uppercase tracking-[0.4em] text-zinc-500">Smart_Feed // Resonance_Sorted</h2>
                    <button className="text-zinc-500 hover:text-terminal-green p-2 transition-colors">
                        <Filter size={16} />
                    </button>
                </div>

                {jobs.map((job) => (
                    <motion.div
                        key={job.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-morphism rounded-xl p-6 border border-white/5 hover:border-terminal-green/30 transition-all glow-border relative group overflow-hidden"
                    >
                        {/* Resonance Badge */}
                        <div className="absolute top-6 right-6 flex flex-col items-end">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Resonance</div>
                            <div className={`text-xl font-bold font-mono ${job.resonance > 90 ? 'text-terminal-green' : 'text-zinc-300'}`}>
                                {job.resonance}%
                            </div>
                            <div className="w-16 h-1 bg-zinc-900 mt-1 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${job.resonance}%` }}
                                    className={`h-full ${job.resonance > 90 ? 'bg-terminal-green shadow-[0_0_10px_#10b981]' : 'bg-zinc-600'}`}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-zinc-900 rounded border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-terminal-green transition-colors">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold tracking-tight mb-1 group-hover:text-terminal-green transition-colors">{job.title}</h3>
                                <div className="flex items-center gap-4 text-zinc-500 text-xs uppercase tracking-widest font-mono">
                                    <span className="text-white">{job.company}</span>
                                    <div className="flex items-center gap-1"><MapPin size={12} /> {job.location}</div>
                                    <div className="flex items-center gap-1"><DollarSign size={12} /> {job.salary}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {job.tags.map(tag => (
                                <span key={tag} className="text-[9px] uppercase tracking-widest px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:border-terminal-green/20 group-hover:text-zinc-200 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                            <button className="flex-1 bg-terminal-green text-black font-bold text-xs uppercase tracking-[0.2em] py-3 rounded hover:bg-emerald-400 transition-all">
                                Resonate_Now
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center border border-white/10 rounded hover:border-terminal-green transition-all">
                                <MessageSquare size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* NexusPalette (Command Palette) */}
            <AnimatePresence>
                {isPaletteOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPaletteOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: -20 }}
                            className="w-full max-w-2xl bg-[#050505] border border-terminal-green/30 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden relative z-10"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center gap-4">
                                <Command size={20} className="text-terminal-green" />
                                <input
                                    autoFocus
                                    placeholder="Ask Nexus anything... (e.g., 'Find me Rust roles with high communication score')"
                                    className="bg-transparent border-none outline-none flex-1 text-lg font-mono placeholder:text-zinc-700"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest px-2 py-1 border border-zinc-800 rounded">
                                    ESC to Close
                                </div>
                            </div>

                            <div className="p-8 space-y-4">
                                <div className="text-[10px] uppercase tracking-widest text-zinc-500">Suggested_Directives</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Analyze My Resume Gaps",
                                        "Predicted Career In 2027",
                                        "Top 5 Resonant Companies",
                                        "Mock Interview with Aria"
                                    ].map((dir) => (
                                        <button key={dir} className="text-left p-4 glass-morphism border border-white/5 rounded-lg hover:border-terminal-green/40 group transition-all">
                                            <div className="flex items-center gap-3">
                                                <Zap size={14} className="text-zinc-600 group-hover:text-terminal-green" />
                                                <span className="text-xs uppercase tracking-widest text-zinc-400 group-hover:text-white">{dir}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-zinc-900/50 p-4 border-t border-white/5 flex justify-between items-center text-[9px] text-zinc-500 font-mono uppercase tracking-widest">
                                <span>Nexus Core v4.2.1-stable</span>
                                <span>Powered by Phi-3.5 Intelligence</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartFeed;
