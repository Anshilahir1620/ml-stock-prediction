import { Link } from 'react-router-dom';
import { Terminal, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="p-1.5 bg-primary text-white rounded">
                                <Terminal className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tighter text-primary uppercase">
                                Decision Intelligence
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-12">
                        <Link to="/" className="text-slate-500 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Home</Link>
                        <Link to="/dashboard" className="text-slate-500 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Terminal</Link>
                        <Link to="/how-it-works" className="text-slate-500 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Methodology</Link>
                        <Link to="/about" className="text-slate-500 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Legal</Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-primary hover:bg-slate-50 p-2 rounded-md transition-colors">
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 shadow-xl">
                    <div className="px-4 pt-4 pb-6 space-y-4">
                        <Link onClick={toggleMenu} to="/" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary">Home</Link>
                        <Link onClick={toggleMenu} to="/dashboard" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary">Terminal</Link>
                        <Link onClick={toggleMenu} to="/how-it-works" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary">Methodology</Link>
                        <Link onClick={toggleMenu} to="/about" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary">Legal</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

