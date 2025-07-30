import React from 'react';
import BottomNavbar from '../BottomNavbar/BottomNavbar';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
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
};

export default Layout;
