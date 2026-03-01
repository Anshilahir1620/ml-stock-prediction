import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    TrendingUp, Info, PieChart, Home, Menu, X,
    ArrowRight, GitBranch, Cpu, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Mapping existing routes to requested professional names
    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={22} /> },
        { name: 'How It Works', path: '/how-it-works', icon: <Info size={22} /> },
        { name: 'Project Workflow', path: '/how-it-works', icon: <GitBranch size={22} /> },
        { name: 'Prediction / Models', path: '/predict', icon: <Cpu size={22} /> },
        { name: 'About', path: '/about', icon: <PieChart size={22} /> },
        { name: 'Contact', path: 'mailto:anshilchotara@gmail.com', icon: <MessageSquare size={22} />, isExternal: true },
    ];

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Optional: prevent scroll jump for better UX
            const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollWidth}px`;
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0px';
        }
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0px';
        };
    }, [isOpen]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 md:px-24 py-4 flex justify-between items-center h-20">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 font-bold text-lg tracking-tight text-gray-900 z-[110]">
                <div className="bg-gray-900 p-1.5 rounded-lg shadow-lg">
                    <TrendingUp size={18} className="text-white" />
                </div>
                <span className="uppercase text-[15px] font-black tracking-tighter">Stockton <span className="text-gray-400 font-medium">Hub</span></span>
            </NavLink>

            {/* Desktop Navigation (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-10">
                {navItems.filter(item => ['Home', 'How It Works', 'Prediction / Models', 'About'].includes(item.name)).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 hover:text-gray-900 ${isActive ? 'text-gray-900' : 'text-gray-400'
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>

            {/* Mobile Toggle Button (Visible only on <= 768px) */}
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hidden lg:block bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Live Terminal</span>

                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden z-[110] w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-900 transition-all active:scale-90 border border-gray-100"
                    aria-label="Open Navigation"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* 100% Full-Screen Mobile Overlay Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 bg-[#0a0a0a] z-[9999] md:hidden overflow-y-auto"
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
                        onClick={() => setIsOpen(false)}
                    >
                        {/* THE GRID Background Overlay */}
                        <div className="fixed inset-0 opacity-[0.05] pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                        {/* Soft Glow Accents */}
                        <div className="fixed top-[-20%] right-[-20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                        <div className="fixed bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />

                        {/* Top Header Section (Fixed inside Scrollable Overlay) */}
                        <div className="sticky top-0 left-0 right-0 p-8 flex justify-between items-center w-full z-[10000] bg-[#0a0a0a]/80 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 p-1.5 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <TrendingUp size={20} className="text-white" />
                                </div>
                                <span className="text-white font-black uppercase tracking-tighter text-sm">Stockton Navigation</span>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90 hover:bg-white/10"
                                aria-label="Close Navigation"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        {/* Centered Navigation Links with Scroll Padding */}
                        <div
                            className="relative z-[50] flex flex-col items-center px-8 pt-8 pb-32 min-h-[calc(100vh-100px)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full max-w-sm flex flex-col gap-4 mt-8">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.8em] text-center mb-8 opacity-40 italic">System Directory</p>

                                {navItems.map((item, idx) => {
                                    const isExternal = item.isExternal;
                                    const isActive = !isExternal && location.pathname === item.path;

                                    return (
                                        <motion.div
                                            key={`${item.name}-${idx}`}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            {isExternal ? (
                                                <a
                                                    href={item.path}
                                                    className="flex items-center gap-6 py-4 px-7 rounded-[2rem] transition-all duration-500 group relative border border-white/0 hover:border-white/10 hover:bg-white/5"
                                                >
                                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-white transition-colors duration-500">
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[24px] font-black uppercase tracking-tight text-gray-400 group-hover:text-white transition-colors duration-500">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-1">
                                                            Outgoing Link
                                                        </span>
                                                    </div>
                                                </a>
                                            ) : (
                                                <NavLink
                                                    to={item.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-6 py-4 px-7 rounded-[2rem] transition-all duration-500 group relative border ${isActive ? 'bg-white/5 border-white/10' : 'border-white/0 hover:border-white/10 hover:bg-white/5'}`
                                                    }
                                                >
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className={`text-[24px] font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-1">
                                                            {isActive ? 'Current Node' : 'Initialize Session'}
                                                        </span>
                                                    </div>
                                                    {isActive && (
                                                        <ArrowRight size={20} className="ml-auto text-emerald-500" />
                                                    )}
                                                </NavLink>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Bottom Status Info */}
                            <div className="text-center w-full flex flex-col items-center gap-6 mt-16 pb-12">
                                <div className="h-[1px] w-24 bg-white/10" />
                                <div className="flex items-center gap-4 bg-emerald-500/10 px-6 py-3 rounded-full border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.5em]">System: Operational.Hub v4.2</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
