import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, BookOpen, Brain, Sparkles, Send, Type, Layers } from 'lucide-react';

const JobArchitect = () => {
    const [description, setDescription] = useState("");
    const [showAiPortal, setShowAiPortal] = useState(true);

    const suggestions = [
        { type: 'bias', text: "Consider replacing 'Rockstar' with 'Expert'. Neutral language increases female applicant rate by 24%.", icon: <ShieldAlert size={14} className="text-system-amber" /> },
        { type: 'keyword', text: "Detected 'Distributed Systems'. Suggest adding 'Vector Databases' to attract higher resonance candidates.", icon: <BookOpen size={14} className="text-terminal-green" /> },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex font-geist relative">
            <div className="void-scanline" />
            <div className="void-noise" />

            {/* Editor Side */}
            <div className="flex-1 p-12 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold tracking-[0.4em] uppercase text-terminal-green mb-2">Job_Architect</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest">Constructing Future-Proof Talent Pipelines</p>
                </header>

                <div className="max-w-3xl space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Variable: JOB_TITLE</label>
                        <input
                            className="w-full bg-transparent border-b border-terminal-green/20 text-2xl font-bold focus:border-terminal-green outline-none py-2 transition-colors"
                            placeholder="e.g. Principal Neural Architect"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Matrix: JOB_DESCRIPTION</label>
                            <div className="flex gap-4 text-[9px] text-zinc-600 uppercase tracking-tighter">
                                <span>Chars: {description.length}</span>
                                <span>Tone: Industrial / Professional</span>
                            </div>
                        </div>
                        <textarea
                            className="w-full h-96 bg-zinc-900/20 border border-white/5 rounded-xl p-8 focus:border-terminal-green/40 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                            placeholder="Describe the mission..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
                                <Layers size={14} /> Templates
                            </button>
                            <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
                                <Type size={14} /> Style_Guide
                            </button>
                        </div>
                        <button className="bg-terminal-green text-black px-8 py-3 rounded text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all flex items-center gap-3">
                            Deploy_To_Feed <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Sidebar */}
            <AnimatePresence>
                {showAiPortal && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="w-96 border-l border-terminal-green/20 bg-zinc-950/50 backdrop-blur-xl p-8 overflow-y-auto"
                    >
                        <div className="flex items-center gap-3 mb-12">
                            <Brain className="text-terminal-green animate-pulse" size={20} />
                            <h2 className="text-sm uppercase tracking-widest text-white">AI_CoPilot // Phi-3.5</h2>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] uppercase tracking-widest text-zinc-500">Live_Analysis</h3>
                                    <div className="h-1 w-12 bg-terminal-green/20 rounded-full overflow-hidden">
                                        <motion.div animate={{ x: [-48, 48] }} transition={{ repeat: Infinity, duration: 2 }} className="h-full w-full bg-terminal-green" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {suggestions.map((s, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 bg-zinc-900/50 border border-white/5 rounded-lg text-[11px] leading-relaxed relative group overflow-hidden"
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-0.5">{s.icon}</div>
                                                <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors">{s.text}</p>
                                            </div>
                                            <div className="absolute bottom-0 left-0 h-0.5 bg-terminal-green/30 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            <section className="p-6 bg-terminal-green/5 border border-terminal-green/20 rounded-xl relative">
                                <Sparkles className="absolute -top-2 -right-2 text-terminal-green" size={16} />
                                <h4 className="text-[10px] uppercase tracking-widest text-white mb-3">Predicted_Candidate_Pool</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] text-zinc-500 italic">
                                        <span>Estimated Leads</span>
                                        <span>12 - 18</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-zinc-500 italic">
                                        <span>Avg. Resonance</span>
                                        <span className="text-terminal-green">89.2%</span>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 border border-terminal-green/30 text-terminal-green text-[9px] uppercase tracking-widest hover:bg-terminal-green hover:text-black transition-all">
                                    Run_Pre_Simulation
                                </button>
                            </section>

                            <footer className="pt-20 text-center">
                                <div className="text-[9px] text-zinc-700 uppercase tracking-widest font-mono">
                                    Syncing with Sector_LanceDB...
                                </div>
                            </footer>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobArchitect;
