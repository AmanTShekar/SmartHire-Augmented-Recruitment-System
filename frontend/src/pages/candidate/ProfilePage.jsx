import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Mail, Phone, Briefcase, GraduationCap, Award, Link2, Upload, FileText, Sparkles, Edit3, Save, X } from 'lucide-react';

const ProfilePage = () => {
    const { user, authFetch, updateProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        full_name: '',
        phone: '',
        headline: '',
        bio: '',
        skills: [],
        experience_years: 0,
        education: [],
        certifications: [],
        portfolio_url: '',
        linkedin_url: '',
        location: '',
    });
    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        if (user) {
            const cp = user.candidate_profile || {};
            setForm({
                full_name: user.full_name || '',
                phone: user.phone || '',
                headline: cp.headline || '',
                bio: cp.bio || '',
                skills: cp.skills || [],
                experience_years: cp.experience_years || 0,
                education: cp.education || [],
                certifications: cp.certifications || [],
                portfolio_url: cp.portfolio_url || '',
                linkedin_url: cp.linkedin_url || '',
                location: cp.location || '',
            });
        }
    }, [user]);

    useEffect(() => {
        loadMatchedJobs();
    }, []);

    const loadMatchedJobs = async () => {
        try {
            const data = await authFetch('/jobs/matched');
            setMatchedJobs(data.slice(0, 5));
        } catch (e) {
            console.log('Could not load matched jobs');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile(form);
            setEditing(false);
        } catch (e) {
            console.error(e);
        }
        setSaving(false);
    };

    const addSkill = () => {
        if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
            setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const API_BASE = import.meta.env.VITE_API_URL || '/api';
            const res = await fetch(`${API_BASE}/resume/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('smarthire_token')}` },
                body: fd,
            });
            if (res.ok) {
                const data = await res.json();
                // Optionally update profile with resume URL
                await updateProfile({ ...form });
            }
        } catch (err) {
            console.error('Upload failed', err);
        }
        setUploading(false);
    };

    const cp = user?.candidate_profile || {};

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 max-w-5xl">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">My Profile</h1>
                    <p className="text-text-muted text-sm">Manage your candidate profile and resume</p>
                </div>
                {!editing ? (
                    <button onClick={() => setEditing(true)} className="btn-secondary">
                        <Edit3 size={14} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={() => setEditing(false)} className="btn-ghost"><X size={14} /> Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="btn-primary">
                            {saving ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Save size={14} /> Save</>}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left: Profile Card */}
                <div className="luxury-card p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <User size={32} className="text-text-muted" />
                    </div>
                    {editing ? (
                        <input className="form-input text-center" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
                    ) : (
                        <h2 className="text-xl font-bold">{user?.full_name || 'Your Name'}</h2>
                    )}
                    {editing ? (
                        <input className="form-input text-center text-sm" placeholder="Headline (e.g. Full-Stack Dev)" value={form.headline} onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} />
                    ) : (
                        <p className="text-text-secondary text-sm">{cp.headline || 'Add a headline'}</p>
                    )}

                    <div className="flex flex-col gap-2 w-full text-left text-sm">
                        <div className="flex items-center gap-2 text-text-muted">
                            <Mail size={14} /> <span>{user?.email}</span>
                        </div>
                        {editing ? (
                            <>
                                <div className="flex items-center gap-2"><Phone size={14} className="text-text-muted shrink-0" /> <input className="form-input py-1 text-sm" placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                                <div className="flex items-center gap-2"><MapPin size={14} className="text-text-muted shrink-0" /> <input className="form-input py-1 text-sm" placeholder="Location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
                            </>
                        ) : (
                            <>
                                {user?.phone && <div className="flex items-center gap-2 text-text-muted"><Phone size={14} /> <span>{user.phone}</span></div>}
                                {cp.location && <div className="flex items-center gap-2 text-text-muted"><MapPin size={14} /> <span>{cp.location}</span></div>}
                            </>
                        )}
                    </div>

                    {/* Resume Upload */}
                    <div className="w-full pt-4 border-t border-white/10">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Resume</div>
                        <label className="luxury-card p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-white/20 transition">
                            <Upload size={20} className="text-text-muted" />
                            <span className="text-xs text-text-secondary">{uploading ? 'Uploading...' : 'Upload PDF/DOC'}</span>
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                        </label>
                        {cp.resume_url && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                                <FileText size={12} /> Resume uploaded
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    {/* Bio */}
                    <div className="luxury-card p-6">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">About</div>
                        {editing ? (
                            <textarea className="form-input" rows={4} placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
                        ) : (
                            <p className="text-sm text-text-secondary leading-relaxed">{cp.bio || 'No bio added yet.'}</p>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="luxury-card p-6">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Skills</div>
                        <div className="flex flex-wrap gap-2">
                            {(editing ? form.skills : cp.skills || []).map((skill, i) => (
                                <span key={i} className="badge badge-blue flex items-center gap-1">
                                    {skill}
                                    {editing && <button onClick={() => removeSkill(skill)} className="hover:text-white ml-1 cursor-pointer"><X size={10} /></button>}
                                </span>
                            ))}
                            {(!editing && (!cp.skills || cp.skills.length === 0)) && <p className="text-sm text-text-muted">No skills added yet.</p>}
                        </div>
                        {editing && (
                            <div className="flex gap-2 mt-3">
                                <input className="form-input flex-1" placeholder="Add a skill..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                                <button onClick={addSkill} className="btn-secondary">Add</button>
                            </div>
                        )}
                    </div>

                    {/* Experience & Education */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="luxury-card p-6">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Experience</div>
                            {editing ? (
                                <div className="flex items-center gap-2">
                                    <input type="number" min="0" className="form-input w-20" value={form.experience_years} onChange={e => setForm(p => ({ ...p, experience_years: parseInt(e.target.value) || 0 }))} />
                                    <span className="text-sm text-text-secondary">years</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Briefcase size={16} className="text-text-muted" />
                                    <span className="text-2xl font-bold">{cp.experience_years || 0}</span>
                                    <span className="text-sm text-text-secondary">years</span>
                                </div>
                            )}
                        </div>
                        <div className="luxury-card p-6">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Links</div>
                            {editing ? (
                                <div className="space-y-2">
                                    <input className="form-input text-sm" placeholder="Portfolio URL" value={form.portfolio_url} onChange={e => setForm(p => ({ ...p, portfolio_url: e.target.value }))} />
                                    <input className="form-input text-sm" placeholder="LinkedIn URL" value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {cp.portfolio_url && <a href={cp.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:underline"><Link2 size={14} /> Portfolio</a>}
                                    {cp.linkedin_url && <a href={cp.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:underline"><Link2 size={14} /> LinkedIn</a>}
                                    {!cp.portfolio_url && !cp.linkedin_url && <p className="text-sm text-text-muted">No links added.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Matches */}
            {matchedJobs.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={16} className="text-yellow-400" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">AI-Matched Jobs</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {matchedJobs.map(job => (
                            <motion.div
                                key={job.id}
                                whileHover={{ y: -2 }}
                                className="luxury-card p-5 flex justify-between items-center gap-4"
                            >
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm truncate">{job.title}</h4>
                                    <p className="text-xs text-text-muted mt-1 truncate">{job.location || 'Remote'} · {job.job_type || 'Full-time'}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <div className="text-lg font-bold">{job.match_score}%</div>
                                    <div className="text-[9px] text-text-muted uppercase tracking-widest">match</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ProfilePage;
