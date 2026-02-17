import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Briefcase, Clock, DollarSign, Sparkles, ChevronRight, Filter } from 'lucide-react';

const JobBrowsePage = () => {
    const { authFetch } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ type: '', level: '' });
    const [applying, setApplying] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const data = await authFetch('/jobs/matched');
            setJobs(data);
        } catch {
            // Fallback to regular jobs list
            try {
                const data = await authFetch('/jobs/?active_only=true');
                setJobs(data.map(j => ({ ...j, match_score: null })));
            } catch (e) {
                console.error(e);
            }
        }
        setLoading(false);
    };

    const applyToJob = async (jobId) => {
        setApplying(jobId);
        try {
            await authFetch('/applications/', {
                method: 'POST',
                body: JSON.stringify({ job_id: jobId }),
            });
            // Update local state
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j));
        } catch (e) {
            console.error(e);
        }
        setApplying(null);
    };

    const filtered = jobs.filter(job => {
        if (search && !job.title.toLowerCase().includes(search.toLowerCase()) &&
            !(job.description || '').toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.type && job.job_type !== filters.type) return false;
        if (filters.level && job.experience_level !== filters.level) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="skeleton h-12 w-64" />
                <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-48" />)}
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Browse Jobs</h1>
                <p className="text-text-muted text-sm">Discover positions matched to your skills</p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" style={{ transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Search jobs..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
                <select className="form-input w-auto" value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}>
                    <option value="">All Types</option>
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                </select>
                <select className="form-input w-auto" value={filters.level} onChange={e => setFilters(p => ({ ...p, level: e.target.value }))}>
                    <option value="">All Levels</option>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                </select>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 gap-6">
                {filtered.map((job, idx) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="luxury-card p-6 flex flex-col gap-4 group"
                    >
                        <div className="flex justify-between items-start">
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-lg truncate">{job.title}</h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                                    {job.location && <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>}
                                    {job.job_type && <span className="flex items-center gap-1"><Briefcase size={12} /> {job.job_type.replace('_', '-')}</span>}
                                    {job.experience_level && <span className="flex items-center gap-1"><Clock size={12} /> {job.experience_level}</span>}
                                </div>
                            </div>
                            {job.match_score != null && (
                                <div className="shrink-0 flex flex-col items-center">
                                    <div className={`text-xl font-bold ${job.match_score >= 70 ? 'text-green-400' : job.match_score >= 40 ? 'text-yellow-400' : 'text-text-muted'}`}>
                                        {job.match_score}%
                                    </div>
                                    <div className="text-[8px] text-text-muted uppercase tracking-widest flex items-center gap-1"><Sparkles size={8} /> match</div>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-text-secondary line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-2">
                            {(job.requirements || []).slice(0, 4).map((req, i) => (
                                <span key={i} className="badge badge-neutral text-[9px]">{req}</span>
                            ))}
                            {(job.requirements || []).length > 4 && (
                                <span className="badge badge-neutral text-[9px]">+{job.requirements.length - 4}</span>
                            )}
                        </div>

                        {job.salary_range && (
                            <div className="flex items-center gap-1 text-xs text-text-muted">
                                <DollarSign size={12} /> {job.salary_range}
                            </div>
                        )}

                        <div className="flex justify-end pt-2 border-t border-white/[0.08]">
                            {job.applied ? (
                                <span className="badge badge-green">Applied</span>
                            ) : (
                                <button
                                    onClick={() => applyToJob(job.id)}
                                    disabled={applying === job.id}
                                    className="btn-primary text-xs"
                                >
                                    {applying === job.id ? 'Applying...' : 'Apply Now'}
                                    <ChevronRight size={14} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <Briefcase size={32} className="mx-auto text-text-muted mb-4" />
                    <p className="text-text-secondary">No jobs found matching your criteria</p>
                </div>
            )}
        </motion.div>
    );
};

export default JobBrowsePage;
