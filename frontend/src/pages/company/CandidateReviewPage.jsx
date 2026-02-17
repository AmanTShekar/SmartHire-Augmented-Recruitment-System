import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Users, Search, Filter, User, StarIcon, CheckCircle, XCircle, ChevronDown, BarChart3, Eye } from 'lucide-react';

const CandidateReviewPage = () => {
    const { user, authFetch } = useAuth();
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(searchParams.get('job') || '');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        if (selectedJobId) loadApplications(selectedJobId);
    }, [selectedJobId]);

    const loadJobs = async () => {
        try {
            const data = await authFetch('/jobs/?active_only=false');
            const myJobs = data.filter(j => j.recruiter_id === user?.id);
            setJobs(myJobs);
            if (myJobs.length > 0 && !selectedJobId) setSelectedJobId(String(myJobs[0].id));
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    const loadApplications = async (jobId) => {
        try {
            const data = await authFetch(`/jobs/${jobId}/applications`);
            setApplications(data);
        } catch { setApplications([]); }
    };

    const updateStatus = async (appId, newStatus) => {
        try {
            await authFetch(`/applications/${appId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus }),
            });
            loadApplications(selectedJobId);
        } catch (e) { console.error(e); }
    };

    const filtered = applications.filter(app => {
        if (statusFilter !== 'all' && app.status !== statusFilter) return false;
        if (search && !(app.candidate_name || '').toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    if (loading) {
        return <div className="flex flex-col gap-6"><div className="skeleton h-12 w-64" />{[1, 2, 3].map(i => <div key={i} className="skeleton h-20" />)}</div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Review Candidates</h1>
                <p className="text-text-muted text-sm">Evaluate and manage applicants across your campaigns</p>
            </div>

            {/* Job Selector & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <select
                    className="form-input w-auto"
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(e.target.value)}
                >
                    <option value="">Select Campaign</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-4 top-1/2 text-text-muted" style={{ transform: 'translateY(-50%)' }} />
                    <input
                        className="form-input" style={{ paddingLeft: '40px' }}
                        placeholder="Search candidates..."
                        value={search} onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select className="form-input w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="screening">Screening</option>
                    <option value="testing">Testing</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Candidates Table */}
            {selectedJobId ? (
                <div className="luxury-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.08]">
                                    <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Candidate</th>
                                    <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                                    <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Applied</th>
                                    <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Score</th>
                                    <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((app, i) => (
                                    <motion.tr
                                        key={app.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{app.candidate_name || `Candidate #${app.candidate_id}`}</div>
                                                    <div className="text-xs text-text-muted">{app.candidate_email || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge ${app.status === 'offer' ? 'badge-green' :
                                                    app.status === 'rejected' ? 'badge-red' :
                                                        app.status === 'interview' ? 'badge-purple' :
                                                            'badge-blue'
                                                }`}>{app.status}</span>
                                        </td>
                                        <td className="p-4 text-text-muted">
                                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <div className="h-full rounded-full bg-green-500" style={{ width: `${app.match_score || 0}%` }} />
                                                </div>
                                                <span className="text-xs">{app.match_score || '—'}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => updateStatus(app.id, 'screening')}
                                                    className="p-1.5 rounded hover:bg-green-500/10 text-green-400 transition cursor-pointer"
                                                    title="Advance"
                                                ><CheckCircle size={14} /></button>
                                                <button
                                                    onClick={() => updateStatus(app.id, 'rejected')}
                                                    className="p-1.5 rounded hover:bg-red-500/10 text-red-400 transition cursor-pointer"
                                                    title="Reject"
                                                ><XCircle size={14} /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="p-10 text-center">
                            <Users size={32} className="mx-auto text-text-muted mb-4" />
                            <p className="text-text-secondary text-sm">No candidates match your filters</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="luxury-card p-10 text-center">
                    <Users size={32} className="mx-auto text-text-muted mb-4" />
                    <p className="text-text-secondary text-sm">Select a campaign to view its applicants</p>
                </div>
            )}
        </motion.div>
    );
};

export default CandidateReviewPage;
