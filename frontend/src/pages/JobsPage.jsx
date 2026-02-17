import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JobPostingForm from '../components/JobPostingForm';
import { Briefcase, Plus, Users, TrendingUp } from 'lucide-react';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showJobForm, setShowJobForm] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch('/api/jobs/');
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading jobs...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Open Positions</h2>
                    <p className="text-text-secondary text-sm">Manage job postings and track applications</p>
                </div>
                <button
                    onClick={() => setShowJobForm(true)}
                    className="btn-primary"
                >
                    <Plus size={16} /> Post Position
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
                {jobs.length === 0 && (
                    <div className="col-span-full text-center py-20 text-text-secondary">
                        No job postings yet. Create your first position!
                    </div>
                )}
            </div>

            {showJobForm && (
                <JobPostingForm
                    onClose={() => setShowJobForm(false)}
                    onSuccess={fetchJobs}
                />
            )}
        </motion.div>
    );
};

const JobCard = ({ job }) => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, [job.id]);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`/api/jobs/${job.id}/applications`);
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="luxury-card p-6 flex flex-col gap-4"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{job.title}</h3>
                        <p className="text-xs text-text-secondary">
                            {job.is_active ? 'Active' : 'Closed'}
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-sm text-text-secondary line-clamp-3">
                {job.description}
            </p>

            {/* Requirements */}
            <div className="flex flex-wrap gap-2">
                {job.requirements?.slice(0, 3).map((req, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs">
                        {req}
                    </span>
                ))}
                {job.requirements?.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-text-secondary">
                        +{job.requirements.length - 3} more
                    </span>
                )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-text-secondary" />
                    <span className="font-semibold">{applications.length}</span>
                    <span className="text-text-secondary">Applications</span>
                </div>
                <button className="btn-secondary text-xs">
                    View Details
                </button>
            </div>
        </motion.div>
    );
};

export default JobsPage;
