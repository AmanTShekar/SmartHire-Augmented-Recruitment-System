import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Users, Briefcase, BarChart3, Activity, TrendingUp, FileText, Clock, User } from 'lucide-react';

const AdminDashboard = () => {
    const { authFetch } = useAuth();
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsData, activityData] = await Promise.all([
                authFetch('/admin/stats'),
                authFetch('/admin/activity'),
            ]);
            setStats(statsData);
            setActivity(activityData);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="skeleton h-12 w-64" />
                <div className="grid grid-cols-3 gap-6">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-28" />)}</div>
            </div>
        );
    }

    const statCards = stats ? [
        { label: 'Total Users', value: stats.total_users, icon: <Users size={20} />, color: 'text-blue-400' },
        { label: 'Candidates', value: stats.total_candidates, icon: <User size={20} />, color: 'text-green-400' },
        { label: 'Companies', value: stats.total_companies, icon: <Briefcase size={20} />, color: 'text-purple-400' },
        { label: 'Active Jobs', value: stats.total_jobs, icon: <FileText size={20} />, color: 'text-yellow-400' },
        { label: 'Applications', value: stats.total_applications, icon: <TrendingUp size={20} />, color: 'text-cyan-400' },
        { label: 'Interviews', value: stats.total_interviews, icon: <BarChart3 size={20} />, color: 'text-pink-400' },
    ] : [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Overview</h1>
                <p className="text-text-muted text-sm">Platform-wide statistics and activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="luxury-card p-6"
                    >
                        <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Activity Feed */}
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Activity size={14} /> Recent Activity
                </h2>
                <div className="luxury-card divide-y divide-white/[0.06]">
                    {activity.length === 0 ? (
                        <div className="p-8 text-center text-text-muted text-sm">No recent activity</div>
                    ) : (
                        activity.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="p-4 flex items-center gap-4"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.type === 'user_registered' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                                    }`}>
                                    {item.type === 'user_registered' ? <User size={14} /> : <FileText size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm">{item.message}</div>
                                    <div className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1">
                                        <Clock size={10} />
                                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recently'}
                                    </div>
                                </div>
                                <span className={`badge ${item.type === 'user_registered' ? 'badge-blue' : 'badge-green'} text-[8px]`}>
                                    {item.type === 'user_registered' ? 'User' : 'App'}
                                </span>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
