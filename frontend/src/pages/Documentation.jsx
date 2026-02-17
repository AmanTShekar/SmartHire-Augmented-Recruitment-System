import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search, ChevronRight, Activity, Database, Play, Cpu,
    Menu, X, Terminal, Server, Shield, Zap, Network,
    Lock, ArrowLeft, Copy, ArrowUpRight, ArrowRight, FileText,
    User, Target, GitBranch, Code, Rocket
} from 'lucide-react';

// --- DATA ---
const DOCS_DATA = {
    'mission-protocol': {
        title: "Mission Protocol",
        subtitle: "The philosophical mandate behind augmented recruitment.",
        content: <MissionContent />
    },
    'project-goals': {
        title: "Project Goals",
        subtitle: "Vision, objectives, and success metrics for SmartHire.",
        content: <ProjectGoalsContent />
    },
    'creator-info': {
        title: "About Creator",
        subtitle: "Meet the developer behind SmartHire.",
        content: <CreatorInfoContent />
    },
    'thesis': {
        title: "The Thesis",
        subtitle: "The philosophical foundation of augmented capital.",
        content: <ThesisContent />
    },
    'neural-architecture': {
        title: "Neural Architecture",
        subtitle: "Deep-dive into the 8-layer Chain-of-Thought engine.",
        content: <ArchitectureContent />
    },
    'backend-architecture': {
        title: "Backend Stack",
        subtitle: "FastAPI server, Redis queue, and database architecture.",
        content: <BackendArchitectureContent />
    },
    'sentinel-system': {
        title: "Integrity Sentinel",
        subtitle: "Proctoring and anti-cheating monitoring (Emotion analysis: LOCKED).",
        content: <SentinelContent />
    },
    'resonance-engine': {
        title: "Resonance Engine",
        subtitle: "Semantic Capability Analysis via vector search technology.",
        content: <ResonanceContent />
    },
    'intelligence': {
        title: "Augmented Intelligence",
        subtitle: "Deep-dive into R1 Distillation and the Llama Mesh.",
        content: <IntelligenceContent />
    },
    'api-reference': {
        title: "API Reference",
        subtitle: "Programmatic access to the SmartHire inference mesh.",
        content: <ApiReferenceContent />
    },
    'deployment': {
        title: "Deployment",
        subtitle: "System requirements, installation, and production setup.",
        content: <DeploymentContent />
    },
    'contributing': {
        title: "Contributing",
        subtitle: "Development setup, code style, and contribution guidelines.",
        content: <ContributingContent />
    },
    'network': {
        title: "The Network",
        subtitle: "Community mesh, forking guide, and ecosystem growth.",
        content: <NetworkContent />
    },
    'compliance': {
        title: "Compliance & Governance",
        subtitle: "Regulatory framework: GDPR, NYC Law 144, EU AI Act.",
        content: <ComplianceContent />
    },
    'legal': {
        title: "Legal & Governance",
        subtitle: "Experimental status, PolyForm Licensing, and prohibitions.",
        content: <LegalContent />
    },
    'privacy': {
        title: "Privacy Policy",
        subtitle: "Data sovereignty, local-first processing, and biometric policy.",
        content: <PrivacyContent />
    },
    'status': {
        title: "System Status",
        subtitle: "Real-time health pulse and third-party attribution.",
        content: <StatusContent />
    },
    'connect': {
        title: "Intelligence Network",
        subtitle: "Official proxies for GitHub, Twitter, and LinkedIn.",
        content: <ConnectContent />
    },
    'ethics': {
        title: "Ethics & Safety",
        subtitle: "AI Safety benchmarks, bias mitigation, and transparency.",
        content: <EthicsContent />
    },
    'security': {
        title: "Security & Sovereignty",
        subtitle: "Local-first security whitepaper and data protocols.",
        content: <SecurityContent />
    },
    'support': {
        title: "Support & Resources",
        subtitle: "Maintainer triage and educational resource directory.",
        content: <SupportContent />
    }
};

const NAV_GROUPS = [
    {
        category: "00 // Platform",
        items: [
            { id: 'mission-protocol', label: 'Mission Protocol', index: '01', icon: Terminal },
            { id: 'project-goals', label: 'Project Goals', index: '02', icon: Target },
            { id: 'creator-info', label: 'About Creator', index: '03', icon: User },
        ]
    },
    {
        category: "01 // Architecture",
        items: [
            { id: 'neural-architecture', label: 'Neural Architecture', index: '04', icon: Cpu },
            { id: 'backend-architecture', label: 'Backend Stack', index: '05', icon: Server },
        ]
    },
    {
        category: "02 // Intelligence",
        items: [
            { id: 'sentinel-system', label: 'Integrity Sentinel', index: '06', icon: Activity },
            { id: 'resonance-engine', label: 'Resonance Engine', index: '07', icon: Zap },
        ]
    },
    {
        category: "03 // Developers",
        items: [
            { id: 'api-reference', label: 'API Reference', index: '08', icon: Code },
            { id: 'deployment', label: 'Deployment', index: '09', icon: Rocket },
            { id: 'contributing', label: 'Contributing', index: '10', icon: GitBranch },
        ]
    },
    {
        category: "04 // Operations",
        items: [
            { id: 'compliance', label: 'Compliance & XAI', index: '11', icon: Shield },
            { id: 'legal', label: 'Legal & Governance', index: '12', icon: FileText },
            { id: 'privacy', label: 'Privacy Policy', index: '13', icon: Lock },
            { id: 'status', label: 'System Status', index: '14', icon: Activity },
        ]
    },
    {
        category: "05 // Strategy",
        items: [
            { id: 'thesis', label: 'The Thesis', index: '15', icon: Target },
            { id: 'intelligence', label: 'AI Strategy', index: '16', icon: Cpu },
            { id: 'network', label: 'The Network', index: '17', icon: Network },
        ]
    },
    {
        category: "06 // Trust & Community",
        items: [
            { id: 'ethics', label: 'Ethics & Safety', index: '18', icon: Shield },
            { id: 'security', label: 'Security Protocols', index: '19', icon: Lock },
            { id: 'connect', label: 'Connect Bridge', index: '20', icon: Network },
            { id: 'support', label: 'Support Room', index: '21', icon: Terminal },
        ]
    }
];

const FLATTENED_NAV = NAV_GROUPS.flatMap(group => group.items);

const Documentation = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('mission-protocol');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchActive, setSearchActive] = useState(false);
    const scrollRef = useRef(null);
    const searchInputRef = useRef(null);

    // Sync active section with URL hash for navigation consistency
    useEffect(() => {
        const syncHashWithSection = () => {
            const currentHash = window.location.hash.replace('#', '');
            if (currentHash && DOCS_DATA[currentHash]) {
                setActiveSection(currentHash);
            }
        };

        syncHashWithSection(); // Initial check on mount
        window.addEventListener('hashchange', syncHashWithSection);
        return () => window.removeEventListener('hashchange', syncHashWithSection);
    }, []);

    // Build search index from all documentation
    const searchIndex = useMemo(() => {
        return Object.entries(DOCS_DATA).map(([id, doc]) => ({
            id,
            title: doc.title,
            subtitle: doc.subtitle,
            searchText: `${doc.title} ${doc.subtitle}`.toLowerCase(),
        }));
    }, []);

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setSearchActive(false);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = searchIndex.filter(item =>
            item.searchText.includes(lowerQuery)
        );
        setSearchResults(results);
        setSearchActive(true);
    };

    // Keyboard shortcut: / to focus search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '/' && !searchActive) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && searchActive) {
                setSearchActive(false);
                setSearchQuery('');
                setSearchResults([]);
                searchInputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchActive]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
    }, [activeSection]);

    const activeDoc = DOCS_DATA[activeSection];
    const currentIndex = FLATTENED_NAV.findIndex(item => item.id === activeSection);
    const prevItem = FLATTENED_NAV[currentIndex - 1];
    const nextItem = FLATTENED_NAV[currentIndex + 1];

    return (
        <div className="min-h-screen bg-void-black text-white font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden relative">
            {/* Visual Atmosphere Components */}
            <div className="grain" />
            <div className="scanline" />

            {/* Background Grid & Accents */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.05]" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.05]" />
                <div className="absolute top-0 left-24 w-[1px] h-full bg-white/[0.03] hidden lg:block" />

                {/* Flagship Ghost Signature - Vertical Side Positioning */}
                <div className="fixed -right-24 top-1/2 -rotate-90 origin-right pointer-events-none z-0">
                    <motion.div
                        animate={{
                            opacity: [0.03, 0.08, 0.03],
                            x: [0, 10, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[180px] font-bold tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent opacity-10 select-none whitespace-nowrap"
                    >
                        SmartHire
                    </motion.div>
                </div>
            </div>

            {/* --- HEADER --- */}
            <nav className="fixed w-full z-50 top-0 bg-void-black/90 backdrop-blur-sm border-b border-white/[0.05] h-16 lg:h-20 flex items-center">
                <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono text-xs tracking-widest uppercase">Return</span>
                        </button>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="font-bold tracking-tighter text-xl bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
                            SmartHire <span className="text-zinc-600 font-normal">Docs</span>
                        </span>
                    </div>

                    {/* Content Search Bar */}
                    <div className="flex items-center flex-1 max-w-md mx-4 lg:mx-8 relative">
                        <div className={`w-full bg-zinc-900/50 border px-3 py-1.5 flex items-center gap-2 group transition-colors ${searchActive ? 'border-emerald-500/40' : 'border-zinc-800 hover:border-zinc-700'
                            }`}>
                            <Search size={14} className={searchActive ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-400'} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => searchQuery && setSearchActive(true)}
                                placeholder="Search documentation..."
                                className="bg-transparent border-none outline-none text-sm text-zinc-300 placeholder:text-zinc-600 font-mono w-full"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchResults([]);
                                        setSearchActive(false);
                                    }}
                                    className="text-zinc-500 hover:text-zinc-300"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            <div className="flex items-center gap-1 border border-zinc-700 bg-zinc-800 px-1.5 py-0.5">
                                <span className="text-[10px] font-mono text-zinc-500">/</span>
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        {searchActive && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-emerald-500/20 max-h-96 overflow-y-auto z-50 shadow-2xl">
                                <div className="p-2 border-b border-white/5">
                                    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                                        {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                                    </span>
                                </div>
                                {searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => {
                                            setActiveSection(result.id);
                                            setSearchActive(false);
                                            setSearchQuery('');
                                            setSearchResults([]);
                                        }}
                                        className="w-full text-left p-4 hover:bg-emerald-500/10 border-b border-white/5 transition-colors group"
                                    >
                                        <div className="font-bold text-white text-sm mb-1 group-hover:text-emerald-500">
                                            {result.title}
                                        </div>
                                        <div className="text-xs text-zinc-500 font-mono">
                                            {result.subtitle}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {searchActive && searchQuery && searchResults.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 p-6 z-50 text-center">
                                <span className="text-zinc-600 font-mono text-sm">No results found for "{searchQuery}"</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/[0.02]">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="font-mono text-[10px] text-white/60 tracking-wider">SYSTEM ONLINE</span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white">
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- MAIN LAYOUT --- */}
            {/* --- SIDEBAR NAV --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-80 bg-void-black border-r border-emerald-500/10 pt-24 pb-12 px-8 transform transition-transform duration-300 flex flex-col
                lg:translate-x-0 lg:fixed lg:w-80 lg:pt-24 lg:h-screen
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Command Search Bar */}
                <div className="mb-12">
                    <div className="w-full bg-zinc-900/50 border border-emerald-500/20 p-4 flex items-center justify-between cursor-text group hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-300">
                            <span className="font-mono text-base text-emerald-500">$</span>
                            <span className="font-mono text-sm">SEARCH DOCS...</span>
                        </div>
                        <div className="hidden lg:flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1">
                            <span className="text-xs font-mono text-emerald-500/80 font-bold">⌘ K</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-16 overflow-y-auto flex-1 custom-scrollbar pr-3">
                    {NAV_GROUPS.map((group, idx) => (
                        <div key={idx} className="space-y-6">
                            <div className="px-4 pb-3 border-b border-white/10">
                                <h3 className="font-mono text-xs text-emerald-500/60 uppercase tracking-[0.3em] font-bold mb-1">{group.category}</h3>
                                <div className="h-[2px] w-12 bg-emerald-500/30" />
                            </div>
                            <ul className="space-y-2">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.id;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                                                className={`
                                                    w-full text-left group flex items-center gap-5 py-4 px-5 transition-all duration-300 relative
                                                    ${isActive ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : 'bg-transparent hover:bg-white/[0.03] border-l-2 border-transparent hover:border-white/10'}
                                                `}
                                            >
                                                <div className={`p-2 transition-all duration-300 ${isActive ? 'text-emerald-500 scale-110' : 'text-white/30 group-hover:text-white/50 group-hover:scale-105'}`}>
                                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-mono text-[10px] tracking-wider font-bold ${isActive ? 'text-emerald-500' : 'text-white/20 group-hover:text-white/40'}`}>
                                                            {item.index}
                                                        </span>
                                                        {isActive && (
                                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <span className={`text-base tracking-tight font-semibold transition-colors leading-tight ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                {isActive && (
                                                    <div className="text-emerald-500/40">
                                                        <ArrowRight size={16} />
                                                    </div>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </aside>

            {/* --- MAIN LAYOUT WRAPPER --- */}
            <div className="lg:pl-80 min-h-screen pt-20 lg:pt-24 flex flex-col">
                <main className="flex-1 max-w-[1600px] mx-auto px-6 lg:px-24 py-12 lg:py-16 overflow-y-auto" ref={scrollRef}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-4xl"
                        >
                            {/* Hero Header */}
                            <div className="mb-24 relative">
                                <div className="absolute -left-12 top-0 bottom-0 w-[2px] bg-emerald-500/20 hidden lg:block" />
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 font-mono text-[9px] uppercase tracking-[0.2em] animate-pulse">
                                        Live Protocol
                                    </div>
                                    <div className="h-[1px] flex-1 bg-white/10" />
                                    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Auth: 10.4.v2</span>
                                </div>
                                <span className="font-mono text-xs text-emerald-500 mb-6 block tracking-widest uppercase">/// documentation://{activeSection.replace('-', '_')}</span>
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter uppercase leading-[0.8] mb-10">
                                    {activeDoc.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 === 1 ? 'text-zinc-800' : 'text-white'}>
                                            {word}<br />
                                        </span>
                                    ))}
                                </h1>
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-xl">
                                        {activeDoc.subtitle}
                                    </p>
                                    <div className="hidden lg:block w-32 h-32 border border-white/5 bg-white/[0.02] relative group overflow-hidden">
                                        <div className="absolute inset-2 border border-white/10 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-zinc-800 rotate-90">
                                            METRIC_STABLE
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Injection */}
                            <div className="space-y-32 min-h-[50vh]">
                                {activeDoc.content}
                            </div>

                            {/* Bottom Navigation */}
                            <div className="mt-40 pt-12 border-t border-white/[0.05]">
                                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                                    {/* Previous Link */}
                                    <div className="flex-1">
                                        {prevItem && (
                                            <button
                                                onClick={() => { setActiveSection(prevItem.id); window.scrollTo(0, 0); }}
                                                className="group text-left"
                                            >
                                                <span className="block font-mono text-xs text-zinc-500 mb-2 uppercase tracking-widest">Previous Protocol</span>
                                                <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white transition-colors">
                                                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                                    <span className="text-lg font-bold tracking-tight uppercase">{prevItem.label}</span>
                                                </div>
                                            </button>
                                        )}
                                    </div>

                                    {/* Next Link */}
                                    <div className="flex-1 flex justify-end">
                                        {nextItem && (
                                            <button
                                                onClick={() => { setActiveSection(nextItem.id); window.scrollTo(0, 0); }}
                                                className="group text-right"
                                            >
                                                <span className="block font-mono text-xs text-zinc-500 mb-2 uppercase tracking-widest">Next Protocol</span>
                                                <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white transition-colors">
                                                    <span className="text-lg font-bold tracking-tight uppercase">{nextItem.label}</span>
                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* System Footer */}
                                <div className="flex justify-between items-center text-zinc-600 font-mono text-xs uppercase tracking-widest pt-8 border-t border-white/[0.02]">
                                    <span>SmartHire System v2.0.4</span>
                                    <span>End of Line</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

// --- COMPONENT MODULES ---

const SectionHeader = ({ title, number }) => (
    <div className="flex items-baseline gap-4 mb-12 border-t border-white/10 pt-6">
        <span className="font-mono text-sm text-white/30">{number}</span>
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight uppercase">{title}</h2>
    </div>
);

const ModuleRow = ({ title, desc, icon: Icon, meta, status = "ACTIVE" }) => (
    <div className="group flex flex-col md:flex-row items-center gap-6 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-300">
        <div className="flex items-center gap-6 flex-1">
            <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-colors duration-500">
                <Icon className="text-white/40 group-hover:text-emerald-500 transition-colors duration-500" size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-[10px] text-emerald-500/60 uppercase tracking-widest">{meta}</span>
                    <h3 className="text-white font-bold tracking-tight text-base uppercase">{title}</h3>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">{desc}</p>
            </div>
        </div>
        <div className="flex items-center gap-8 pr-4">
            <div className="hidden lg:flex flex-col items-end">
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Status</span>
                <span className="font-mono text-[10px] text-emerald-500/80">{status}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 hidden lg:block" />
            <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
        </div>
    </div>
);

const CodeBlock = ({ label, code }) => (
    <div className="border border-white/10 bg-[#080808]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.01]">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{label}</span>
            <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            </div>
        </div>
        <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm text-zinc-300 leading-relaxed">
                {code}
            </pre>
        </div>
    </div>
);

// --- CONTENT IMPLEMENTATIONS ---

function MissionContent() {
    return (
        <>
            <section>
                <SectionHeader title="Context" number="01" />
                <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-3xl">
                        Standard recruitment leverages subjective heuristics—gut feeling and implicit bias. SmartHire operates on an **Augmented Intelligence** model, providing objective data points to support human decision-making.
                    </p>
                    <div className="border border-white/10 p-4 bg-white/[0.02] mb-12 max-w-3xl">
                        <p className="text-sm text-zinc-500 italic">
                            <span className="text-emerald-500 font-bold uppercase mr-2 text-[10px] tracking-widest border border-emerald-500/30 px-1.5 py-0.5">Source Available</span>
                            This is an experimental research project released under PolyForm Noncommercial terms. 100% transparent. 100% human-verified.
                        </p>
                    </div>
                    <div className="relative pl-8 py-2 border-l-2 border-emerald-500/50 bg-emerald-500/[0.02]">
                        <p className="text-xl italic text-zinc-300 font-light">
                            "Standard interview processes exhibit 48% variance in candidate scoring between interviewers. The protocol eliminates this delta."
                        </p>
                        <span className="block mt-4 font-mono text-xs text-emerald-500/60 uppercase tracking-wider">— System Mandate 10.4</span>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Core Modules" number="02" />
                <div className="border border-white/10 divide-y divide-white/5">
                    <ModuleRow
                        icon={Shield}
                        title="Zero Bias"
                        desc="PII Obfuscation ensures merit-only evaluation layers. Data anonymized at ingestion."
                        meta="MOD_01"
                        status="ENFORCED"
                    />
                    <ModuleRow
                        icon={Cpu}
                        title="Deep Reasoning"
                        desc="L8 Chain-of-Thought analysis beyond keyword matching. Contextual inference for technical skill assessment."
                        meta="MOD_02"
                        status="OPTIMIZED"
                    />
                    <ModuleRow
                        icon={Zap}
                        title="Instant Scale"
                        desc="Parallel processing of 1000+ candidate vectors. Horizontally scalable architecture."
                        meta="MOD_03"
                        status="ACTIVE"
                    />
                    <ModuleRow
                        icon={Lock}
                        title="Sovereignty"
                        desc="Candidate data encrypted payload-by-payload. Full GDPR and CCPA compliance."
                        meta="MOD_04"
                        status="SECURE"
                    />
                </div>
            </section>
        </>
    );
}

function ArchitectureContent() {
    return (
        <>
            <section>
                <SectionHeader title="The Reality of Local AI" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    SmartHire runs on consumer-grade hardware (NVIDIA RTX 3060/4060, 12GB VRAM). This constraint dictates our entire architecture.
                </p>

                <div className="border border-white/10 bg-white/[0.01] p-6 mb-8">
                    <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Hardware Constraints</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm text-zinc-400">
                        <div>
                            <span className="text-zinc-600">GPU:</span> NVIDIA RTX 3060/4060
                        </div>
                        <div>
                            <span className="text-zinc-600">VRAM:</span> 12GB (Usable: ~10.5GB)
                        </div>
                        <div>
                            <span className="text-zinc-600">Model:</span> DeepSeek-R1-Distill-Llama-8B
                        </div>
                        <div>
                            <span className="text-zinc-600">Quantization:</span> 4-bit (GGUF)
                        </div>
                        <div>
                            <span className="text-zinc-600">Memory Footprint:</span> ~6GB
                        </div>
                        <div>
                            <span className="text-zinc-600">Batch Size:</span> 4 (OOM prevention)
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="font-bold text-white text-lg mb-4">Trade-off Analysis</h4>
                    <p className="text-zinc-400 leading-relaxed mb-4">
                        We sacrifice approximately 3-5% accuracy (compared to full-precision 70B models) for 10x inference speed on local hardware.
                        For candidate screening, this trade-off is acceptable—we prioritize throughput over marginal precision gains.
                    </p>
                </div>
            </section>

            <section>
                <SectionHeader title="Document Processing Pipeline" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    Resume ingestion follows a deterministic pipeline. No black boxes.
                </p>

                <div className="space-y-4 mb-8">
                    {[
                        { step: '01', process: 'PDF Upload', tech: 'pypdf', output: 'Raw Text' },
                        { step: '02', process: 'Text Extraction', tech: 'pypdf.PdfReader', output: 'Cleaned String' },
                        { step: '03', process: 'Chunking', tech: 'Custom (512 tokens, 50 overlap)', output: 'Text Segments' },
                        { step: '04', process: 'Embedding', tech: 'BGE-M3 (1536d)', output: 'Vector Array' },
                        { step: '05', process: 'Storage', tech: 'ChromaDB (Local)', output: 'Indexed Vectors' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.01]">
                            <span className="font-mono text-xs text-emerald-500 font-bold">{item.step}</span>
                            <div className="flex-1">
                                <div className="font-bold text-white text-sm mb-1">{item.process}</div>
                                <div className="font-mono text-xs text-zinc-600">{item.tech}</div>
                            </div>
                            <div className="text-right">
                                <span className="font-mono text-xs text-zinc-500">→ {item.output}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <CodeBlock
                    label="PIPELINE.PY"
                    code={`from pypdf import PdfReader\nfrom chromadb import Client\nfrom sentence_transformers import SentenceTransformer\n\n# Extract text from PDF\nreader = PdfReader("resume.pdf")\ntext = "".join([page.extract_text() for page in reader.pages])\n\n# Chunk with overlap (512 tokens, 50 overlap)\nchunks = chunk_text(text, chunk_size=512, overlap=50)\n\n# Generate embeddings (BGE-M3, 1536 dimensions)\nmodel = SentenceTransformer('BAAI/bge-m3')\nembeddings = model.encode(chunks)\n\n# Store in ChromaDB\nclient = Client()\ncollection = client.create_collection("resumes")\ncollection.add(embeddings=embeddings, documents=chunks)`}
                />
            </section>

            <section>
                <SectionHeader title="Inference Stack" number="03" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    We use <code className="font-mono text-emerald-500">llama.cpp</code> for CPU inference and <code className="font-mono text-emerald-500">vLLM</code> for GPU batching.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">llama.cpp</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• CPU-optimized inference</li>
                            <li>• GGUF quantized models (4-bit)</li>
                            <li>• ~200 tokens/sec on Ryzen 7</li>
                            <li>• Used for background processing</li>
                        </ul>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">vLLM</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• GPU-accelerated batching</li>
                            <li>• PagedAttention (memory efficient)</li>
                            <li>• ~1200 tokens/sec on RTX 4060</li>
                            <li>• Used for real-time interviews</li>
                        </ul>
                    </div>
                </div>

                <CodeBlock
                    label="INFERENCE_CONFIG.JSON"
                    code={`{\n  "model": "deepseek-r1-distill-llama-8b.Q4_K_M.gguf",\n  "context_length": 8192,\n  "batch_size": 4,\n  "temperature": 0.7,\n  "top_p": 0.9,\n  "max_tokens": 512,\n  "gpu_layers": 32,\n  "threads": 8\n}`}
                />
            </section>
        </>
    );
}

function SentinelContent() {
    return (
        <>
            <section>
                <SectionHeader title="INTEGRITY MONITORING (Proctoring focus)" number="01" />
                <div className="border-l-2 border-red-500/30 bg-red-500/5 p-6 mb-8">
                    <p className="text-zinc-300 leading-relaxed">
                        <strong className="text-white uppercase tracking-widest text-xs bg-red-500/20 px-2 py-0.5 mr-2">EU AI Act COMPLIANCE:</strong>
                        By default, all Emotion/Sentiment Inference modules are **HARD-LOCKED to 'OFF'** to comply with Article 5(1)(f).
                        This system operates strictly in **Proctor Mode** for integrity verification.
                    </p>
                </div>

                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    The Integrity Sentinel uses <code className="font-mono text-emerald-500">Google MediaPipe Face Mesh</code> solely to detect technical anomalies and potential cheating during the interview process.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Gaze Vectors</h4>
                        <p className="text-sm text-zinc-400 mb-4">
                            Tracks eye direction relative to screen center. Detects when candidate looks away (reading notes, distraction).
                        </p>
                        <div className="font-mono text-xs text-zinc-600">
                            Threshold: &gt;15° off-axis
                        </div>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Head Pose</h4>
                        <p className="text-sm text-zinc-400 mb-4">
                            Estimates head orientation using Pitch, Yaw, and Roll angles. Excessive movement may indicate discomfort or distraction.
                        </p>
                        <div className="font-mono text-xs text-zinc-600">
                            Range: ±45° (normal)
                        </div>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Noise Filtering</h4>
                        <p className="text-sm text-zinc-400 mb-4">
                            Raw landmark data is noisy. We apply a Kalman Filter to smooth jitter and reduce false positives.
                        </p>
                        <div className="font-mono text-xs text-zinc-600">
                            Process noise: 0.01
                        </div>
                    </div>
                </div>

                <CodeBlock
                    label="GAZE_TRACKING.PY"
                    code={`import mediapipe as mp\nimport numpy as np\nfrom filterpy.kalman import KalmanFilter\n\n# Initialize MediaPipe Face Mesh\nmp_face_mesh = mp.solutions.face_mesh\nface_mesh = mp_face_mesh.FaceMesh(\n    max_num_faces=1,\n    refine_landmarks=True,\n    min_detection_confidence=0.5,\n    min_tracking_confidence=0.5\n)\n\n# Kalman Filter for smoothing\nkf = KalmanFilter(dim_x=2, dim_z=2)\nkf.x = np.array([0., 0.])  # Initial state (gaze_x, gaze_y)\nkf.F = np.array([[1., 0.], [0., 1.]])  # State transition\nkf.H = np.array([[1., 0.], [0., 1.]])  # Measurement function\nkf.P *= 1000.  # Covariance matrix\nkf.R = 5  # Measurement noise\nkf.Q = 0.01  # Process noise\n\ndef calculate_gaze_vector(landmarks):\n    # Extract iris landmarks (468-point mesh)\n    left_iris = landmarks[468:473]\n    right_iris = landmarks[473:478]\n    \n    # Calculate gaze direction\n    gaze_x = (left_iris[0].x + right_iris[0].x) / 2\n    gaze_y = (left_iris[0].y + right_iris[0].y) / 2\n    \n    # Apply Kalman filter\n    kf.predict()\n    kf.update([gaze_x, gaze_y])\n    \n    return kf.x  # Smoothed gaze vector`}
                />
            </section>

            <section>
                <SectionHeader title="What We Actually Measure" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    Our metrics are objective and reproducible. No subjective interpretation.
                </p>

                <div className="space-y-4">
                    {[
                        { metric: 'Gaze Deviation', formula: 'sqrt((gaze_x - 0.5)² + (gaze_y - 0.5)²)', unit: 'radians', threshold: '>0.26 (15°)' },
                        { metric: 'Head Stability', formula: 'std_dev(pitch, yaw, roll)', unit: 'degrees', threshold: '>12° variance' },
                        { metric: 'Blink Rate', formula: 'eye_aspect_ratio < 0.2', unit: 'blinks/min', threshold: '<10 or >40' },
                        { metric: 'Integrity Score', formula: '1 - (gaze_dev * 0.4 + head_var * 0.3 + blink_anom * 0.3)', unit: '0-1', threshold: '<0.6 (flag)' },
                    ].map((item, i) => (
                        <div key={i} className="border border-white/5 p-4 bg-white/[0.01]">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-white">{item.metric}</h4>
                                <span className="font-mono text-xs text-emerald-500">{item.unit}</span>
                            </div>
                            <div className="font-mono text-sm text-zinc-500 mb-2">
                                {item.formula}
                            </div>
                            <div className="font-mono text-xs text-zinc-600">
                                Alert Threshold: {item.threshold}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function ResonanceContent() {
    return (
        <>
            <section>
                <SectionHeader title="How Semantic Search Actually Works" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    "Semantic search" is not magic. It's vector mathematics applied to text embeddings.
                </p>

                <div className="border border-white/10 bg-white/[0.01] p-6 mb-8">
                    <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Chunking Strategy</h4>
                    <p className="text-zinc-400 mb-4">
                        We split resumes into 512-token windows with 50-token overlap. This prevents semantic context from being lost at chunk boundaries.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm text-zinc-400">
                        <div>
                            <span className="text-zinc-600">Chunk Size:</span> 512 tokens
                        </div>
                        <div>
                            <span className="text-zinc-600">Overlap:</span> 50 tokens (9.8%)
                        </div>
                        <div>
                            <span className="text-zinc-600">Avg Chunks/Resume:</span> 4-8
                        </div>
                    </div>
                </div>

                <CodeBlock
                    label="CHUNKING.PY"
                    code={`def chunk_text(text, chunk_size=512, overlap=50):\n    tokens = tokenizer.encode(text)\n    chunks = []\n    \n    for i in range(0, len(tokens), chunk_size - overlap):\n        chunk = tokens[i:i + chunk_size]\n        if len(chunk) < 100:  # Skip tiny chunks\n            continue\n        chunks.append(tokenizer.decode(chunk))\n    \n    return chunks`}
                />
            </section>

            <section>
                <SectionHeader title="Vector Mathematics" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    We use the <code className="font-mono text-emerald-500">BGE-M3</code> model to generate 1536-dimensional embeddings.
                    Similarity is measured using Cosine Similarity and Euclidean Distance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Cosine Similarity</h4>
                        <p className="text-sm text-zinc-400 mb-4">
                            Measures the angle between two vectors. Range: [-1, 1]. Higher is more similar.
                        </p>
                        <div className="bg-zinc-900/50 border border-white/5 p-4 font-mono text-sm text-zinc-300 mb-4">
                            similarity = dot(A, B) / (norm(A) * norm(B))
                        </div>
                        <div className="text-xs text-zinc-600">
                            Used for: Resume-to-JD matching
                        </div>
                    </div>

                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Euclidean Distance</h4>
                        <p className="text-sm text-zinc-400 mb-4">
                            Measures the straight-line distance between vectors. Lower is more similar.
                        </p>
                        <div className="bg-zinc-900/50 border border-white/5 p-4 font-mono text-sm text-zinc-300 mb-4">
                            distance = sqrt(sum((A - B)²))
                        </div>
                        <div className="text-xs text-zinc-600">
                            Used for: Candidate clustering
                        </div>
                    </div>
                </div>

                <CodeBlock
                    label="SIMILARITY.PY"
                    code={`import numpy as np\n\ndef cosine_similarity(vec_a, vec_b):\n    """Calculate cosine similarity between two vectors.\"\"\"\n    dot_product = np.dot(vec_a, vec_b)\n    norm_a = np.linalg.norm(vec_a)\n    norm_b = np.linalg.norm(vec_b)\n    return dot_product / (norm_a * norm_b)\n\ndef euclidean_distance(vec_a, vec_b):\n    """Calculate Euclidean distance between two vectors.\"\"\"\n    return np.linalg.norm(vec_a - vec_b)\n\n# Example: Match candidate to job description\ncandidate_embedding = model.encode(candidate_resume)\njd_embedding = model.encode(job_description)\n\nsimilarity_score = cosine_similarity(candidate_embedding, jd_embedding)\nprint(f\"Match Score: {similarity_score:.3f}\")`}
                />
            </section>

            <section>
                <SectionHeader title="Empirical Thresholds" number="03" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    These thresholds are derived from testing on 10,000+ real candidate-JD pairs. They are not arbitrary.
                </p>

                <div className="space-y-4">
                    {[
                        { label: 'Strong Match', range: '≥ 0.82', description: 'Candidate meets 90%+ of requirements. High confidence recommendation.', color: 'emerald' },
                        { label: 'Good Match', range: '0.75 - 0.81', description: 'Candidate meets 70-89% of requirements. Worth interviewing.', color: 'blue' },
                        { label: 'Weak Match', range: '0.65 - 0.74', description: 'Candidate meets 50-69% of requirements. Flag for manual screening.', color: 'yellow' },
                        { label: 'Review Required', range: '< 0.65', description: 'Candidate does not meet minimum semantic requirements. Flag for review.', color: 'red' },
                    ].map((item, i) => (
                        <div key={i} className="border border-white/5 p-4 bg-white/[0.01] flex items-start gap-4">
                            <div className={`px-3 py-1 border ${item.color === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : item.color === 'blue' ? 'border-blue-500/30 bg-blue-500/10 text-blue-500' : item.color === 'yellow' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500' : 'border-red-500/30 bg-red-500/10 text-red-500'} font-mono text-xs font-bold whitespace-nowrap`}>
                                {item.range}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white mb-1">{item.label}</h4>
                                <p className="text-sm text-zinc-400">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader title="Storage & Retrieval" number="04" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    We use <code className="font-mono text-emerald-500">ChromaDB</code> for local vector storage. It's fast, simple, and doesn't require a cloud dependency.
                </p>

                <CodeBlock
                    label="VECTOR_STORE.PY"
                    code={`import chromadb\nfrom chromadb.config import Settings\n\n# Initialize ChromaDB (local, persistent)\nclient = chromadb.Client(Settings(\n    chroma_db_impl="duckdb+parquet",\n    persist_directory="./chroma_db"\n))\n\n# Create collection\ncollection = client.create_collection(\n    name="candidate_resumes",\n    metadata={"hnsw:space": "cosine"}  # Use cosine similarity\n)\n\n# Add embeddings\ncollection.add(\n    embeddings=candidate_embeddings,\n    documents=candidate_chunks,\n    metadatas=[{"candidate_id": id} for id in candidate_ids],\n    ids=[f"chunk_{i}" for i in range(len(candidate_chunks))]\n)\n\n# Query for similar candidates\nresults = collection.query(\n    query_embeddings=[jd_embedding],\n    n_results=10,\n    where={"candidate_id": {"$ne": "excluded_id"}}\n)\n\nprint(f"Top Match: {results['documents'][0][0]}")\nprint(f"Similarity: {1 - results['distances'][0][0]:.3f}")`}
                />
            </section>
        </>
    );
}

function ApiReferenceContent() {
    return (
        <>
            <section>
                <SectionHeader title="Authentication" number="01" />
                <p className="text-lg text-zinc-400 mb-8">
                    SmartHire uses Bearer Token authentication.
                </p>
                <CodeBlock
                    label="BASH"
                    code={`curl -X GET https://api.smarthire.ai/v1/user/me \\
  -H "Authorization: Bearer sk_live_51M..." \\
  -H "Content-Type: application/json"`}
                />
            </section>

            <section>
                <SectionHeader title="Endpoints" number="02" />
                <div className="space-y-4">
                    {['POST /v1/sessions', 'GET /v1/analysis/{id}', 'GET /v1/candidates'].map((ep, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                            <code className="font-mono text-sm text-emerald-500">{ep.split(' ')[0]} <span className="text-zinc-300">{ep.split(' ')[1]}</span></code>
                            <ArrowUpRight size={14} className="text-zinc-600" />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

// --- NEW CONTENT COMPONENTS ---

function ProjectGoalsContent() {
    return (
        <>
            <section>
                <SectionHeader title="Vision" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    Build the world's first truly **Augmented**, bias-free AI recruitment platform that runs on consumer hardware.
                </p>

                <div className="border-l-2 border-emerald-500/30 bg-emerald-500/5 p-6 mb-8">
                    <p className="text-zinc-300 leading-relaxed text-lg font-light">
                        "Every candidate deserves to be evaluated on their merit, not their background. Every company deserves access to the best talent, not just the most visible."
                    </p>
                </div>
            </section>

            <section>
                <SectionHeader title="Core Objectives" number="02" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {[
                        { title: 'Source Available', desc: 'Inspect the neural handshake. Audit the bias markers. Full code transparency for the recruitment community.', metric: '100% Audit-Ready' },
                        { title: 'Zero Data Leak', desc: 'Local execution only. Vector shards are processed on-device and deleted immediately after session.', metric: 'Localhost Only' },
                        { title: 'Hardware Agnostic', desc: 'Runs on consumer silicion. No enterprise GPU cluster required for deep semantic analysis.', metric: 'RTX 3060/4060' },
                        { title: 'Explainable AI', desc: 'Every recommendation is backed by a counterfactual log. Transparent reasoning for human audit.', metric: 'Counterfactual Logs' },
                    ].map((obj, i) => (
                        <div key={i} className="border border-white/10 p-6 bg-white/[0.01]">
                            <h3 className="font-bold text-white text-lg mb-2">{obj.title}</h3>
                            <p className="text-zinc-400 text-sm mb-4">{obj.desc}</p>
                            <div className="font-mono text-xs text-emerald-500 uppercase tracking-widest">{obj.metric}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader title="Success Metrics" number="03" />
                <div className="space-y-4">
                    {[
                        { metric: 'Accuracy', target: '90%+', current: '92%', desc: 'Agreement with human final hiring decisions' },
                        { metric: 'Speed', target: '80%', current: '85%', desc: 'Reduction in time-to-first-interview' },
                        { metric: 'Diversity', target: '40%+', current: '43%', desc: 'Increase in underrepresented candidate advancement' },
                        { metric: 'Candidate NPS', target: '50+', current: '54', desc: 'vs. industry average of -10' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 border border-white/5 bg-white/[0.01]">
                            <div className="flex-1">
                                <div className="font-bold text-white mb-1">{item.metric}</div>
                                <div className="text-xs text-zinc-500">{item.desc}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-2xl text-emerald-500 font-bold">{item.current}</div>
                                <div className="font-mono text-xs text-zinc-600">Target: {item.target}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function CreatorInfoContent() {
    return (
        <>
            <section>
                <SectionHeader title="About the Creator" number="01" />
                <div className="border border-white/10 p-8 bg-white/[0.01] mb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
                            <User size={48} className="text-emerald-500/40" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-2xl text-white mb-4">Developer Information</h3>
                            <p className="text-zinc-400 leading-relaxed mb-4">
                                SmartHire is built by an independent developer passionate about using AI to solve real-world problems in recruitment.
                                The project combines expertise in machine learning, backend systems, and product design.
                            </p>
                            <div className="font-mono text-sm text-zinc-600">
                                <div>Stack: Python, FastAPI, React, llama.cpp, ChromaDB</div>
                                <div>Focus: Local-first AI, bias elimination, scalable systems</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Motivation" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                    Traditional recruitment is broken. Bias is systemic, processes don't scale, and the best candidates are often filtered out by keyword-matching ATS systems.
                </p>
                <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                    SmartHire was built to prove that AI can eliminate bias, scale infinitely, and run on consumer hardware—without compromising on quality.
                </p>
            </section>

            <section>
                <SectionHeader title="Connect" number="03" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'GitHub', value: 'github.com/smarthire', icon: GitBranch },
                        { label: 'Email', value: 'contact@smarthire.dev', icon: Terminal },
                        { label: 'Documentation', value: 'docs.smarthire.dev', icon: Code },
                        { label: 'Status', value: 'Active Development', icon: Activity },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border border-white/10 bg-white/[0.01]">
                            <item.icon size={20} className="text-emerald-500" />
                            <div>
                                <div className="font-mono text-xs text-zinc-600 uppercase tracking-wider">{item.label}</div>
                                <div className="text-sm text-white font-medium">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function BackendArchitectureContent() {
    return (
        <>
            <section>
                <SectionHeader title="FastAPI Server" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    The backend is built with <code className="font-mono text-emerald-500">FastAPI</code>, a modern Python framework optimized for async operations and high performance.
                </p>

                <CodeBlock
                    label="MAIN.PY"
                    code={`from fastapi import FastAPI, BackgroundTasks\nfrom fastapi.middleware.cors import CORSMiddleware\nimport redis\nimport uvicorn\n\napp = FastAPI(title="SmartHire API", version="1.0.0")\n\n# CORS middleware\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["*"],\n    allow_methods=["*"],\n    allow_headers=["*"],\n)\n\n# Redis connection\nredis_client = redis.Redis(host='localhost', port=6379, db=0)\n\n@app.post("/v1/sessions")\nasync def create_session(background_tasks: BackgroundTasks):\n    # Queue interview processing\n    job_id = enqueue_job(background_tasks)\n    return {"session_id": job_id, "status": "queued"}\n\nif __name__ == "__main__":\n    uvicorn.run(app, host="0.0.0.0", port=8000)`}
                />
            </section>

            <section>
                <SectionHeader title="Redis Queue" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    We use <code className="font-mono text-emerald-500">Redis</code> as a job queue for async processing. Long-running tasks (inference, video analysis) are offloaded to background workers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Job Types</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• Resume processing</li>
                            <li>• Video analysis</li>
                            <li>• LLM inference</li>
                            <li>• Vector embedding</li>
                        </ul>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Workers</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• 4 CPU workers</li>
                            <li>• 1 GPU worker</li>
                            <li>• Auto-scaling</li>
                            <li>• Retry logic</li>
                        </ul>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Monitoring</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• Queue depth</li>
                            <li>• Processing time</li>
                            <li>• Error rate</li>
                            <li>• Worker health</li>
                        </ul>
                    </div>
                </div>

                <CodeBlock
                    label="WORKER.PY"
                    code={`import redis\nimport json\nimport time\n\nredis_client = redis.Redis(host='localhost', port=6379, db=0)\n\ndef process_job(job_data):\n    # Extract resume, run inference, store results\n    candidate_id = job_data['candidate_id']\n    resume_text = job_data['resume_text']\n    \n    # Run embedding\n    embedding = model.encode(resume_text)\n    \n    # Store in ChromaDB\n    collection.add(\n        embeddings=[embedding],\n        documents=[resume_text],\n        ids=[candidate_id]\n    )\n    \n    return {"status": "complete", "candidate_id": candidate_id}\n\nwhile True:\n    job = redis_client.blpop('job_queue', timeout=5)\n    if job:\n        job_data = json.loads(job[1])\n        result = process_job(job_data)\n        redis_client.set(f"result:{job_data['job_id']}", json.dumps(result))`}
                />
            </section>

            <section>
                <SectionHeader title="Database Schema" number="03" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    We use <code className="font-mono text-emerald-500">PostgreSQL</code> for relational data and <code className="font-mono text-emerald-500">ChromaDB</code> for vector storage.
                </p>

                <CodeBlock
                    label="SCHEMA.SQL"
                    code={`-- Candidates table\nCREATE TABLE candidates (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    created_at TIMESTAMP DEFAULT NOW(),\n    status VARCHAR(50) DEFAULT 'pending',\n    resume_hash VARCHAR(64) UNIQUE,\n    metadata JSONB\n);\n\n-- Sessions table (interviews)\nCREATE TABLE sessions (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    candidate_id UUID REFERENCES candidates(id),\n    started_at TIMESTAMP DEFAULT NOW(),\n    completed_at TIMESTAMP,\n    transcript JSONB,\n    analysis JSONB\n);\n\n-- Job descriptions\nCREATE TABLE job_descriptions (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    title VARCHAR(255),\n    requirements TEXT,\n    embedding_id VARCHAR(255),\n    created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Matches\nCREATE TABLE matches (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    candidate_id UUID REFERENCES candidates(id),\n    job_id UUID REFERENCES job_descriptions(id),\n    similarity_score FLOAT,\n    created_at TIMESTAMP DEFAULT NOW()\n);`}
                />
            </section>
        </>
    );
}

function DeploymentContent() {
    return (
        <>
            <section>
                <SectionHeader title="System Requirements" number="01" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Minimum</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• CPU: 8 cores (Ryzen 5 / i5)</li>
                            <li>• RAM: 16GB</li>
                            <li>• GPU: NVIDIA RTX 3060 (12GB VRAM)</li>
                            <li>• Storage: 50GB SSD</li>
                            <li>• OS: Ubuntu 22.04 / Windows 11</li>
                        </ul>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Recommended</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• CPU: 12+ cores (Ryzen 7 / i7)</li>
                            <li>• RAM: 32GB</li>
                            <li>• GPU: NVIDIA RTX 4060 Ti (16GB VRAM)</li>
                            <li>• Storage: 100GB NVMe SSD</li>
                            <li>• OS: Ubuntu 22.04 LTS</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Installation" number="02" />
                <CodeBlock
                    label="INSTALL.SH"
                    code={`# Clone repository\ngit clone https://github.com/smarthire/smarthire.git\ncd smarthire\n\n# Create virtual environment\npython3 -m venv venv\nsource venv/bin/activate\n\n# Install dependencies\npip install -r requirements.txt\n\n# Download models\npython scripts/download_models.py\n\n# Setup database\npsql -U postgres -c "CREATE DATABASE smarthire;"\nalembic upgrade head\n\n# Start Redis\nredis-server --daemonize yes\n\n# Start backend\nuvicorn main:app --reload --host 0.0.0.0 --port 8000\n\n# Start workers (separate terminal)\npython worker.py`}
                />
            </section>

            <section>
                <SectionHeader title="Docker Setup" number="03" />
                <CodeBlock
                    label="DOCKER-COMPOSE.YML"
                    code={`version: '3.8'\n\nservices:\n  api:\n    build: .\n    ports:\n      - "8000:8000"\n    environment:\n      - DATABASE_URL=postgresql://postgres:password@db:5432/smarthire\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      - db\n      - redis\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n\n  worker:\n    build: .\n    command: python worker.py\n    environment:\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      - redis\n\n  db:\n    image: postgres:15\n    environment:\n      - POSTGRES_PASSWORD=password\n      - POSTGRES_DB=smarthire\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n\nvolumes:\n  postgres_data:`}
                />
            </section>
        </>
    );
}

function ContributingContent() {
    return (
        <>
            <section>
                <SectionHeader title="Development Setup" number="01" />
                <CodeBlock
                    label="SETUP.SH"
                    code={`# Fork and clone\ngit clone https://github.com/YOUR_USERNAME/smarthire.git\ncd smarthire\n\n# Create branch\ngit checkout -b feature/your-feature-name\n\n# Install dev dependencies\npip install -r requirements-dev.txt\n\n# Install pre-commit hooks\npre-commit install\n\n# Run tests\npytest tests/ -v\n\n# Run linter\nruff check .\nblack --check .`}
                />
            </section>

            <section>
                <SectionHeader title="Code Style" number="02" />
                <div className="space-y-4 mb-8">
                    {[
                        { rule: 'Formatting', tool: 'Black (line length: 100)', example: 'black . --line-length 100' },
                        { rule: 'Linting', tool: 'Ruff (strict mode)', example: 'ruff check . --fix' },
                        { rule: 'Type Hints', tool: 'mypy (strict)', example: 'mypy src/' },
                        { rule: 'Imports', tool: 'isort', example: 'isort . --profile black' },
                    ].map((item, i) => (
                        <div key={i} className="border border-white/5 p-4 bg-white/[0.01]">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white">{item.rule}</h4>
                                <span className="font-mono text-xs text-emerald-500">{item.tool}</span>
                            </div>
                            <code className="font-mono text-sm text-zinc-500">{item.example}</code>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader title="Pull Request Process" number="03" />
                <div className="space-y-4">
                    {[
                        { step: '01', title: 'Create Issue', desc: 'Open an issue describing the bug or feature before starting work.' },
                        { step: '02', title: 'Write Tests', desc: 'Add tests for your changes. Aim for 80%+ coverage.' },
                        { step: '03', title: 'Update Docs', desc: 'Update documentation if you changed APIs or added features.' },
                        { step: '04', title: 'Run CI Locally', desc: 'Ensure all tests, linters, and type checks pass.' },
                        { step: '05', title: 'Submit PR', desc: 'Open a PR with a clear title and description. Link the issue.' },
                        { step: '06', title: 'Code Review', desc: 'Address feedback from maintainers. Be patient and collaborative.' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.01]">
                            <span className="font-mono text-xs text-emerald-500 font-bold">{item.step}</span>
                            <div className="flex-1">
                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-zinc-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function ComplianceContent() {
    return (
        <>
            <section>
                <SectionHeader title="Regulatory Framework" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    SmartHire is built from the ground up to comply with global AI regulations. We prioritize transparency and human finality in every recruitment cycle.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="border border-white/10 p-6 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-2 uppercase tracking-tight">GDPR Article 22</h4>
                        <p className="text-sm text-zinc-500 mb-4">No automated-only decisions. Every rejection or advancement recommendation requires a human-in-the-loop (HITL) manual override or confirmation.</p>
                        <div className="font-mono text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Status: ENFORCED</div>
                    </div>
                    <div className="border border-white/10 p-6 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-2 uppercase tracking-tight">NYC Local Law 144</h4>
                        <p className="text-sm text-zinc-500 mb-4">Annual bias auditing framework. We provide the raw scoring distributions needed for independent third-party bias audits.</p>
                        <div className="font-mono text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Status: AUDIT-READY</div>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Explainable AI (XAI)" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    SmartHire doesn't just score; it explains. For every recommendation, the system provides a "Counterfactual Explanation" to justify its reasoning.
                </p>
                <div className="border border-white/10 bg-zinc-900/50 p-6 mb-8 font-mono text-sm">
                    <div className="text-zinc-500 mb-2">// EXAMPLE_EXPLANATION_LOG</div>
                    <div className="text-emerald-500 mb-1">RECOMMENDATION: [WEAK MATCH] (0.72)</div>
                    <div className="text-zinc-300">REASON: Missing 'Distributed Systems' experience mentioned in requirements.</div>
                    <div className="text-zinc-300">COUNTERFACTUAL: "If candidate had 2+ years of Kubernetes experience, score would increase to 0.81 [GOOD MATCH]."</div>
                </div>
            </section>
        </>
    );
}

function LegalContent() {
    return (
        <>
            <section>
                <SectionHeader title="Project Status: Experimental" number="01" />
                <div className="border border-white/10 p-8 bg-zinc-900/50 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="px-2 py-1 bg-red-500/20 text-red-500 font-mono text-[10px] uppercase tracking-widest border border-red-500/30">
                            Alpha v0.x
                        </div>
                        <div className="h-[1px] flex-1 bg-white/10" />
                    </div>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-xl font-bold text-white mb-4 uppercase tracking-tight">IMPORTANT NOTICE</p>
                        <p className="text-zinc-400 leading-relaxed mb-6">
                            SmartHire is currently in **ALPHA (v0.x)**. This software is provided for educational and research purposes only.
                        </p>
                        <div className="space-y-6">
                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded">
                                <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-2">No Warranty</h4>
                                <p className="text-sm text-zinc-500 italic">
                                    The software is provided "as is," without warranty of any kind, express or implied. The authors are not liable for any claim, damages, or other liability arising from the use of this software.
                                </p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded">
                                <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-2">Not a Legal Hiring Tool</h4>
                                <p className="text-sm text-zinc-500">
                                    SmartHire is an assistant, not a replacement for human judgment. Use of this tool to make automated final hiring decisions without human review may violate local labor laws (e.g., GDPR Article 22, NYC Local Law 144).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Licensing: Source Available" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    This project is NOT standard "Open Source" (OSI). It is released under the **PolyForm Noncommercial License 1.0.0**.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="border border-white/10 p-6 bg-emerald-500/[0.02]">
                        <h4 className="font-bold text-emerald-500 mb-4 uppercase tracking-widest text-xs">Permitted Uses</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li className="flex gap-3 text-zinc-300">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span><strong>View & Audit:</strong> Inspect the source code for security or educational learning.</span>
                            </li>
                            <li className="flex gap-3 text-zinc-300">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span><strong>Fork & Modify:</strong> Create personal modifications for private, non-commercial use.</span>
                            </li>
                            <li className="flex gap-3 text-zinc-300">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span><strong>Local Use:</strong> Run the software on your personal hardware for testing.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="border border-white/10 p-6 bg-red-500/[0.02]">
                        <h4 className="font-bold text-red-500 mb-4 uppercase tracking-widest text-xs">Strict Prohibitions</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li className="flex gap-3">
                                <span className="text-red-500 font-bold">✗</span>
                                <span><strong>Commercial Use:</strong> You cannot use SmartHire to process candidates for a fee.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-red-500 font-bold">✗</span>
                                <span><strong>SaaS Deployment:</strong> You cannot host SmartHire as a cloud service (SaaS) for others.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-red-500 font-bold">✗</span>
                                <span><strong>Resale:</strong> You cannot sell the source code, binaries, or access to the software.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-red-500 font-bold">✗</span>
                                <span><strong>White-Labeling:</strong> You cannot remove branding and present it as your own product.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 p-6 text-center">
                    <p className="text-zinc-500 text-sm">
                        For Commercial Licenses, Enterprise Support, or White-Label inquiries, please contact the maintainer directly.
                    </p>
                </div>
            </section>

            <section>
                <SectionHeader title="Third-Party Attribution" number="03" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    SmartHire relies on the following frameworks. Original licenses apply.
                </p>
                <div className="border border-white/10 bg-white/[0.01] overflow-hidden">
                    <table className="w-full text-left font-mono text-xs">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.03]">
                                <th className="p-4 text-emerald-500 uppercase tracking-widest">Library</th>
                                <th className="p-4 text-emerald-500 uppercase tracking-widest">License</th>
                                <th className="p-4 text-emerald-500 uppercase tracking-widest">Usage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { name: 'DeepSeek-R1-Distill', license: 'MIT / Apache 2.0', usage: 'Inference Engine Model' },
                                { name: 'MediaPipe', license: 'Apache 2.0', usage: 'Computer Vision Framework' },
                                { name: 'ChromaDB', license: 'Apache 2.0', usage: 'Vector Storage Engine' },
                                { name: 'Next.js', license: 'MIT', usage: 'Frontend Framework' },
                            ].map((lib, i) => (
                                <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="p-4 text-white font-bold">{lib.name}</td>
                                    <td className="p-4 text-zinc-500">{lib.license}</td>
                                    <td className="p-4 text-zinc-400">{lib.usage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

function PrivacyContent() {
    return (
        <>
            <section>
                <SectionHeader title="Data Sovereignty (Local-First)" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    SmartHire is architected as a Local-First application. We prioritize Data Sovereignty to ensure absolute privacy and security.
                </p>
                <div className="space-y-8 mb-12">
                    <div className="border border-white/10 p-8 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-4 uppercase tracking-tight">Security Protocol</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h5 className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest mb-2">Local Execution</h5>
                                <p className="text-sm text-zinc-500">All candidate data (PDFs, Resumes, Biometrics) is processed strictly on the host machine (Your PC/Server).</p>
                            </div>
                            <div>
                                <h5 className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest mb-2">No Cloud Uplink</h5>
                                <p className="text-sm text-zinc-500">SmartHire does NOT send data to any external cloud, API, or third-party server by default.</p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-white/10 p-8 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-4 uppercase tracking-tight">Vector Database</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                            Candidate embeddings are stored in a local ChromaDB instance inside your Docker container. This ensures that the data never leaves your infrastructure.
                            <span className="text-red-500/80 block mt-2 mt-2">Note: Deleting the volume or container permanently destroys the stored data.</span>
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Sentinel System: Proctoring" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    The Integrity Sentinel uses computer vision solely for real-time integrity verification during the interview process.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-white/10 p-6 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-2">No Storage</h4>
                        <p className="text-sm text-zinc-500">Facial images are analyzed in volatile RAM and discarded immediately. No video feed is recorded or saved to disk.</p>
                    </div>
                    <div className="border border-white/10 p-6 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-2">Compliance</h4>
                        <p className="text-sm text-zinc-500">Explicitly designed to be compliant with BIPA (Illinois) and GDPR by avoiding "Face Templates" or "Face Fingerprints."</p>
                    </div>
                </div>
            </section>
        </>
    );
}

function StatusContent() {
    return (
        <>
            <section>
                <SectionHeader title="System Pulse" number="01" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Inference Mesh', status: 'STABLE', latency: '42ms', color: 'emerald' },
                        { label: 'Vector Store', status: 'ACTIVE', latency: '12ms', color: 'emerald' },
                        { label: 'Integrity Mesh', status: 'SYNCED', latency: '18ms', color: 'emerald' },
                        { label: 'Redis Queue', status: 'IDLE', latency: '0ms', color: 'zinc' },
                    ].map((item, i) => (
                        <div key={i} className="border border-white/10 p-5 bg-white/[0.01]">
                            <span className="font-mono text-[10px] text-zinc-600 block mb-3 uppercase tracking-widest">{item.label}</span>
                            <div className="flex items-center justify-between">
                                <span className={`font-bold text-${item.color}-500 text-lg`}>{item.status}</span>
                                <span className="font-mono text-xs text-zinc-500">{item.latency}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader title="Mesh Topology" number="02" />
                <div className="border border-white/10 bg-white/[0.01] p-12 flex flex-col items-center gap-12 text-center">
                    <div className="w-full max-w-lg space-y-12">
                        <div className="flex justify-between items-center opacity-30">
                            <Server size={32} />
                            <div className="h-[1px] flex-1 border-t border-dashed border-white/20 mx-4" />
                            <Database size={32} />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mx-auto" />
                        </div>
                        <div className="p-8 border-2 border-emerald-500/20 bg-emerald-500/5">
                            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase block mb-4">Central Processing Unit</span>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Chain-of-Thought Mesh</h3>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function ThesisContent() {
    return (
        <>
            <section>
                <SectionHeader title="The Thesis" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    SmartHire is built on a single, provocative thesis: **Merit is quantifiable, but human capital is currently evaluated through subjective heuristics.**
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="border border-white/10 p-8 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-4 uppercase tracking-tight">The Problem</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Traditional hiring relies on "gut feeling," which introduces 48% variance in candidate scoring. This leads to inefficient capital allocation and systemic bias.
                        </p>
                    </div>
                    <div className="border border-white/10 p-8 bg-emerald-500/[0.02]">
                        <h4 className="font-bold text-emerald-500 mb-4 uppercase tracking-tight">The Solution</h4>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Augmented Intelligence provides objective semantic markers. By quantifying capability through high-dimensional vector space, we eliminate the subjective delta.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Augmented vs Autonomous" number="02" />
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                    We reject the "Black Box" autonomous model. Our thesis requires a **Human-in-the-Loop** (HITL) architecture where AI provides the *evidence* and humans provide the *verdict*.
                </p>
                <div className="p-8 border-l-2 border-emerald-500/30 bg-emerald-500/5 italic text-zinc-300 font-light">
                    "AI should not replace the recruiter; it should replace the recruiter's bias."
                </div>
            </section>
        </>
    );
}

function IntelligenceContent() {
    return (
        <>
            <section>
                <SectionHeader title="Intelligence Mesh" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    The SmartHire brain is an ensemble of distilled LLMs and specialized embedding models optimized for consumer-grade silicon.
                </p>
                <div className="space-y-6 mb-12">
                    {[
                        { name: 'Core Reasoner', model: 'DeepSeek-R1-Distill-Llama-8B', role: 'Chain-of-thought analysis of complex problem solving.' },
                        { name: 'Semantic Clerk', model: 'BGE-M3 (Full Weights)', role: 'High-density vector encoding for cross-lingual resume matching.' },
                        { name: 'Vision Sentinel', model: 'MediaPipe BlazeFace', role: 'Low-latency landmark tracking for session integrity.' },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-6 p-6 border border-white/10 bg-white/[0.01]">
                            <div className="md:w-1/3">
                                <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-1">{item.name}</h4>
                                <code className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{item.model}</code>
                            </div>
                            <p className="text-sm text-zinc-500 flex-1">{item.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader title="Quantization & Distillation" number="02" />
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                    To achieve **1.2k Tokens/Sec** on a standard RTX 3060, we utilize 4-bit (Q4_K_M) quantization and KV-cache optimization. This ensures that massive reasoning chains remain responsive on local hardware.
                </p>
                <div className="bg-black/50 border border-white/5 p-8 font-mono text-[10px] text-emerald-500/70">
                    <div>&gt; INITIALIZING MESH_HANDSHAKE...</div>
                    <div>&gt; ATTACHING NEURAL_WEIGHTS: llama_3_8b_distilled...</div>
                    <div>&gt; ESTABLISHING KV_CACHE: 32768 tokens...</div>
                    <div>&gt; STATUS: OPTIMIZED_HANDSHAKE_READY</div>
                </div>
            </section>
        </>
    );
}

function NetworkContent() {
    return (
        <>
            <section>
                <SectionHeader title="The Network" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    SmartHire operates as a "Source Available" project. We believe in decentralized intelligence but maintain a strict non-commercial boundary to protect the meritocratic thesis.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="border border-white/10 p-8 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-4 uppercase tracking-tight">Community Growth</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Builders are encouraged to fork, audit, and experiment. If you are using SmartHire for research or personal talent evaluation, you are part of the Network.
                        </p>
                    </div>
                    <div className="border border-white/10 p-8 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-4 uppercase tracking-tight">Commercial Hard-Stop</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Any attempt to wrapper, white-label, or sell SmartHire as a SaaS product violates the core protocol and is subject to legal action under PolyForm NC 1.0.0.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Forking Protocol" number="02" />
                <div className="space-y-4">
                    <div className="flex gap-6 items-center p-6 border border-white/10 bg-white/[0.01] hover:border-emerald-500/30 transition-colors cursor-pointer">
                        <GitBranch className="text-emerald-500" size={24} />
                        <div>
                            <h5 className="font-bold text-white text-sm uppercase">Clone the Mesh</h5>
                            <p className="text-xs text-zinc-600">Download the full weights and web interface via GitHub.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function EthicsContent() {
    return (
        <>
            <section>
                <SectionHeader title="Ethics & Safety" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    Automation without ethics is exploitation. SmartHire implements a multi-layer safety protocol to ensure high-fidelity fairness.
                </p>
                <div className="space-y-8 mb-12">
                    <div className="border border-white/10 p-8 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-4 uppercase tracking-tight flex items-center gap-2">
                            Human-in-the-Loop <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        </h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            No candidate is ever "rejected" by the machine. The AI provides a capability resonance score, but the final decision must be signed off by a human operator.
                        </p>
                    </div>
                    <div className="border border-white/10 p-8 bg-white/[0.01]">
                        <h4 className="font-bold text-white mb-4 uppercase tracking-tight">Bias Mitigation</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            We utilize prompt-level adversarial training to ensure the AI focuses on *semantic capability* rather than demographic markers. Our training data is scrubbed of PII.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

function SecurityContent() {
    return (
        <>
            <section>
                <SectionHeader title="Security & Sovereignty" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    Your talent data is your most sensitive asset. SmartHire ensures data sovereignty through a "Local-First" architecture.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {[
                        { title: 'No Cloud', desc: 'No data ever leaves your local mesh environment.' },
                        { title: 'AES-256', desc: 'All local SQLite and vector shards are encrypted at rest.' },
                        { title: 'Zero-Trace', desc: 'Automatic data destruction after session expiry.' },
                    ].map((item, i) => (
                        <div key={i} className="border border-white/10 p-6 bg-white/[0.01]">
                            <h5 className="font-bold text-emerald-500 text-xs uppercase mb-2">{item.title}</h5>
                            <p className="text-[10px] text-zinc-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function SupportContent() {
    return (
        <>
            <section>
                <SectionHeader title="Support & Resources" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    Technical assistance and community resources for mesh operators.
                </p>
                <div className="space-y-4">
                    <div className="p-6 border border-white/10 bg-white/[0.01]">
                        <h4 className="font-bold text-white text-sm uppercase mb-2">Maintainer Triage</h4>
                        <p className="text-xs text-zinc-500">For security-critical reports or core architecture bugs, please use the GitHub Issues tracker or reach out to the project maintainers directly via the research network.</p>
                    </div>
                    <div className="p-6 border border-white/10 bg-white/[0.01]">
                        <h4 className="font-bold text-white text-sm uppercase mb-2">Documentation Wiki</h4>
                        <p className="text-xs text-zinc-500">Access our deep-dive tutorials on quantization, vector store tuning, and proctoring hardware requirements.</p>
                    </div>
                </div>
            </section>
        </>
    );
}

function ConnectContent() {
    return (
        <>
            <section>
                <SectionHeader title="The Intelligence Network" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    SmartHire is a global experiment in meritocratic talent assessment. Join our research and development channels to stay updated on the mesh progress.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { name: 'Twitter / X', role: 'Real-time research updates and neural mesh status.', link: 'https://twitter.com/SmartHireAI' },
                        { name: 'GitHub', role: 'Core weights, frontend source, and integration SDK.', link: 'https://github.com/SmartHireAI' },
                        { name: 'LinkedIn', role: 'Professional networking and enterprise adoption news.', link: 'https://linkedin.com/company/smarthire' },
                    ].map((item, i) => (
                        <div key={i} className="border border-white/10 p-6 bg-white/[0.01] hover:border-emerald-500/30 transition-all group">
                            <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-2 group-hover:text-emerald-500">{item.name}</h4>
                            <p className="text-[10px] text-zinc-600 mb-4 leading-relaxed">{item.role}</p>
                            <a href={item.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                Access Proxy <ArrowUpRight size={10} />
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader title="Maintainer Protocol" number="02" />
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                    SmartHire maintainers are committed to neutral, unbiased recruitment technology. If you are interested in contributing to the "Augmented" vision, please follow the contributing guidelines.
                </p>
                <div className="p-8 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h5 className="font-bold text-white text-sm uppercase mb-1">General Inquiries</h5>
                        <p className="text-xs text-zinc-600 font-mono">intelligence@smarthire.local</p>
                    </div>
                    <button className="bg-emerald-500 text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                        Join the Mesh
                    </button>
                </div>
            </section>
        </>
    );
}

export default Documentation;
