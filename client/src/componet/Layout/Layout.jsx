import React from 'react';
import BottomNavbar from '../BottomNavbar/BottomNavbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {children}
      </main>
      <BottomNavbar />
    </div>
  );
};

export default Layout;
