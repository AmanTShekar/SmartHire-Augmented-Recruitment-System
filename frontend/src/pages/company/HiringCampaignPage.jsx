import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Plus, Briefcase, X, ChevronRight, Layers, Clock, Target, Edit3, Trash2 } from 'lucide-react';

const roundTypes = [
    { value: 'resume_screen', label: 'Resume Screening', desc: 'AI-powered resume analysis' },
    { value: 'aptitude_test', label: 'Aptitude Test', desc: 'MCQ / subjective questions' },
    { value: 'technical_assessment', label: 'Technical Assessment', desc: 'Domain-specific evaluation' },
    { value: 'ai_interview', label: 'AI Interview', desc: 'Conversational AI interview' },
    { value: 'coding_challenge', label: 'Coding Challenge', desc: 'Coming Soon', disabled: true },
    { value: 'hr_interview', label: 'HR Interview', desc: 'Manual scheduling' },
];

const HiringCampaignPage = () => {
    const { user, authFetch } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [rounds, setRounds] = useState([]);
    const [showAddRound, setShowAddRound] = useState(false);

    const [form, setForm] = useState({
        title: '', description: '', requirements: '', location: '', job_type: 'full_time',
        experience_level: 'mid', salary_range: '',
    });

    const [roundForm, setRoundForm] = useState({
        round_type: 'aptitude_test', round_name: '', description: '', duration_minutes: 60,
        max_marks: 100, passing_marks: 50,
    });

    useEffect(() => { loadJobs(); }, []);

    const loadJobs = async () => {
        try {
            const data = await authFetch('/jobs/?active_only=false');
            setJobs(data.filter(j => j.recruiter_id === user?.id));
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    const createJob = async () => {
        setCreating(true);
        try {
            const reqs = form.requirements.split(',').map(r => r.trim()).filter(Boolean);
            await authFetch('/jobs/', {
                method: 'POST',
                body: JSON.stringify({
                    ...form,
                    requirements: reqs,
                    recruiter_id: user.id,
                }),
            });
            setShowCreate(false);
            setForm({ title: '', description: '', requirements: '', location: '', job_type: 'full_time', experience_level: 'mid', salary_range: '' });
            loadJobs();
        } catch (e) { console.error(e); }
        setCreating(false);
    };

    const selectJob = async (job) => {
        setSelectedJob(job);
        try {
            const data = await authFetch(`/jobs/${job.id}/rounds`);
            setRounds(data);
        } catch { setRounds([]); }
    };

    const addRound = async () => {
        try {
            await authFetch(`/jobs/${selectedJob.id}/rounds`, {
                method: 'POST',
                body: JSON.stringify({
                    ...roundForm,
                    order: rounds.length + 1,
                }),
            });
            const data = await authFetch(`/jobs/${selectedJob.id}/rounds`);
            setRounds(data);
            setShowAddRound(false);
            setRoundForm({ round_type: 'aptitude_test', round_name: '', description: '', duration_minutes: 60, max_marks: 100, passing_marks: 50 });
        } catch (e) { console.error(e); }
    };

    const toggleJob = async (job) => {
        try {
            await authFetch(`/jobs/${job.id}`, {
                method: 'PUT',
                body: JSON.stringify({ is_active: !job.is_active }),
            });
            loadJobs();
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="flex flex-col gap-6"><div className="skeleton h-12 w-64" />{[1, 2].map(i => <div key={i} className="skeleton h-32" />)}</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Hiring Campaigns</h1>
                    <p className="text-text-muted text-sm">Create and manage job postings with multi-round pipelines</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus size={14} /> Create Campaign</button>
            </div>

            <div className="flex gap-6">
                {/* Jobs List */}
                <div className="w-80 shrink-0 flex flex-col gap-3">
                    {jobs.map(job => (
                        <motion.button
                            key={job.id}
                            whileHover={{ x: 2 }}
                            onClick={() => selectJob(job)}
                            className={`luxury-card p-4 text-left cursor-pointer transition w-full ${selectedJob?.id === job.id ? 'border-white/20' : ''
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-sm truncate">{job.title}</h3>
                                <span className={`badge ${job.is_active ? 'badge-green' : 'badge-neutral'} text-[8px]`}>
                                    {job.is_active ? 'Live' : 'Draft'}
                                </span>
                            </div>
                            <p className="text-xs text-text-muted mt-1">{job.location || 'Remote'} · {job.job_type}</p>
                        </motion.button>
                    ))}
                    {jobs.length === 0 && (
                        <div className="text-center py-8 text-text-muted text-sm">No campaigns yet</div>
                    )}
                </div>

                {/* Selected Job Details & Rounds */}
                <div className="flex-1">
                    {selectedJob ? (
                        <div className="flex flex-col gap-6">
                            <div className="luxury-card p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                                        <p className="text-sm text-text-secondary mt-1">{selectedJob.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => toggleJob(selectedJob)} className="btn-ghost text-xs">
                                            {selectedJob.is_active ? 'Pause' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedJob.requirements || []).map((r, i) => (
                                        <span key={i} className="badge badge-neutral text-[9px]">{r}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Rounds Pipeline */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Layers size={14} /> Hiring Pipeline
                                    </h3>
                                    <button onClick={() => setShowAddRound(true)} className="btn-secondary text-xs">
                                        <Plus size={12} /> Add Round
                                    </button>
                                </div>

                                {rounds.length === 0 ? (
                                    <div className="luxury-card p-8 text-center">
                                        <p className="text-text-muted text-sm mb-4">No rounds configured yet</p>
                                        <button onClick={() => setShowAddRound(true)} className="btn-secondary text-xs">
                                            <Plus size={12} /> Add First Round
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {rounds.map((round, i) => (
                                            <motion.div
                                                key={round.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="luxury-card p-5 flex items-center gap-4"
                                            >
                                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {round.order}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm">{round.round_name}</div>
                                                    <div className="text-xs text-text-muted mt-0.5">{round.description || round.round_type}</div>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-text-muted shrink-0">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {round.duration_minutes}m</span>
                                                    <span className="flex items-center gap-1"><Target size={12} /> {round.passing_marks}/{round.max_marks}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-text-muted text-sm">
                            Select a campaign to manage its hiring pipeline
                        </div>
                    )}
                </div>
            </div>

            {/* Create Job Modal */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="luxury-card p-8 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">New Hiring Campaign</h3>
                                <button onClick={() => setShowCreate(false)} className="text-text-muted hover:text-white cursor-pointer"><X size={18} /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="form-label">Job Title</label>
                                    <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Senior Software Engineer" />
                                </div>
                                <div>
                                    <label className="form-label">Description</label>
                                    <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Job description..." />
                                </div>
                                <div>
                                    <label className="form-label">Requirements (comma-separated)</label>
                                    <input className="form-input" value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} placeholder="React, Python, SQL" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="form-label">Location</label>
                                        <input className="form-input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Remote" />
                                    </div>
                                    <div>
                                        <label className="form-label">Salary Range</label>
                                        <input className="form-input" value={form.salary_range} onChange={e => setForm(p => ({ ...p, salary_range: e.target.value }))} placeholder="$80k-$120k" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="form-label">Job Type</label>
                                        <select className="form-input" value={form.job_type} onChange={e => setForm(p => ({ ...p, job_type: e.target.value }))}>
                                            <option value="full_time">Full-time</option>
                                            <option value="part_time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Level</label>
                                        <select className="form-input" value={form.experience_level} onChange={e => setForm(p => ({ ...p, experience_level: e.target.value }))}>
                                            <option value="entry">Entry</option>
                                            <option value="mid">Mid</option>
                                            <option value="senior">Senior</option>
                                            <option value="lead">Lead</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.08]">
                                <button onClick={() => setShowCreate(false)} className="btn-ghost">Cancel</button>
                                <button onClick={createJob} disabled={creating || !form.title} className="btn-primary">
                                    {creating ? 'Creating...' : 'Create Campaign'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Round Modal */}
            <AnimatePresence>
                {showAddRound && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="luxury-card p-8 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Add Hiring Round</h3>
                                <button onClick={() => setShowAddRound(false)} className="text-text-muted hover:text-white cursor-pointer"><X size={18} /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="form-label">Round Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {roundTypes.map(rt => (
                                            <button
                                                key={rt.value}
                                                disabled={rt.disabled}
                                                onClick={() => setRoundForm(p => ({ ...p, round_type: rt.value, round_name: rt.label }))}
                                                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${rt.disabled ? 'opacity-30 cursor-not-allowed' :
                                                        roundForm.round_type === rt.value
                                                            ? 'border-white/30 bg-white/5'
                                                            : 'border-white/[0.08] hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="font-bold">{rt.label}</div>
                                                <div className="text-text-muted mt-0.5">{rt.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Round Name</label>
                                    <input className="form-input" value={roundForm.round_name} onChange={e => setRoundForm(p => ({ ...p, round_name: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="form-label">Duration (min)</label>
                                        <input type="number" className="form-input" value={roundForm.duration_minutes} onChange={e => setRoundForm(p => ({ ...p, duration_minutes: parseInt(e.target.value) || 60 }))} />
                                    </div>
                                    <div>
                                        <label className="form-label">Max Marks</label>
                                        <input type="number" className="form-input" value={roundForm.max_marks} onChange={e => setRoundForm(p => ({ ...p, max_marks: parseInt(e.target.value) || 100 }))} />
                                    </div>
                                    <div>
                                        <label className="form-label">Pass Marks</label>
                                        <input type="number" className="form-input" value={roundForm.passing_marks} onChange={e => setRoundForm(p => ({ ...p, passing_marks: parseInt(e.target.value) || 50 }))} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.08]">
                                <button onClick={() => setShowAddRound(false)} className="btn-ghost">Cancel</button>
                                <button onClick={addRound} disabled={!roundForm.round_name} className="btn-primary">Add Round</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HiringCampaignPage;
