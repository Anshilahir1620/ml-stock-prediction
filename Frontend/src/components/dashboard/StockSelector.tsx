import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart2, Check, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

interface StockSelectorProps {
    stocks: string[];
    selected: string;
    onSelect: (stock: string) => void;
}

const StockSelector: React.FC<StockSelectorProps> = ({ stocks, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (stock: string) => {
        onSelect(stock);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ backgroundColor: '#F8F9FA' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center justify-between w-full md:w-64 px-4 py-3 bg-white border rounded-md shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-slate-400",
                    isOpen ? "border-slate-400" : "border-slate-200"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 text-slate-600 rounded">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="label-subtle leading-none mb-1">Market Segment</span>
                        <span className="text-sm font-bold text-primary leading-none">
                            {selected}
                            <span className="text-slate-400 font-medium ml-0.5">
                                ({['GOLD', 'SILVER'].includes(selected) ? 'MCX' : 'NSE'})
                            </span>
                        </span>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden"
                    >
                        <div className="p-2 bg-slate-50 border-b border-slate-100">
                            <span className="label-subtle px-1">Active Listings</span>
                        </div>
                        <ul className="py-1">
                            {stocks.map((stock) => {
                                const isSelected = stock === selected;
                                return (
                                    <li key={stock}>
                                        <button
                                            onClick={() => handleSelect(stock)}
                                            className={clsx(
                                                "w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors",
                                                isSelected ? "text-primary bg-slate-50" : "text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <BarChart2 className={clsx("h-4 w-4", isSelected ? "text-slate-900" : "text-slate-400")} />
                                                <span>
                                                    {stock}
                                                    <span className="text-slate-400 font-normal ml-1">
                                                        {['GOLD', 'SILVER'].includes(stock) ? 'MCX' : 'NSE'}
                                                    </span>
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <Check className="h-4 w-4 text-slate-900" />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StockSelector;
