import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SystemRedirect = () => {
    const navigate = useNavigate();
    const { role, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate('/auth');
            } else {
                const target = role === 'admin' ? '/admin' : role === 'company' ? '/company' : '/candidate';
                navigate(target);
            }
        }
    }, [isAuthenticated, role, navigate, loading]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin" />
        </div>
    );
};

export default SystemRedirect;
