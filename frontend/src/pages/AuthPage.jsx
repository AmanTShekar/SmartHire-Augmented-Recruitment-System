import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, User, Building2, ChevronLeft, Check, X, Github, Linkedin, Globe } from 'lucide-react';

const LEGAL_CONTENT = {
    terms: {
        title: "Terms of Service",
        content: `1. Acceptance of Terms
By accessing or using SmartHire ("the Platform"), you agree to be bound by these Terms.
        
2. Use of Services
The Platform provides autonomous recruitment tools. You agree to use these services only for lawful purposes acting in good faith.
        
3. Intellectual Property
All content, design, and code on SmartHire is the proprietary property of SmartHire Inc.
        
4. Liability
SmartHire is not liable for hiring decisions made using our autonomous tools. The final decision rests with the company.`
    },
    privacy: {
        title: "Privacy Policy",
        content: `1. Data Collection
We collect personal information necessary for recruitment, including names, emails, and professional history.
        
2. Data Usage
Your data is used solely to match candidates with opportunities and improve our matching algorithms.
        
3. Data Protection
We employ industry-standard encryption and security measures to protect your personal information.
        
4. Your Rights
You have the right to access, correct, or delete your data at any time.`
    },
    dpa: {
        title: "Data Processing Agreement",
        content: `1. Scope and Purpose
This DPA applies to the processing of personal data by SmartHire on behalf of the Customer.
        
2. Processing Instructions
We process data only in accordance with your documented instructions and the requirements of applicable law.
        
3. Sub-processors
We may engage third-party sub-processors to support our services, ensuring they meet the same security standards.
        
4. Security
We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk.`
    }
};

const AuthPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';

    const setMode = (newMode) => {
        setSearchParams({ mode: newMode });
        setError('');
    };

    const [role, setRole] = useState('candidate'); // candidate | company
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeDoc, setActiveDoc] = useState(null); // 'terms' | 'privacy' | 'dpa' | null
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: '',
        full_name: '',
        company_name: '',
        industry: '',
        agreed: false,
    });

    const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let user;
            if (mode === 'login') {
                user = await login(form.email, form.password);
            } else {
                user = await register({
                    email: form.email,
                    password: form.password,
                    full_name: form.full_name,
                    role,
                    company_name: form.company_name,
                    industry: form.industry,
                });
            }
            // Redirect based on role
            const r = user?.role || role;
            if (r === 'admin') navigate('/admin');
            else if (r === 'company') navigate('/company');
            else navigate('/candidate');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden py-20 px-4">
            <div className="noise-overlay" />

            {/* Background glow */}
            <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-[120px] top-1/4 left-1/4 pointer-events-none" />
            <div className="absolute w-64 h-64 bg-white/3 rounded-full blur-[100px] bottom-1/4 right-1/4 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-6 my-20">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-12 group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
                >
                    <div className="mb-8 text-center">
                        <div className="text-2xl font-bold tracking-tight text-white mb-2">SmartHire</div>
                        <h1 className="text-xl font-medium text-zinc-400">
                            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                        </h1>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={mode}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Register-specific fields */}
                            {mode === 'register' && (
                                <>
                                    {/* Role selection */}
                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <button
                                            type="button"
                                            onClick={() => setRole('candidate')}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all relative ${role === 'candidate'
                                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                                : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <User size={20} className="mb-2" />
                                            <div className="text-sm font-medium">Candidate</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('company')}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all relative ${role === 'company'
                                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                                : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <Building2 size={20} className="mb-2" />
                                            <div className="text-sm font-medium">Company</div>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-2 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white font-light tracking-wide placeholder:font-normal placeholder:tracking-normal placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base"
                                                placeholder="John Doe"
                                                value={form.full_name}
                                                onChange={e => update('full_name', e.target.value)}
                                            />
                                        </div>

                                        {role === 'company' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-medium text-zinc-400 mb-2 ml-1">Company Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white font-light tracking-wide placeholder:font-normal placeholder:tracking-normal placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base"
                                                        placeholder="Acme Inc."
                                                        value={form.company_name}
                                                        onChange={e => update('company_name', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-zinc-400 mb-2 ml-1">Industry</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white font-light tracking-wide placeholder:font-normal placeholder:tracking-normal placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base"
                                                        placeholder="Technology"
                                                        value={form.industry}
                                                        onChange={e => update('industry', e.target.value)}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white font-light tracking-wide placeholder:font-normal placeholder:tracking-normal placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base"
                                        placeholder="name@example.com"
                                        value={form.email}
                                        onChange={e => update('email', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-2 ml-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white font-light tracking-wide placeholder:font-normal placeholder:tracking-normal placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => update('password', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Terms & Privacy Consent - Only for Register mode */}
                            {mode === 'register' && (
                                <div className="flex items-start gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => update('agreed', !form.agreed)}
                                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${form.agreed
                                            ? 'bg-emerald-500 border-emerald-500 text-black'
                                            : 'border-white/20 bg-black/40 hover:border-white/40'
                                            }`}
                                    >
                                        {form.agreed && <Check size={12} strokeWidth={4} />}
                                    </button>
                                    <div className="text-xs text-zinc-500 leading-relaxed font-light">
                                        I agree to the <span onClick={() => setActiveDoc('terms')} className="text-zinc-300 hover:text-white hover:underline cursor-pointer transition-colors">Terms of Service</span>, <span onClick={() => setActiveDoc('privacy')} className="text-zinc-300 hover:text-white hover:underline cursor-pointer transition-colors">Privacy Policy</span>, and <span onClick={() => setActiveDoc('dpa')} className="text-zinc-300 hover:text-white hover:underline cursor-pointer transition-colors">Data Processing Agreement</span>.
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400/90 text-xs rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (mode === 'register' && !form.agreed)}
                                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black rounded-xl py-4 font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <span className="text-zinc-500 text-sm">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-white text-sm font-medium hover:text-emerald-400 transition-colors ml-1"
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </motion.div>
            </div>
            {/* Legal Modal */}
            <AnimatePresence>
                {activeDoc && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveDoc(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 cursor-pointer"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-8 z-50 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{LEGAL_CONTENT[activeDoc]?.title}</h3>
                                <button
                                    onClick={() => setActiveDoc(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                                >
                                    <X size={20} className="text-zinc-400 hover:text-white" />
                                </button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar space-y-6">
                                {LEGAL_CONTENT[activeDoc]?.content.split(/\n\s*\n/).map((paragraph, index) => (
                                    <p key={index} className="text-zinc-400 leading-7 text-sm font-light">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                                <button
                                    onClick={() => setActiveDoc(null)}
                                    className="px-6 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                                >
                                    Understood
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Creator Attribution */}
            {/* Creator Attribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 right-6 z-20 hidden md:block group" // Added group here
            >
                {/* Visual Pill */}
                <div className="flex items-center gap-3 bg-zinc-900/50 group-hover:bg-zinc-900 border border-white/5 group-hover:border-white/10 rounded-full pl-2 pr-4 py-2 backdrop-blur-md transition-all cursor-pointer">
                    <img
                        src="https://github.com/AmanTShekar.png"
                        alt="Aman T Shekar"
                        className="w-8 h-8 rounded-full border border-white/10"
                    />
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
                            Aman T Shekar
                        </span>
                        <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                            Full-Stack Developer
                        </span>
                    </div>
                </div>

                {/* Hover Card Details */}
                <div className="absolute bottom-full right-0 mb-3 w-72 bg-zinc-950/90 border border-white/10 rounded-2xl p-5 backdrop-blur-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src="https://github.com/AmanTShekar.png"
                            alt="Aman T Shekar"
                            className="w-10 h-10 rounded-full border border-white/10"
                        />
                        <div>
                            <h4 className="text-sm font-bold text-white">Aman T Shekar</h4>
                            <p className="text-[11px] text-emerald-400">Available for hire</p>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-400 mb-4 leading-relaxed border-t border-white/5 pt-3">
                        Full-Stack Developer crafting interactive websites, AI tools & dynamic web experiences.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        <a
                            href="https://github.com/AmanTShekar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all group/icon"
                        >
                            <Github size={18} className="group-hover/icon:scale-110 transition-transform" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/aman-t-shekar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-[#0A66C2] transition-all group/icon"
                        >
                            <Linkedin size={18} className="group-hover/icon:scale-110 transition-transform" />
                        </a>
                        <a
                            href="https://amantshekar.github.io/Aman.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-emerald-400 transition-all group/icon"
                        >
                            <Globe size={18} className="group-hover/icon:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
