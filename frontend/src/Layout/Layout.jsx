import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Video, Settings, LogOut, User } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            <div className="noise-overlay" />

            <aside className="w-64 border-r flex flex-col bg-soft z-50">
                <div className="h-20 flex items-center px-8 border-b">
                    <span className="font-bold tracking-tighter text-lg uppercase">SmartHire</span>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-1">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" active={location.pathname === '/dashboard'} />
                    <SidebarLink to="/candidates" icon={<Users size={18} />} label="Candidates" />
                    <SidebarLink to="/interviews" icon={<Video size={18} />} label="Interviews" />
                </nav>
                <div className="p-4 border-t">
                    <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
                    <SidebarLink to="/" icon={<LogOut size={18} />} label="Sign Out" />
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 border-b flex items-center justify-between px-10 bg-black z-40">
                    <div className="text-sm font-bold opacity-40 uppercase tracking-widest">System Ready</div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-sm font-semibold">Admin Oracle</div>
                        </div>
                        <div className="w-10 h-10 luxury-card flex items-center justify-center bg-white">
                            <User size={18} className="text-black" />
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-12 relative custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const SidebarLink = ({ to, icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${active ? 'bg-white/5 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
        {icon}
        <span>{label}</span>
    </Link>
);

export default Layout;
