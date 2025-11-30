'use client';
import React from 'react';
import BottomNavbar from '@/components/BottomNavbar/BottomNavbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="print:hidden bg-white shadow-sm border-b p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">CRM System</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    Logout
                </button>
            </div>
            <main className="pb-20">
                {children}
            </main>
            <BottomNavbar />
        </div>
    );
}
