import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Cpu, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();


    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen relative bg-[#000000] selection:bg-white selection:text-black font-sans overflow-x-hidden">
            {/* Visual Atmosphere: Documentation Grid Unification */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.05]" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.05]" />
                <div className="absolute top-0 left-24 w-[1px] h-full bg-white/[0.02] hidden lg:block" />
            </div>

            <div className="noise-overlay" />

            {/* Ultra-Minimal Nav */}
            <nav className="fixed w-full z-50 top-0 border-b border-white/[0.08] backdrop-blur-xl bg-black/50">
                <div className="container-l h-20 flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <motion.div
                            onClick={() => navigate('/')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl font-bold tracking-tighter cursor-pointer flex items-center gap-2 bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent"
                        >
                            SmartHire
                        </motion.div>
                        <div className="hidden md:flex gap-8 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                            <span onClick={() => navigate('/docs#neural-architecture')} className="hover:text-white cursor-pointer transition-colors duration-300">Technology</span>
                            <span onClick={() => navigate('/docs#compliance')} className="hover:text-white cursor-pointer transition-colors duration-300">Enterprise</span>
                            <span onClick={() => navigate('/docs#sentinel')} className="hover:text-white cursor-pointer transition-colors duration-300">Research</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <span onClick={() => navigate('/docs')} className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] hidden sm:block hover:text-white cursor-pointer transition-colors duration-300">Support</span>
                        <button
                            onClick={() => navigate('/redirect')}
                            className="bg-white text-black px-6 py-2 text-xs font-bold rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-48 pb-32 border-b border-white/[0.08]">
                <div className="container-l relative">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="max-w-5xl"
                    >
                        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">System Active v4.2</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-7xl md:text-9xl mb-8 font-bold tracking-tighter leading-none relative font-sans"
                        >
                            <motion.span
                                className="bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent"
                                animate={{ opacity: [1, 0.8, 1] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                Augmented
                            </motion.span>
                            <br />
                            <span className="text-zinc-700">Recruitment.</span>

                            {/* Decorative Brand Highlight */}
                            <motion.div
                                animate={{ opacity: [0.03, 0.08, 0.03] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-[120px] rounded-full pointer-events-none"
                            />
                        </motion.h1>

                        <div className="flex flex-col md:flex-row gap-12 mt-16 items-start">
                            <motion.p variants={fadeInUp} className="text-xl text-text-secondary font-light leading-relaxed max-w-xl">
                                SmartHire replaces subjective hiring with 8-layer cognitive chains, real-time proctoring mesh, and bias-free semantic capability analysis.
                            </motion.p>
                        </div>

                        <motion.div variants={fadeInUp} className="flex gap-6 mt-16">
                            <button onClick={() => navigate('/redirect')} className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:px-10 transition-all duration-300 cursor-pointer group">
                                Deploy Engine <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => navigate('/docs')} className="px-8 py-4 rounded-full border border-white/20 bg-white/10 text-white font-bold text-sm hover:bg-white/20 active:scale-95 transition-all duration-300 cursor-pointer">
                                View Documentation
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Flagship Ghost Signature - Right Side Horizontal */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none pr-4">
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.5, 0.3],
                                x: [0, 10, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="text-8xl md:text-[140px] lg:text-[200px] font-bold tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent"
                        >
                            SmartHire
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Precision Features - Grid */}
            <section className="border-b border-white/[0.08]">
                <div className="grid md:grid-cols-3 divide-x divide-white/[0.08]">
                    <LuxuryFeature
                        icon={<Cpu size={32} strokeWidth={1} />}
                        title="Neural Reasoning"
                        desc="DeepSeek-R1 core analysis utilizing 8-layer cognitive chains to evaluate problem-solving depth."
                        step="01"
                        link="/docs#neural-architecture"
                    />
                    <LuxuryFeature
                        icon={<Shield size={32} strokeWidth={1} />}
                        title="Integrity Sentinel"
                        desc="Advanced proctoring mesh utilizing MediaPipe for secondary screen detection and session integrity."
                        step="02"
                        link="/docs#sentinel"
                    />
                    <LuxuryFeature
                        icon={<Zap size={32} strokeWidth={1} />}
                        title="Instant Resonance"
                        desc="BGE-M3 semantic vectors identifying top talent alignment in under 45ms via ChromaDB."
                        step="03"
                        link="/docs#resonance"
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-32">
                <div className="container-l">
                    <div className="flex flex-col md:flex-row justify-between gap-20 mb-32">
                        <div className="max-w-xs">
                            <div className="text-2xl font-bold tracking-tighter text-white mb-6">SmartHire</div>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Redefining human capital through the precise application of augmented intelligence.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-12 md:gap-24">
                            <FooterGroup title="Product" links={['Technology', 'Enterprise', 'Security', 'Research']} />
                            <FooterGroup title="Company" links={['Thesis', 'Intelligence', 'Network', 'Ethics']} />
                            <FooterGroup title="Connect" links={['Twitter', 'GitHub', 'LinkedIn', 'Support']} />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                            © 2026 SmartHire. Augmented Systems Division.
                        </div>
                        <div className="flex gap-8 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                            <span onClick={() => navigate('/docs#legal')} className="hover:text-white cursor-pointer transition-colors">Legal</span>
                            <span onClick={() => navigate('/docs#privacy')} className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span onClick={() => navigate('/docs#status')} className="hover:text-white cursor-pointer transition-colors">Status</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const LuxuryFeature = ({ icon, title, desc, step, link }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => link && navigate(link)}
            className="group relative p-8 md:p-10 hover:bg-white/[0.02] transition-colors duration-500 h-72 flex flex-col justify-between cursor-pointer border-b md:border-b-0 border-white/[0.08]"
        >
            <div className="flex justify-between items-start">
                <div className="text-white/20 group-hover:text-white transition-colors duration-500">
                    {icon}
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                    {step}
                </span>
            </div>

            <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                    {title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-light max-w-xs group-hover:text-white/80 transition-colors duration-500">
                    {desc}
                </p>
            </div>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <ArrowUpRight className="text-white" size={16} />
            </div>
        </div>
    );
};

const FooterGroup = ({ title, links }) => {
    const navigate = useNavigate();

    // Mapping for footer links
    const linkMap = {
        'Technology': '/docs#neural-architecture',
        'Enterprise': '/docs#compliance',
        'Security': '/docs#security',
        'Research': '/docs#sentinel',
        'Thesis': '/docs#thesis',
        'Intelligence': '/docs#intelligence',
        'Network': '/docs#network',
        'Ethics': '/docs#ethics',
        'Support': '/docs#support',
        'Legal': '/docs#legal',
        'Privacy': '/docs#privacy',
        'Status': '/docs#status',
        'Twitter': '/docs#connect',
        'GitHub': '/docs#connect',
        'LinkedIn': '/docs#connect'
    };

    const handleLinkClick = (link) => {
        const target = linkMap[link];
        if (target) {
            navigate(target);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                {title}
            </div>
            <ul className="space-y-4">
                {links.map(link => (
                    <li
                        key={link}
                        onClick={() => handleLinkClick(link)}
                        className="text-xs text-text-muted hover:text-white cursor-pointer transition-colors duration-300 font-medium w-max border-b border-transparent hover:border-emerald-500/30 pb-0.5"
                    >
                        {link}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LandingPage;
