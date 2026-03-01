import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, Info, PieChart, Home } from 'lucide-react';

const Navbar = () => {
    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={16} /> },
        { name: 'Predict', path: '/predict', icon: <TrendingUp size={16} /> },
        { name: 'How It Works', path: '/how-it-works', icon: <Info size={16} /> },
        { name: 'About', path: '/about', icon: <PieChart size={16} /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 md:px-24 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 font-bold text-lg tracking-tight text-gray-900">
                <div className="bg-gray-900 p-1.5 rounded-lg">
                    <TrendingUp size={18} className="text-white" />
                </div>
                <span>Market <span className="text-gray-500 font-medium">Dashboard</span></span>
            </div>

            <div className="hidden md:flex items-center gap-10">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-gray-900 ${isActive ? 'text-gray-900' : 'text-gray-400'
                            }`
                        }
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter hidden sm:block">Live Prediction Terminal</span>
                <button className="md:hidden text-gray-900">
                    <TrendingUp size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
