import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Briefcase } from 'lucide-react';

const statusConfig = {
    applied: { label: 'Applied', badge: 'badge-blue', icon: <Clock size={12} /> },
    screening: { label: 'Screening', badge: 'badge-purple', icon: <AlertCircle size={12} /> },
    testing: { label: 'Testing', badge: 'badge-yellow', icon: <FileText size={12} /> },
    interview: { label: 'Interview', badge: 'badge-blue', icon: <AlertCircle size={12} /> },
    offer: { label: 'Offer', badge: 'badge-green', icon: <CheckCircle size={12} /> },
    rejected: { label: 'Rejected', badge: 'badge-red', icon: <XCircle size={12} /> },
};

const MyApplicationsPage = () => {
    const { authFetch } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await authFetch('/applications/mine');
            setApplications(data);
        } catch (e) {
            console.log('Could not load applications');
        }
        setLoading(false);
    };

    const filtered = filter === 'all'
        ? applications
        : applications.filter(a => a.status === filter);

    const statusSteps = ['applied', 'screening', 'testing', 'interview', 'offer'];

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="skeleton h-12 w-64" />
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-32" />)}
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">My Applications</h1>
                <p className="text-text-muted text-sm">Track your application progress</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 border-b border-white/[0.08] overflow-x-auto no-scrollbar">
                {['all', ...Object.keys(statusConfig)].map(key => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`tab-btn whitespace-nowrap ${filter === key ? 'active' : ''}`}
                    >
                        {key === 'all' ? 'All' : statusConfig[key].label}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div className="flex flex-col gap-4">
                {filtered.map((app, idx) => {
                    const cfg = statusConfig[app.status] || statusConfig.applied;
                    const currentStep = statusSteps.indexOf(app.status);

                    return (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="luxury-card p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{app.job_title || `Job #${app.job_id}`}</h3>
                                    <p className="text-xs text-text-muted mt-1">Applied {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'recently'}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {app.match_score && (
                                        <div className="text-right">
                                            <div className="text-sm font-bold">{app.match_score}%</div>
                                            <div className="text-[8px] text-text-muted uppercase tracking-widest">match</div>
                                        </div>
                                    )}
                                    <span className={`badge ${cfg.badge} flex items-center gap-1`}>
                                        {cfg.icon} {cfg.label}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Pipeline */}
                            {app.status !== 'rejected' && (
                                <div className="flex items-center gap-1 mt-4">
                                    {statusSteps.map((step, i) => {
                                        const isCompleted = i <= currentStep;
                                        const isCurrent = i === currentStep;
                                        return (
                                            <React.Fragment key={step}>
                                                <div className={`flex-1 h-1 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-white/10'
                                                    }`} />
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex gap-3 text-[9px] text-text-muted uppercase tracking-widest">
                                    {statusSteps.map((step, i) => (
                                        <span key={step} className={i <= currentStep ? 'text-white' : ''}>{step}</span>
                                    ))}
                                </div>
                                {(app.status === 'testing' || app.status === 'interview') && (
                                    <button className="btn-primary text-xs">
                                        Continue <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <Briefcase size={32} className="mx-auto text-text-muted mb-4" />
                    <p className="text-text-secondary">
                        {filter === 'all' ? 'No applications yet. Browse jobs to apply!' : `No ${filter} applications.`}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default MyApplicationsPage;
