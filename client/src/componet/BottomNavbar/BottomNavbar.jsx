import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, FileText } from 'lucide-react';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/dashboard',
      id: 'home'
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/all-customers',
      id: 'customers'
    },
    {
      icon: FileText,
      label: 'Challans',
      path: '/all-challan',
      id: 'challans'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg h-[50px] z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-0 flex-1 transition-colors duration-200 ${
                active 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon 
                size={24} 
                className={`mb-1 ${active ? 'text-blue-600' : 'text-gray-600'}`} 
              />
              <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
