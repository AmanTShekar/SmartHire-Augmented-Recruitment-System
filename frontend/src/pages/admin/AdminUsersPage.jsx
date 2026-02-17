import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, User, Shield, Building2, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminUsersPage = () => {
    const { authFetch } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [toggling, setToggling] = useState(null);

    useEffect(() => { loadUsers(); }, [roleFilter]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (roleFilter) params.set('role', roleFilter);
            if (search) params.set('search', search);
            const data = await authFetch(`/admin/users?${params.toString()}`);
            setUsers(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const toggleUser = async (userId) => {
        setToggling(userId);
        try {
            await authFetch(`/admin/users/${userId}/toggle`, { method: 'PUT' });
            loadUsers();
        } catch (e) { console.error(e); }
        setToggling(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadUsers();
    };

    const roleIcons = {
        candidate: <User size={12} />,
        company: <Building2 size={12} />,
        admin: <Shield size={12} />,
    };

    const roleBadges = {
        candidate: 'badge-blue',
        company: 'badge-purple',
        admin: 'badge-red',
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">User Management</h1>
                <p className="text-text-muted text-sm">View and manage all platform users</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search size={16} className="absolute left-4 top-1/2 text-text-muted" style={{ transform: 'translateY(-50%)' }} />
                    <input
                        className="form-input" style={{ paddingLeft: '40px' }}
                        placeholder="Search by name or email..."
                        value={search} onChange={e => setSearch(e.target.value)}
                    />
                </form>
                <select className="form-input w-auto" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="candidate">Candidates</option>
                    <option value="company">Companies</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="luxury-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.08]">
                                <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">User</th>
                                <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Role</th>
                                <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Joined</th>
                                <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}><td colSpan={5} className="p-4"><div className="skeleton h-8" /></td></tr>
                                ))
                            ) : users.map((u, i) => (
                                <motion.tr
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                {roleIcons[u.role] || <User size={12} />}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{u.full_name || 'Unnamed'}</div>
                                                <div className="text-xs text-text-muted">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`badge ${roleBadges[u.role] || 'badge-neutral'} flex items-center gap-1 w-fit`}>
                                            {roleIcons[u.role]} {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-text-muted">
                                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1 text-xs ${u.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                                            {u.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleUser(u.id)}
                                            disabled={toggling === u.id}
                                            className={`p-1.5 rounded transition cursor-pointer ${u.is_active ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-green-500/10 text-green-400'
                                                }`}
                                            title={u.is_active ? 'Disable' : 'Enable'}
                                        >
                                            {u.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && users.length === 0 && (
                    <div className="p-10 text-center">
                        <Users size={32} className="mx-auto text-text-muted mb-4" />
                        <p className="text-text-secondary text-sm">No users found</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminUsersPage;
