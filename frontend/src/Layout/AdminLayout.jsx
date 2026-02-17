import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Server, Shield, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const links = [
        { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Overview', exact: true },
        { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
        { to: '/admin/system', icon: <Server size={18} />, label: 'System' },
    ];

    const isActive = (link) => {
        if (link.exact) return location.pathname === link.to;
        return location.pathname.startsWith(link.to);
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            <div className="noise-overlay" />

            <aside className="w-64 border-r flex flex-col bg-soft z-50">
                <div className="h-20 flex items-center px-8 border-b">
                    <Link to="/" className="font-bold tracking-tighter text-lg uppercase">SmartHire</Link>
                </div>
                <div className="px-6 py-4 border-b">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                        <Shield size={12} /> Admin
                    </div>
                    <div className="text-sm font-semibold truncate">{user?.full_name || 'Administrator'}</div>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-1">
                    {links.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive(link) ? 'bg-white/5 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition w-full cursor-pointer"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 border-b flex items-center justify-between px-10 bg-black z-40">
                    <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Admin Control</div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">System Online</span>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-10 relative custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
