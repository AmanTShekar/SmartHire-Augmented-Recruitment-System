import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, Users, BarChart3, TrendingUp, ChevronRight, Plus, Eye } from 'lucide-react';

const CompanyDashboard = () => {
    const { user, authFetch } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await authFetch('/jobs/?active_only=false');
            // Filter to only this company's jobs
            const myJobs = data.filter(j => j.recruiter_id === user?.id);
            setJobs(myJobs);
        } catch (e) {
            console.log('Could not load jobs');
        }
        setLoading(false);
    };

    const activeJobs = jobs.filter(j => j.is_active);
    const totalApplicants = jobs.reduce((sum, j) => sum + (j.application_count || 0), 0);

    const stats = [
        { label: 'Active Campaigns', value: activeJobs.length, icon: <Briefcase size={20} />, color: 'text-blue-400' },
        { label: 'Total Applicants', value: totalApplicants, icon: <Users size={20} />, color: 'text-green-400' },
        { label: 'Interviews Scheduled', value: 0, icon: <BarChart3 size={20} />, color: 'text-purple-400' },
        { label: 'Avg. Match Score', value: '—', icon: <TrendingUp size={20} />, color: 'text-yellow-400' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="skeleton h-12 w-64" />
                <div className="grid grid-cols-4 gap-6">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-28" />)}</div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">
                        Welcome, {user?.company_profile?.company_name || user?.full_name}
                    </h1>
                    <p className="text-text-muted text-sm">Here's your hiring overview</p>
                </div>
                <Link to="/company/campaigns" className="btn-primary">
                    <Plus size={14} /> New Campaign
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="luxury-card p-6"
                    >
                        <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Active Campaigns */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest">Active Campaigns</h2>
                    <Link to="/company/campaigns" className="text-xs text-text-muted hover:text-white transition flex items-center gap-1">
                        View All <ChevronRight size={14} />
                    </Link>
                </div>
                {activeJobs.length === 0 ? (
                    <div className="luxury-card p-10 text-center">
                        <Briefcase size={32} className="mx-auto text-text-muted mb-4" />
                        <p className="text-text-secondary text-sm mb-4">No active hiring campaigns yet</p>
                        <Link to="/company/campaigns" className="btn-primary inline-flex">
                            <Plus size={14} /> Create Campaign
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {activeJobs.slice(0, 4).map((job, idx) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="luxury-card p-6 group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg">{job.title}</h3>
                                    <span className="badge badge-green">Active</span>
                                </div>
                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{job.description}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-white/[0.08]">
                                    <div className="flex gap-4 text-xs text-text-muted">
                                        <span>{job.location || 'Remote'}</span>
                                        <span>{job.job_type || 'Full-time'}</span>
                                    </div>
                                    <Link to={`/company/review?job=${job.id}`} className="text-xs text-text-muted hover:text-white transition flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                        <Eye size={12} /> View Applicants
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CompanyDashboard;
