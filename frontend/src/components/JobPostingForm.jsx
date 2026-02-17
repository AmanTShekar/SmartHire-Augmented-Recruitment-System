import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, X, Plus } from 'lucide-react';

const JobPostingForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: [],
        recruiter_id: 1 // TODO: Get from auth context
    });
    const [requirementInput, setRequirementInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/jobs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            console.error('Error creating job:', error);
        }
    };

    const addRequirement = () => {
        if (requirementInput.trim()) {
            setFormData({
                ...formData,
                requirements: [...formData.requirements, requirementInput.trim()]
            });
            setRequirementInput('');
        }
    };

    const removeRequirement = (index) => {
        setFormData({
            ...formData,
            requirements: formData.requirements.filter((_, idx) => idx !== index)
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="luxury-card p-8 max-w-2xl w-full mx-4 my-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Briefcase size={24} />
                        <h3 className="text-xl font-bold">Post New Position</h3>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">
                            Job Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-lg"
                            placeholder="e.g. Senior Full Stack Engineer"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">
                            Job Description
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 resize-none"
                            placeholder="Describe the role, responsibilities, and what makes this position unique..."
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">
                            Requirements
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={requirementInput}
                                onChange={(e) => setRequirementInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                                placeholder="Add a requirement (e.g. Python, 5+ years experience)..."
                            />
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 flex items-center gap-2"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {formData.requirements.map((req, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                                    <span className="text-sm">{req}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(idx)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 btn-primary">
                            <Briefcase size={16} /> Post Position
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default JobPostingForm;
