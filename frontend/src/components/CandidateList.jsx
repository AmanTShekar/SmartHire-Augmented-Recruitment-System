import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Upload, X, Check } from 'lucide-react';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await fetch('/api/candidates/');
            const data = await response.json();
            setCandidates(data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading candidates...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Candidates</h2>
                    <p className="text-text-secondary text-sm">Manage your talent pool</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                >
                    <User size={16} /> Add Candidate
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} onUpdate={fetchCandidates} />
                ))}
            </div>

            {showAddModal && (
                <AddCandidateModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={fetchCandidates}
                />
            )}
        </motion.div>
    );
};

const CandidateCard = ({ candidate, onUpdate }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="luxury-card p-6 flex flex-col gap-4"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <User size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold">{candidate.full_name}</h3>
                        <p className="text-xs text-text-secondary">{candidate.email}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {candidate.skills?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs">
                        {skill}
                    </span>
                ))}
                {candidate.skills?.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 rounded text-xs">
                        +{candidate.skills.length - 3} more
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Briefcase size={14} />
                <span>{candidate.experience_years || 0} years experience</span>
            </div>
        </motion.div>
    );
};

const AddCandidateModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        experience_years: 0,
        skills: []
    });
    const [skillInput, setSkillInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/candidates/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error creating candidate:', error);
        }
    };

    const addSkill = () => {
        if (skillInput.trim()) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skillInput.trim()]
            });
            setSkillInput('');
        }
    };

    const removeSkill = (index) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((_, idx) => idx !== index)
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="luxury-card p-8 max-w-md w-full mx-4"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add New Candidate</h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.experience_years}
                            onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">
                            Skills
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                                placeholder="Add a skill..."
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
                            >
                                <Check size={16} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-xs flex items-center gap-2">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(idx)}>
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 btn-primary">
                            Add Candidate
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CandidateList;
