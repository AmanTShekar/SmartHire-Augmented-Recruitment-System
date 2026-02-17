import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Brain, Mic, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const InterviewAnalysis = ({ analysis }) => {
    if (!analysis) {
        return (
            <div className="luxury-card p-8 text-center">
                <AlertCircle size={48} className="mx-auto mb-4 text-text-secondary" />
                <p className="text-text-secondary">No analysis available yet</p>
            </div>
        );
    }

    const { behavioral_score, technical_score, transcript, overall_feedback } = analysis;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
        >
            {/* Overall Score */}
            <div className="luxury-card p-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-6">
                    Overall Assessment
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <ScoreCircle
                        label="Technical Score"
                        score={technical_score || 0}
                        icon={<Brain size={24} />}
                    />
                    <ScoreCircle
                        label="Behavioral Score"
                        score={behavioral_score?.overall || 0}
                        icon={<Eye size={24} />}
                    />
                </div>
            </div>

            {/* Behavioral Metrics */}
            {behavioral_score && (
                <div className="luxury-card p-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-6">
                        Behavioral Analysis
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <MetricBar
                            label="Eye Contact"
                            value={behavioral_score.eye_contact || 0}
                        />
                        <MetricBar
                            label="Confidence"
                            value={behavioral_score.confidence || 0}
                        />
                        <MetricBar
                            label="Engagement"
                            value={behavioral_score.engagement || 0}
                        />
                        <MetricBar
                            label="Stress Level"
                            value={behavioral_score.stress_level || 0}
                            inverse
                        />
                    </div>
                </div>
            )}

            {/* Transcript */}
            {transcript && (
                <div className="luxury-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Mic size={20} className="text-text-secondary" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                            Interview Transcript
                        </h3>
                    </div>
                    <div className="bg-white/5 rounded-lg p-6 max-h-96 overflow-y-auto">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {transcript.text || 'No transcript available'}
                        </p>
                    </div>
                    {transcript.language && (
                        <p className="text-xs text-text-secondary mt-3">
                            Language: {transcript.language} • Confidence: {(transcript.confidence * 100).toFixed(1)}%
                        </p>
                    )}
                </div>
            )}

            {/* Overall Feedback */}
            {overall_feedback && (
                <div className="luxury-card p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle size={20} className="text-green-400" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                            AI Recommendation
                        </h3>
                    </div>
                    <p className="text-sm leading-relaxed">
                        {overall_feedback}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

const ScoreCircle = ({ label, score, icon }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-white/10"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - score / 100)}`}
                        className={`${getScoreColor(score)} transition-all duration-1000`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {icon}
                    <span className={`text-2xl font-bold mt-1 ${getScoreColor(score)}`}>
                        {score}
                    </span>
                </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                {label}
            </span>
        </div>
    );
};

const MetricBar = ({ label, value, inverse = false }) => {
    const getColor = (val) => {
        if (inverse) {
            if (val <= 30) return 'bg-green-400';
            if (val <= 60) return 'bg-yellow-400';
            return 'bg-red-400';
        } else {
            if (val >= 70) return 'bg-green-400';
            if (val >= 40) return 'bg-yellow-400';
            return 'bg-red-400';
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-sm font-bold">{value}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getColor(value)} transition-all duration-1000`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
};

export default InterviewAnalysis;
