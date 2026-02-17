import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Server, Cpu, Database, Wifi, Clock, Sparkles, Shield, Wrench } from 'lucide-react';

const AdminSystemPage = () => {
    const { authFetch } = useAuth();
    const [system, setSystem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSystem();
    }, []);

    const loadSystem = async () => {
        try {
            const data = await authFetch('/admin/system');
            setSystem(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    if (loading) {
        return <div className="flex flex-col gap-6"><div className="skeleton h-12 w-64" />{[1, 2, 3].map(i => <div key={i} className="skeleton h-32" />)}</div>;
    }

    const statusColor = (status) => {
        if (status === 'healthy' || status === 'Available') return 'text-green-400';
        if (status === 'error') return 'text-red-400';
        return 'text-yellow-400';
    };

    const statusDot = (status) => {
        if (status === 'healthy' || status === 'Available') return 'bg-green-400';
        if (status === 'error') return 'bg-red-400';
        return 'bg-yellow-400';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">System</h1>
                <p className="text-text-muted text-sm">Infrastructure health, AI models, and roadmap</p>
            </div>

            {system && (
                <>
                    {/* Health Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="luxury-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Database size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Database</div>
                                    <div className="text-xs text-text-muted">{system.database.engine}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${statusDot(system.database.status)} ${system.database.status === 'healthy' ? 'animate-pulse' : ''}`} />
                                <span className={`text-sm font-bold capitalize ${statusColor(system.database.status)}`}>{system.database.status}</span>
                            </div>
                        </div>

                        <div className="luxury-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Server size={18} className="text-green-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">API</div>
                                    <div className="text-xs text-text-muted">v{system.api.version}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${statusDot(system.api.status)} ${system.api.status === 'healthy' ? 'animate-pulse' : ''}`} />
                                <span className={`text-sm font-bold capitalize ${statusColor(system.api.status)}`}>{system.api.status}</span>
                            </div>
                        </div>

                        <div className="luxury-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Cpu size={18} className="text-purple-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">AI Models</div>
                                    <div className="text-xs text-text-muted">NLP · Vision · Audio</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(system.ai_models).map(([key, val]) => (
                                    <div key={key} className="flex items-center justify-between text-xs">
                                        <span className="capitalize text-text-secondary">{key}</span>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${statusDot(val)}`} />
                                            <span className={statusColor(val)}>{val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Roadmap */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Sparkles size={14} /> Feature Roadmap
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {system.planned_features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="luxury-card p-5 flex items-center gap-4"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${feature.status === 'coming_soon' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-white/5 text-text-muted'
                                        }`}>
                                        {feature.status === 'coming_soon' ? <Sparkles size={16} /> : <Wrench size={16} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm">{feature.name}</div>
                                        <div className="text-xs text-text-muted mt-0.5">ETA: {feature.eta}</div>
                                    </div>
                                    <span className={`badge ${feature.status === 'coming_soon' ? 'badge-yellow' : 'badge-neutral'} text-[8px]`}>
                                        {feature.status === 'coming_soon' ? 'Coming Soon' : 'Planned'}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default AdminSystemPage;
