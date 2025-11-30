'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                try {
                    // Optional: Decode token or fetch user profile
                    // const payload = JSON.parse(atob(token.split('.')[1]));
                    // setUser({ id: payload.id });
                } catch (e) {
                    console.warn('Could not decode token');
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = (token, userData = null) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        router.push('/login');
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
