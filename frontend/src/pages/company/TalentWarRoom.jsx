import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Clock, Zap, Target, ArrowUpRight, Search } from 'lucide-react';

const TalentWarRoom = () => {
    const metrics = [
        { label: "Time to Hire", value: "14.2 Days", change: "-2.4", trend: "down" },
        { label: "Pipeline Velocity", value: "88 km/h", change: "+12", trend: "up" },
        { label: "Candidate Quality", value: "A-", change: "+0.2", trend: "up" },
    ];

    const topCandidates = [
        { id: 1, name: "Sarah Connor", role: "Principal Engineer", match: 96, state: "Interviewing" },
        { id: 2, name: "Marcus Wright", role: "Sr. DevOps", match: 91, state: "Analyzing" },
        { id: 3, name: "Kyle Reese", role: "NLO Engineer", match: 84, state: "Screened" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 font-geist relative">
            <div className="void-scanline" />
            <div className="void-noise" />

            {/* Title */}
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-[0.4em] uppercase text-terminal-green">Talent_War_Room</h1>
                    <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest">Global Recruitment Intelligence // Sector Alpha</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-morphism px-4 py-2 border border-white/5 rounded text-xs text-zinc-400">
                        SYSTEM_UPTIME: 99.9%
                    </div>
                </div>
            </header>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {metrics.map((m, i) => (
                    <div key={i} className="glass-morphism p-6 rounded-xl border border-white/5 glow-border group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-terminal-green transition-colors">{m.label}</span>
                            {m.trend === 'up' ? <ArrowUpRight size={14} className="text-terminal-green" /> : <Clock size={14} className="text-zinc-500" />}
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold font-mono tracking-tighter">{m.value}</span>
                            <span className={`text-[10px] pb-1 ${m.trend === 'up' ? 'text-terminal-green' : 'text-zinc-500'}`}>
                                {m.change}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Dashboard Area */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="glass-morphism rounded-xl border border-white/5 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm uppercase tracking-widest text-zinc-400">Active_Pipeline // Candidate_Intelligence</h3>
                            <div className="flex gap-2">
                                <div className="bg-zinc-900 px-3 py-1 rounded text-[10px] border border-white/5 uppercase tracking-widest text-zinc-500">
                                    Filter: High_Match
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {topCandidates.map((c) => (
                                <motion.div
                                    key={c.id}
                                    whileHover={{ x: 8 }}
                                    className="group flex items-center justify-between p-4 bg-zinc-950/50 border border-white/5 rounded-lg hover:border-terminal-green/30 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-terminal-green">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold tracking-tight text-sm group-hover:text-white transition-colors">{c.name}</h4>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{c.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">State</div>
                                            <div className={`text-[10px] font-bold uppercase tracking-widest ${c.state === 'Analyzing' ? 'text-system-amber animate-pulse' : 'text-zinc-300'}`}>
                                                {c.state}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Cognitive_Score</div>
                                            <div className="text-lg font-bold font-mono text-terminal-green">{c.match}%</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Cognitive Chain View (Placeholder) */}
                    <section className="glass-morphism rounded-xl border border-white/5 p-8 relative overflow-hidden h-64 flex flex-col items-center justify-center border-dashed border-zinc-800">
                        <Zap className="text-zinc-800 mb-4" size={48} />
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">Select a candidate to initialize Cognitive_Chain</p>
                        <div className="mt-4 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-zinc-900" />
                            <div className="w-2 h-2 rounded-full bg-zinc-900" />
                            <div className="w-2 h-2 rounded-full bg-zinc-900" />
                        </div>
                    </section>
                </div>

                {/* Sidebar: System Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="glass-morphism rounded-xl border border-white/5 p-8">
                        <h3 className="text-sm uppercase tracking-widest mb-6 text-zinc-400">Node_Health</h3>
                        <div className="space-y-6">
                            {[
                                { label: "Ollama / Phi-3.5", val: "92%", color: "bg-terminal-green" },
                                { label: "LanceDB / VectorSearch", val: "99%", color: "bg-terminal-green" },
                                { label: "Kokoro / TTS_Engine", val: "84%", color: "bg-system-amber" },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                                        <span>{s.label}</span>
                                        <span>{s.val}</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: s.val }}
                                            className={`h-full ${s.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-morphism rounded-xl border border-terminal-green/20 p-8 bg-terminal-green/[0.02]">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="text-terminal-green" size={16} />
                            <h3 className="text-xs uppercase tracking-widest text-white">AI_Archivist // Logic</h3>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-mono italic">
                            "Pipeline velocity has increased by 14% since shifting to semantic matching. Recommend increasing Llama-3.2 context window for next interview batch."
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TalentWarRoom;
