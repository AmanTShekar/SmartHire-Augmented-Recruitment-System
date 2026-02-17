import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Video, Plus, Activity, Filter } from 'lucide-react';

const Dashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-12 pb-20"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
                    <p className="text-text-secondary text-sm">Real-time status of active hiring channels.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={16} /> Post Position
                </button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <StatBox label="Neural Matches" value="1,284" />
                <StatBox label="Active Jobs" value="12" />
                <StatBox label="Live Interviews" value="05" />
                <StatBox label="Score" value="98.4%" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="luxury-card p-6 min-h-300">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Pipeline</h3>
                    <div className="flex flex-col gap-4">
                        <TableRow name="Sarah Chen" role="Cloud Architect" score={98} />
                        <TableRow name="Alex Rivera" role="AI Engineer" score={94} />
                    </div>
                </div>
                <div className="luxury-card p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Activity</h3>
                    <div className="flex flex-col gap-6">
                        <ActivityItem time="Now" text="Evaluation complete for Xenon-01" />
                        <ActivityItem time="15m" text="New high-rank application" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StatBox = ({ label, value }) => (
    <div className="luxury-card p-8 flex flex-col gap-4">
        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</div>
        <div className="text-3xl font-bold">{value}</div>
    </div>
);

const TableRow = ({ name, role, score }) => (
    <div className="flex justify-between items-center p-3 border rounded-lg">
        <div>
            <div className="font-bold text-sm">{name}</div>
            <div className="text-xs text-text-secondary">{role}</div>
        </div>
        <div className="text-lg font-bold">{score}%</div>
    </div>
);

const ActivityItem = ({ time, text }) => (
    <div className="flex gap-4 text-sm">
        <div className="text-text-secondary font-bold text-[10px]">{time}</div>
        <div className="text-text-primary">{text}</div>
    </div>
);

export default Dashboard;
