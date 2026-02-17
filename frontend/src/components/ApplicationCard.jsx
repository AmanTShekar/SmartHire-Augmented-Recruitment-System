import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Calendar, TrendingUp } from 'lucide-react';

const ApplicationCard = ({ application, job, candidate }) => {
    const getStatusColor = (status) => {
        const colors = {
            'applied': 'bg-blue-500/20 text-blue-400',
            'screening': 'bg-yellow-500/20 text-yellow-400',
            'interview': 'bg-purple-500/20 text-purple-400',
            'offer': 'bg-green-500/20 text-green-400',
            'rejected': 'bg-red-500/20 text-red-400'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="luxury-card p-6 flex flex-col gap-4"
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <User size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold">{candidate?.full_name || 'Unknown Candidate'}</h3>
                        <p className="text-xs text-text-secondary">{candidate?.email}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusColor(application.status)}`}>
                    {application.status}
                </span>
            </div>

            {/* Job Info */}
            <div className="flex items-center gap-2 text-sm">
                <Briefcase size={14} className="text-text-secondary" />
                <span className="text-text-secondary">Applied for:</span>
                <span className="font-semibold">{job?.title || 'Unknown Position'}</span>
            </div>

            {/* Match Score */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-text-secondary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                        Match Score
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden w-32">
                        <div
                            className={`h-full ${getScoreColor(application.match_score || 0)} bg-current transition-all`}
                            style={{ width: `${application.match_score || 0}%` }}
                        />
                    </div>
                    <span className={`text-xl font-bold ${getScoreColor(application.match_score || 0)}`}>
                        {application.match_score || 0}%
                    </span>
                </div>
            </div>

            {/* Skills Match */}
            {candidate?.skills && (
                <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs">
                            {skill}
                        </span>
                    ))}
                    {candidate.skills.length > 4 && (
                        <span className="px-2 py-1 bg-white/5 rounded text-xs text-text-secondary">
                            +{candidate.skills.length - 4} more
                        </span>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-2">
                <button className="flex-1 btn-secondary text-xs">
                    View Profile
                </button>
                <button className="flex-1 btn-primary text-xs">
                    Schedule Interview
                </button>
            </div>
        </motion.div>
    );
};

export default ApplicationCard;
