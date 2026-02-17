import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CandidateList from '../components/CandidateList';
import ApplicationCard from '../components/ApplicationCard';
import { Users, Briefcase, Filter } from 'lucide-react';

const CandidatesPage = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appsRes, jobsRes, candsRes] = await Promise.all([
                fetch('/api/applications/'),
                fetch('/api/jobs/'),
                fetch('/api/candidates/')
            ]);

            const appsData = await appsRes.json();
            const jobsData = await jobsRes.json();
            const candsData = await candsRes.json();

            setApplications(appsData);
            setJobs(jobsData);
            setCandidates(candsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getJobById = (id) => jobs.find(j => j.id === id);
    const getCandidateById = (id) => candidates.find(c => c.id === id);

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Talent Pool</h2>
                    <p className="text-text-secondary text-sm">Manage candidates and applications</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition ${activeTab === 'all'
                            ? 'border-b-2 border-white text-white'
                            : 'text-text-secondary hover:text-white'
                        }`}
                >
                    <Users size={16} className="inline mr-2" />
                    All Candidates
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition ${activeTab === 'applications'
                            ? 'border-b-2 border-white text-white'
                            : 'text-text-secondary hover:text-white'
                        }`}
                >
                    <Briefcase size={16} className="inline mr-2" />
                    Applications ({applications.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === 'all' && <CandidateList />}

            {activeTab === 'applications' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            job={getJobById(app.job_id)}
                            candidate={getCandidateById(app.candidate_id)}
                        />
                    ))}
                    {applications.length === 0 && (
                        <div className="col-span-full text-center py-20 text-text-secondary">
                            No applications yet
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default CandidatesPage;
