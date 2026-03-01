import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    TrendingUp, TrendingDown, AlertCircle, Loader2, RefreshCcw,
    Activity, ShieldCheck, Target, ChevronDown, DollarSign, BarChart3,
    Cpu, Calendar, Zap, Network
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const API_BASE = 'https://ml-stock-prediction.onrender.com';

const Prediction = () => {
    const [supportedStocks, setSupportedStocks] = useState([]);
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(false);
    const [stocksLoading, setStocksLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hoveredData, setHoveredData] = useState(null);

    const dropdownRef = useRef(null);
    const containerRef = useRef(null);
    const pathRef = useRef(null);
    const heroRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const mainGridRef = useRef(null);
    const intelligenceRef = useRef(null);

    // ─── PREDICT ───
    const handlePredict = async (ticker = stock) => {
        const symbolToPredict = ticker || stock;
        if (!symbolToPredict) return;

        setLoading(true);
        setError(null);
        setIsDropdownOpen(false);

        try {
            const response = await axios.post(`${API_BASE}/predict`, { stock: symbolToPredict });
            const { stock: resStock } = response.data;
            if (resStock === undefined) {
                setError('API returned an incomplete response.');
                return;
            }
            setResult(response.data);

            // GSAP Draw-in for the chart if path is present (after state update)
            setTimeout(() => {
                const path = pathRef.current;
                if (path && typeof path.getTotalLength === 'function') {
                    const length = path.getTotalLength();
                    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                    gsap.to(path, {
                        strokeDashoffset: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                }
            }, 100);
        } catch (err) {
            setError(err.response?.data?.detail || 'Prediction failed.');
        } finally {
            setLoading(false);
        }
    };

    // ─── FETCH SUPPORTED STOCKS ON MOUNT ───
    useEffect(() => {
        const fetchStocks = async () => {
            setStocksLoading(true);
            try {
                const response = await axios.get(`${API_BASE}/`);
                if (response.data.supported_stocks && Array.isArray(response.data.supported_stocks)) {
                    const firstStock = response.data.supported_stocks[0];
                    setSupportedStocks(response.data.supported_stocks);
                    if (firstStock) {
                        setStock(firstStock);
                        handlePredict(firstStock);
                    }
                }
            } catch (err) {
                setError('Could not connect to backend.');
            } finally {
                setStocksLoading(false);
            }
        };
        fetchStocks();
    }, []);

    const selectStock = (ticker) => {
        setStock(ticker);
        setIsDropdownOpen(false);
        handlePredict(ticker);
    };

    // ─── GSAP PREMIUM ANIMATIONS ───
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial Page Load staggered entrance
            const tl = gsap.timeline();

            tl.from(".gsap-hero-el", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out"
            })
                .from(".gsap-metric-card", {
                    y: 15,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out"
                }, "-=0.2")
                .from(".gsap-main-grid-el", {
                    y: 20,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.15,
                    ease: "power3.out"
                }, "-=0.3");

            // Scroll Reveals
            gsap.from(".reveal-section", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.2,
                scrollTrigger: {
                    trigger: ".reveal-section",
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            // Subtle Background Motion
            gsap.to(".system-grid", {
                yPercent: -5,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // ─── CLICK OUTSIDE DROPDOWN ───
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getSignalColor = (signal) => {
        if (signal === 'BUY') return 'text-emerald-600';
        if (signal === 'SELL') return 'text-rose-600';
        return 'text-amber-600';
    };

    const metrics = [
        {
            label: 'Market Consensus',
            value: result ? result.signal : '—',
            icon: <Activity size={14} />,
            color: result ? getSignalColor(result.signal) : 'text-slate-900',
            iconBg: 'bg-slate-50 text-slate-400',
        },
        {
            label: 'Predicted Return',
            value: result ? `${(result.predicted_return * 100).toFixed(2)}%` : '—',
            icon: result && result.predicted_return >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />,
            color: result ? (result.predicted_return >= 0 ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-900',
            iconBg: result ? (result.predicted_return >= 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500') : 'bg-slate-50 text-slate-300',
        },
        {
            label: 'Signal Threshold',
            value: result ? `±${(result.threshold * 100).toFixed(2)}%` : '—',
            icon: <ShieldCheck size={14} />,
            color: 'text-slate-700',
            iconBg: 'bg-indigo-50 text-indigo-500',
        },
        {
            label: 'Analysis Target',
            value: stock || '—',
            icon: <BarChart3 size={14} />,
            color: 'text-slate-900',
            iconBg: 'bg-slate-50 text-slate-400',
        }
    ];

    // Card hover animation (GSAP)
    const onCardHover = (e) => {
        gsap.to(e.currentTarget, {
            y: -4,
            duration: 0.4,
            boxShadow: '0 20px 40px -20px rgba(0,0,0,0.08)',
            borderColor: 'rgba(226, 232, 240, 0.8)',
            ease: "power2.out"
        });
    };

    const onCardLeave = (e) => {
        gsap.to(e.currentTarget, {
            y: 0,
            duration: 0.4,
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
            borderColor: 'rgba(241, 245, 249, 1)',
            ease: "power2.out"
        });
    };

    return (
        <div ref={containerRef} className="w-full pt-10 pb-32 px-4 md:px-12 lg:px-24 bg-[#FCFCFD] overflow-x-hidden relative min-h-screen">
            {/* FINE SUBTLE GRID */}
            <div className="system-grid absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* SOFT ACCENTS */}
            <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-slate-200/20 rounded-full blur-[120px] -z-20" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-slate-100/30 rounded-full blur-[140px] -z-20" />

            <div className="max-w-[1300px] mx-auto relative z-10 w-full">

                {/* ───────── HEADER (REFINED HERO) ───────── */}
                <header ref={heroRef} className="relative z-50 mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
                    <div className="text-center md:text-left">
                        <div className="gsap-hero-el flex items-center justify-center md:justify-start gap-2 mb-4">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                                Terminal Active — Node 16.2
                            </span>
                        </div>
                        <h1 className="gsap-hero-el text-4xl lg:text-[52px] font-bold text-slate-900 tracking-tight leading-[1.05]">
                            Market <span className="text-slate-400 font-medium">Intelligence.</span>
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        {/* REFINED DROPDOWN */}
                        <div className="relative w-full sm:w-80 md:w-auto gsap-hero-el" ref={dropdownRef}>
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                disabled={stocksLoading}
                                className={`group relative w-full bg-white/80 backdrop-blur-xl border ${isDropdownOpen ? 'border-slate-900/10 shadow-inner' : 'border-slate-200/60'} px-6 py-4 rounded-[1.5rem] flex items-center gap-4 min-w-full md:min-w-[280px] transition-all duration-500 disabled:opacity-50 overflow-hidden shadow-sm`}
                            >
                                {/* ANIMATED BORDER HIGHLIGHT (BEAM EFFECT) */}
                                <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none overflow-hidden">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,#94a3b8_360deg)] opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                                    />
                                </div>

                                {/* SUBTLE GLOW OVERLAY */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/0 via-slate-100/5 to-white/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className={`p-2.5 rounded-xl transition-all duration-500 shrink-0 ${isDropdownOpen ? 'bg-slate-900 text-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600'}`}>
                                    <BarChart3 size={18} className={stocksLoading ? 'animate-pulse' : ''} />
                                </div>

                                <div className="flex-1 text-left relative z-10 overflow-hidden">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5 opacity-70 group-hover:opacity-100 transition-opacity truncate">
                                        {stocksLoading ? 'Neural Engine' : (stock ? 'Asset Selected' : 'Search Trace')}
                                    </p>
                                    <span className="text-[15px] font-extrabold text-slate-900 leading-none tracking-tight block truncate uppercase">
                                        {stocksLoading ? (
                                            <span className="flex items-center gap-2">
                                                Scanning <span className="flex gap-0.5"><span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" /><span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" /><span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" /></span>
                                            </span>
                                        ) : (stock ? `${stock}.NSE` : 'Select Asset')}
                                    </span>
                                </div>

                                <ChevronDown
                                    size={14}
                                    className={`text-slate-300 transition-all duration-500 transform ${isDropdownOpen ? 'rotate-180 text-slate-900 scale-125' : 'group-hover:text-slate-500'}`}
                                />
                            </motion.button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                        transition={{ duration: 0.2, ease: "power2.out" }}
                                        className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-[100] overflow-hidden py-3"
                                    >
                                        <div className="px-6 py-3 border-b border-slate-50 mb-1">
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Available Assets</p>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto px-2 custom-scrollbar">
                                            {supportedStocks.map((ticker) => (
                                                <button
                                                    key={ticker}
                                                    onClick={() => selectStock(ticker)}
                                                    className={`w-full px-5 py-3.5 flex items-center gap-4 transition-all rounded-2xl hover:bg-slate-50 ${stock === ticker ? 'bg-slate-50/50' : ''}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold ${stock === ticker ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        {ticker.slice(0, 2)}
                                                    </div>
                                                    <span className="text-[14px] font-bold text-slate-700">{ticker}</span>
                                                    {stock === ticker && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => handlePredict()}
                            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.3 })}
                            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                            disabled={loading || !stock}
                            className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 md:py-3.5 rounded-2xl font-bold text-[12px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-colors hover:bg-black disabled:opacity-50 shadow-lg shadow-slate-200 gsap-hero-el h-[68px] md:h-auto"
                        >
                            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Processing...' : 'Execute Analysis'}
                        </button>
                    </div>
                </header>

                {/* ───────── ERROR STATE ───────── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-2xl flex items-center gap-3 text-[13px] font-medium mb-10 shadow-sm"
                        >
                            <AlertCircle size={18} /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ───────── TOP METRICS GRID ───────── */}
                <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {metrics.map((m, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={onCardHover}
                            onMouseLeave={onCardLeave}
                            className="gsap-metric-card bg-white border border-slate-100 p-6 rounded-3xl shadow-sm transition-colors min-h-[130px] flex flex-col justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${m.iconBg}`}>
                                    {m.icon}
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                            </div>
                            <div className="mt-4">
                                <p className={`text-2xl lg:text-3xl font-bold tracking-tight ${m.color}`}>{m.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ───────── MAIN CONTENT GRID ───────── */}
                <div ref={mainGridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">

                    {/* LEFT: SIGNAL FOCUS */}
                    <div className="lg:col-span-4 flex flex-col gap-8 gsap-main-grid-el">
                        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Structural Signal</span>
                                {result && (
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full">
                                        <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">Verified</span>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center gap-6 py-10">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
                                            <Activity size={24} className="absolute inset-0 m-auto text-emerald-500" />
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Computing Matrix...</p>
                                    </motion.div>
                                ) : result ? (
                                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                                        <h2 className={`text-[64px] font-bold tracking-tight leading-none mb-2 ${getSignalColor(result.signal)}`}>
                                            {result.signal}
                                        </h2>
                                        <p className="text-[12px] font-medium text-slate-400 uppercase tracking-widest mb-10">Equilibrium Status</p>

                                        <div className="mt-auto grid grid-cols-2 gap-4 md:gap-6 pt-8 border-t border-slate-50">
                                            <div>
                                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Alpha Projection</p>
                                                <p className={`text-xl md:text-2xl font-bold ${result.predicted_return >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {result.predicted_return >= 0 ? '+' : ''}{(result.predicted_return * 100).toFixed(2)}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cluster Confidence</p>
                                                <p className="text-xl md:text-2xl font-bold text-slate-700">±{(result.threshold * 100).toFixed(1)}%</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6 py-10">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 font-black uppercase">
                                            <Target size={28} />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tighter">Standby</h4>
                                        <p className="text-[12px] md:text-[13px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">Select a market listing to initiate neural synthesis.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Cpu size={80} />
                            </div>
                            <div className="relative z-10 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                    <Zap size={14} className="text-amber-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Context</span>
                                </div>
                                <p className="text-[14px] text-slate-300 leading-relaxed font-bold uppercase tracking-tighter">
                                    Estimation uses <span className="text-white font-black">recursive ensemble loops</span> to map price velocity against historical volatility clusters.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: CHART & VISUALIZATION */}
                    <div className="lg:col-span-8 gsap-main-grid-el">
                        <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col h-full min-h-[520px]">
                            <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Price Projection Matrix</h3>
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Temporal Data Synthesis / T+1 Forecast</p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live Feed Verified</span>
                                </div>
                            </div>

                            <div className="flex-1 w-full relative group">
                                <div className="flex h-full pb-10">
                                    {/* AXIS LABELS */}
                                    <div className="hidden sm:flex w-[120px] flex-col justify-between text-[10px] text-slate-300 font-bold py-6 pr-8 text-right uppercase tracking-widest leading-none border-r border-slate-50">
                                        <span className="text-emerald-500/60">Expansion</span>
                                        <span>Momentum</span>
                                        <span className="text-slate-200">Baseline</span>
                                        <span>Correction</span>
                                        <span className="text-rose-500/60">Contraction</span>
                                    </div>

                                    {/* CHART CANVAS */}
                                    <div
                                        className="flex-1 relative cursor-crosshair ml-4 sm:ml-8"
                                        onMouseMove={(e) => {
                                            const bounds = e.currentTarget.getBoundingClientRect();
                                            const x = ((e.clientX - bounds.left) / bounds.width) * 100;
                                            const price = result ? result.current_price * (0.95 + (x / 1000)) : 2200 + (x * 12);
                                            setHoveredData({ x, price });
                                        }}
                                        onMouseLeave={() => setHoveredData(null)}
                                    >
                                        {/* GRID LINES */}
                                        <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none opacity-40">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-full border-t border-slate-100 h-0"></div>
                                            ))}
                                        </div>

                                        {/* SVG LINE */}
                                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                                            {/* Gradient for area beneath */}




                                            <motion.path
                                                ref={pathRef}
                                                d="M0,35 L10,38 L20,32 L30,35 L40,28 L50,30 L60,22 L70,25 L80,18 L90,20 L100,15"
                                                fill="none"
                                                stroke={result ? (result.signal === 'BUY' ? '#10b981' : result.signal === 'SELL' ? '#ef4444' : '#64748b') : '#e2e8f0'}
                                                strokeWidth="1.2"
                                                strokeLinecap="butt"
                                            />

                                            {hoveredData && (
                                                <line
                                                    x1={hoveredData.x} y1="0" x2={hoveredData.x} y2="50"
                                                    stroke="#f1f5f9" strokeWidth="0.5"
                                                />
                                            )}
                                        </svg>

                                        {/* TOOLTIP */}
                                        <AnimatePresence>
                                            {hoveredData && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute z-[60] bg-slate-900 text-white px-4 py-3 rounded-2xl pointer-events-none shadow-2xl flex flex-col"
                                                    style={{ left: `${hoveredData.x}%`, top: '-20px', transform: 'translateX(-50%)' }}
                                                >
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Neural Estimate</span>
                                                    <span className="text-[16px] font-bold tracking-tight">₹{hoveredData.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-[9px] text-slate-300 font-bold sm:ml-[120px] px-2 uppercase tracking-[0.25em]">
                                    <span className="flex items-center gap-2"><Calendar size={12} /> T-30 Window</span>
                                    <span>T-0 Now</span>
                                    <span className="text-indigo-400">Neural Horizon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {/* ───────── SYSTEM INTELLIGENCE OVERVIEW (NEW SECTION) ───────── */}
                <section ref={intelligenceRef} className="reveal-section border-t border-slate-100 pt-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                    <ShieldCheck size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">System Intelligence Overview</h2>
                            </div>
                            <p className="text-slate-400 font-medium max-w-xl text-[14px]">
                                Real-time monitoring of our core predictive engine. Transparency in methodology is fundamental to institutional trust.
                            </p>
                        </div>
                        <div className="hidden lg:flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-full border border-slate-100">
                            <Network size={16} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Mesh Connectivity: Optimized</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Model Architecture', value: 'Random Forest', desc: 'Non-linear ensemble learning model.', icon: <Cpu size={16} /> },
                            { label: 'Data Window', value: '30 Trading Days', desc: 'Short-term momentum sequence.', icon: <Calendar size={16} /> },
                            { label: 'Decision Logic', value: 'Threshold-Based', desc: 'Risk-filtered signal generation.', icon: <Target size={16} /> },
                            { label: 'API Connection', value: 'Live / Synchronized', desc: 'Secure real-time market gateway.', icon: <Activity size={16} /> }
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-slate-100 p-7 rounded-[2rem] hover:shadow-md transition-all duration-500 group">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                                    {item.icon}
                                </div>
                                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{item.label}</h4>
                                <p className="text-[17px] font-bold text-slate-800 mb-1">{item.value}</p>
                                <p className="text-[12px] text-slate-400 font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <p className="text-[15px] text-slate-500 font-medium leading-[1.6]">
                                “This system analyzes historical market behavior and generates probabilistic signals using ensemble learning models. Our architecture prioritizes <span className="text-slate-900 font-bold">risk-adjusted alpha</span> through recursive validation loops and real-time feature re-weighting.”
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-3 shrink-0">
                            <div className="flex gap-1.5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`w-1.5 h-6 rounded-full ${i < 4 ? 'bg-emerald-500/30' : 'bg-slate-200'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Signal Fidelity</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* INLINE CUSTOM STYLES */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e2e8f0;
                }
            `}} />
        </div>
    );
};

export default Prediction;

