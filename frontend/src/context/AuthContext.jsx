import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('smarthire_token'));
    const [loading, setLoading] = useState(true);

    // On mount, check for existing token and load user
    useEffect(() => {
        const savedToken = localStorage.getItem('smarthire_token');
        const savedUser = localStorage.getItem('smarthire_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Login failed');
        }

        const data = await res.json();
        localStorage.setItem('smarthire_token', data.access_token);
        localStorage.setItem('smarthire_user', JSON.stringify(data.user));
        setToken(data.access_token);
        setUser(data.user);
        return data.user;
    };

    const register = async ({ email, password, full_name, role, company_name, industry }) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name, role, company_name, industry }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Registration failed');
        }

        const data = await res.json();
        localStorage.setItem('smarthire_token', data.access_token);
        localStorage.setItem('smarthire_user', JSON.stringify(data.user));
        setToken(data.access_token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('smarthire_token');
        localStorage.removeItem('smarthire_user');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                localStorage.setItem('smarthire_user', JSON.stringify(data.user));
            }
        } catch {
            // Silently fail
        }
    };

    const updateProfile = async (updates) => {
        const res = await fetch(`${API_BASE}/auth/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Update failed');
        }

        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('smarthire_user', JSON.stringify(data.user));
        return data.user;
    };

    // Authenticated fetch helper
    const authFetch = async (endpoint, options = {}) => {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });

        if (res.status === 401) {
            logout();
            throw new Error('Session expired');
        }

        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(err.detail || 'Request failed');
        }

        return res.json();
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role: user?.role || null,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        authFetch,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
