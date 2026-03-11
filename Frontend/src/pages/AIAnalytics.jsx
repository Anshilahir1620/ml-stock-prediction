import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    Zap, Activity, Cpu, Box, Maximize2, RotateCcw, 
    TrendingUp, BarChart3, Binary, ShieldCheck, 
    LayoutGrid, Target, Info, Loader2, ChevronDown, CheckCircle2,
    Database, Network, AlertCircle
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { useLoading } from '../context/LoadingContext';
import { useData } from '../context/DataContext';

const Plot = createPlotlyComponent(Plotly);

gsap.registerPlugin(ScrollTrigger);

const API_BASE = import.meta.env.VITE_API_URL || 'https://ml-stock-prediction.onrender.com';

const AIAnalytics = () => {
    const [stock, setStock] = useState('RELIANCE');
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setIsLoading } = useLoading();
    const { getAnalytics, updateAnalytics } = useData();
    const [isRevalidating, setIsRevalidating] = useState(false);
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    const supportedStocks = ["RELIANCE", "TCS", "ADANI", "GOLD", "SILVER", "SUZLON"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const startTime = Date.now();
            const cached = getAnalytics(stock);
            const hasValidCache = !!cached;

            if (hasValidCache) {
                setHistoricalData(cached.data);
                setIsRevalidating(true);
            } else {
                setLoading(true);
                setIsLoading(true);
            }

            const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
            const now = Date.now();
            const shouldFetch = !hasValidCache || (now - cached.timestamp > EXPIRY_TIME);

            if (!shouldFetch) {
                setLoading(false);
                setIsLoading(false);
                return;
            }

            try {
                setError(null);
                setWarning(null);
                const freshData = await updateAnalytics(stock);
                if (freshData) {
                    setHistoricalData(freshData);
                } else {
                    if (hasValidCache) {
                        setWarning('Live data temporarily unavailable. Showing last updated data.');
                    } else {
                        setError("Data cluster inaccessible. Please try again later.");
                    }
                }
            } catch (err) {
                console.error("Error fetching analytics data:", err);
                if (hasValidCache) {
                    setWarning('Live data temporarily unavailable. Showing last updated data.');
                } else {
                    setError("Failed to load neural data clusters.");
                }
            } finally {
                const minDuration = 2100;
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, minDuration - elapsed);

                setTimeout(() => {
                    setLoading(false);
                    setIsLoading(false);
                    setTimeout(() => setIsRevalidating(false), 2000);
                    setTimeout(() => setWarning(null), 5000);
                }, hasValidCache ? 0 : remaining);
            }
        };
        fetchData();
    }, [stock]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".reveal-analytics", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".reveal-analytics",
                    start: "top 90%",
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const scatterData = React.useMemo(() => {
        if (!historicalData || historicalData.length === 0) return [];
        
        const buyPoints = historicalData.filter(d => d.Signal === 'BUY');
        const sellPoints = historicalData.filter(d => d.Signal === 'SELL');

        return [
            {
                x: buyPoints.map(d => d.Daily_Return),
                y: buyPoints.map(d => d.Gap),
                z: buyPoints.map(d => d.High_Low_Range),
                text: buyPoints.map(d => `${d.Date}<br>Signal: BUY`),
                mode: 'markers',
                name: 'BULLISH NODE',
                marker: {
                    size: 8,
                    color: '#10b981',
                    opacity: 0.9,
                    symbol: 'circle',
                    line: { color: 'rgba(255, 255, 255, 0.4)', width: 0.5 }
                },
                type: 'scatter3d',
                hovertemplate: '<b>%{text}</b><br>Daily Return: %{x:.4f}<br>Gap: %{y:.4f}<br>Range: %{z:.4f}<extra></extra>'
            },
            {
                x: sellPoints.map(d => d.Daily_Return),
                y: sellPoints.map(d => d.Gap),
                z: sellPoints.map(d => d.High_Low_Range),
                text: sellPoints.map(d => `${d.Date}<br>Signal: SELL`),
                mode: 'markers',
                name: 'BEARISH NODE',
                marker: {
                    size: 8,
                    color: '#f43f5e',
                    opacity: 0.9,
                    symbol: 'circle',
                    line: { color: 'rgba(255, 255, 255, 0.4)', width: 0.5 }
                },
                type: 'scatter3d',
                hovertemplate: '<b>%{text}</b><br>Daily Return: %{x:.4f}<br>Gap: %{y:.4f}<br>Range: %{z:.4f}<extra></extra>'
            }
        ];
    }, [historicalData]);

    const surfaceData = React.useMemo(() => {
        if (!historicalData || historicalData.length < 5) return [];

        const size = 25;
        
        const volMin = Math.min(...historicalData.map(d => d.Volatility));
        const volMax = Math.max(...historicalData.map(d => d.Volatility));
        const trendMin = Math.min(...historicalData.map(d => d.Prev_Return));
        const trendMax = Math.max(...historicalData.map(d => d.Prev_Return));

        const x_axis = Array.from({length: size}, (_, i) => volMin + (volMax - volMin) * (i / (size - 1)));
        const y_axis = Array.from({length: size}, (_, i) => trendMin + (trendMax - trendMin) * (i / (size - 1)));

        let z_grid = [];
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                const gx = x_axis[i];
                const gy = y_axis[j];
                
                let numerator = 0;
                let denominator = 0;
                historicalData.forEach(p => {
                    const dist = Math.sqrt(Math.pow(gx - p.Volatility, 2) + Math.pow(gy - p.Prev_Return, 2));
                    const weight = 1 / (Math.pow(dist, 2) + 0.0001);
                    numerator += p.Tomorrow_Return * weight;
                    denominator += weight;
                });
                row.push(numerator / denominator);
            }
            z_grid.push(row);
        }

        return [{
            z: z_grid,
            x: x_axis,
            y: y_axis,
            type: 'surface',
            colorscale: [
                [0, '#f43f5e'],
                [0.5, '#cbd5e1'],
                [1, '#10b981']
            ],
            showscale: false,
            name: 'Prediction Model Field',
            opacity: 0.9,
            lighting: {
                ambient: 0.6,
                diffuse: 0.8,
                specular: 0.5,
                roughness: 0.2
            },
            contours: {
                z: { show: true, usecolormap: true, highlightcolor: "#fff", project: { z: true } }
            }
        }];
    }, [historicalData]);

    const commonLayout = (title) => ({
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { l: 0, r: 0, b: 0, t: 30 },
        scene: {
            xaxis: { 
                title: { text: 'VOLATILITY', font: { size: 9, color: '#94a3b8', weight: 'bold' } }, 
                gridcolor: '#f1f5f9', zerolinecolor: '#e2e8f0', backgroundcolor: 'rgba(255,255,255,0)',
                showbackground: false
            },
            yaxis: { 
                title: { text: 'TREND', font: { size: 9, color: '#94a3b8', weight: 'bold' } }, 
                gridcolor: '#f1f5f9', zerolinecolor: '#e2e8f0', backgroundcolor: 'rgba(255,255,255,0)',
                showbackground: false
            },
            zaxis: { 
                title: { text: 'RETURN', font: { size: 9, color: '#94a3b8', weight: 'bold' } }, 
                gridcolor: '#f1f5f9', zerolinecolor: '#e2e8f0', backgroundcolor: 'rgba(255,255,255,0)',
                showbackground: false
            },
            camera: {
                eye: { x: 1.6, y: 1.6, z: 1.2 },
                center: { x: 0, y: 0, z: -0.1 }
            },
            dragmode: 'orbit'
        },
        legend: { 
            x: 0, y: 1, 
            font: { size: 10, color: '#64748b' },
            bgcolor: 'rgba(255,255,255,0.5)',
            bordercolor: 'rgba(0,0,0,0.05)',
            borderwidth: 1
        },
        font: { family: 'Inter, sans-serif' },
        autosize: true
    });

    return (
        <div ref={containerRef} className="w-full pt-32 pb-48 px-6 md:px-24 bg-[#FCFCFD] overflow-x-hidden relative min-h-screen">
             <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
             <div className="absolute bottom-40 left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -z-10" />

             <div className="flex flex-col lg:flex-row items-center justify-between mb-24 gap-12 reveal-analytics relative z-[100] !overflow-visible">
                <div className="max-w-4xl">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        {isRevalidating ? (
                            <div className="bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] border border-emerald-400 flex items-center gap-3 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                Syncing Neural Node...
                            </div>
                        ) : (
                            <div className="bg-white shadow-sm text-emerald-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] border border-emerald-50 border-emerald-100 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Neural Analytics Engine v4.2
                            </div>
                        )}
                        <div className="bg-slate-900 shadow-sm text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] border border-slate-800 flex items-center gap-3">
                            <Database size={12} className="text-emerald-400" />
                            Real-time Node Access
                        </div>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-[85px] font-black text-gray-900 mb-8 tracking-tighter leading-[1] md:leading-[0.95]">
                        AI Analysis <br /> <span className="text-gray-400 italic font-medium">Visualization.</span>
                    </h1>
                    
                    <p className="text-[18px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed max-w-2xl">
                        Interactive multi-dimensional mapping of our core predictive logic and feature relationship vectors.
                    </p>
                </div>

                <div className="relative w-full lg:w-[450px] h-[350px] flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-colors duration-1000" />
                    
                    <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-2xl">
                        <motion.circle 
                            cx="100" cy="100" r="80" 
                            stroke="rgba(16, 185, 129, 0.1)" 
                            strokeWidth="0.5" fill="none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.ellipse 
                            cx="100" cy="100" rx="90" ry="40" 
                            stroke="rgba(16, 185, 129, 0.2)" 
                            strokeWidth="1" fill="none"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        {[...Array(15)].map((_, i) => (
                            <motion.circle
                                key={i}
                                r="1.5"
                                fill="#10b981"
                                animate={{
                                    cx: [100 + Math.cos(i) * 70, 100 + Math.cos(i + 1.5) * 70, 100 + Math.cos(i + 3) * 70, 100 + Math.cos(i) * 70],
                                    cy: [100 + Math.sin(i * 2) * 40, 100 + Math.sin(i * 2.5) * 40, 100 + Math.sin(i * 2) * 40],
                                    opacity: [0.2, 0.8, 0.2]
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                        <motion.g
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <circle cx="100" cy="100" r="28" fill="#0f172a" stroke="#10b981" strokeWidth="2" className="shadow-lg" />
                            <motion.path 
                                d="M90 100 L110 100 M100 90 L100 110" 
                                stroke="#10b981" strokeWidth="2" strokeLinecap="round"
                                animate={{ rotate: 90 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.circle 
                                cx="100" cy="100" r="14" 
                                fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 4"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.g>
                    </svg>

                    <div className="absolute top-4 right-4 text-right">
                        <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Status</div>
                        <div className="text-[10px] font-black text-gray-900 tracking-tighter uppercase mb-3">Live Synthesis</div>
                        <div className="flex gap-1 justify-end">
                            {[...Array(5)].map((_, i) => (
                                <motion.div 
                                    key={i} 
                                    className="w-1 h-3 bg-emerald-500/20 rounded-full"
                                    animate={{ height: [4, 12, 4], opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
             </div>

                <div className="relative z-[300] max-w-md !overflow-visible" ref={dropdownRef}>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-3 italic">
                        <Network size={14} className="text-emerald-500" />
                        Target Asset Stream
                    </div>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full group px-8 py-6 flex items-center justify-between border transition-all duration-500 rounded-[2rem] shadow-sm ${isDropdownOpen ? 'bg-white border-slate-900 ring-4 ring-slate-50' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[13px] font-black transition-all duration-700 ${isDropdownOpen ? 'bg-slate-900 text-white rotate-[360deg] scale-110 shadow-xl' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-md'}`}>
                                {stock.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[18px] font-black text-slate-900 tracking-tight uppercase">{stock}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Data Stream</span>
                            </div>
                        </div>
                        <ChevronDown size={20} className={`text-slate-300 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-slate-900' : 'group-hover:text-slate-500'}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                             <motion.div
                                key="stock-selector-dropdown"
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] z-[500] overflow-hidden py-4"
                            >
                                <div className="px-8 py-4 border-b border-slate-50 mb-2">
                                    <div className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                        Available Assets
                                    </div>
                                </div>
                                <div 
                                    className="max-h-[320px] overflow-y-auto px-4 custom-scrollbar" 
                                    data-lenis-prevent
                                >
                                    {supportedStocks.map((ticker) => (
                                        <button
                                            key={ticker}
                                            onClick={() => {
                                                setStock(ticker);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full px-5 py-4 flex items-center gap-5 transition-all rounded-[1.5rem] hover:bg-slate-50 group/item ${stock === ticker ? 'bg-slate-50/70 border border-slate-100/50 shadow-sm' : 'border border-transparent'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[12px] font-black transition-all duration-300 ${stock === ticker ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover/item:scale-110 group-hover/item:bg-white group-hover/item:shadow-md'}`}>
                                                {ticker.slice(0, 2)}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className={`text-[15px] font-bold ${stock === ticker ? 'text-slate-900' : 'text-slate-600 group-hover/item:text-slate-900'}`}>
                                                    {ticker}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">National Stock Exchange</span>
                                            </div>
                                            {stock === ticker && (
                                                <div className="ml-auto flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {(error || warning) && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`mt-8 p-6 ${error ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'} border rounded-[2rem] flex items-center gap-5 shadow-sm`}
                        >
                            <div className={`w-10 h-10 ${error ? 'bg-rose-500' : 'bg-amber-500'} rounded-xl flex items-center justify-center text-white`}>
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className={`text-[12px] font-black ${error ? 'text-rose-600' : 'text-amber-600'} uppercase tracking-tight`}>
                                    {error ? 'Access Protocol Error' : 'System Notice'}
                                </p>
                                <p className={`text-[11px] font-bold ${error ? 'text-rose-400' : 'text-amber-500'} uppercase tracking-tight mt-1`}>
                                    {error || warning}
                                </p>
                            </div>
                            <button 
                                onClick={() => setStock(stock)}
                                className={`ml-auto px-6 py-2 bg-white border ${error ? 'border-rose-200 text-rose-600 hover:bg-rose-500 hover:text-white' : 'border-amber-200 text-amber-600 hover:bg-amber-500 hover:text-white'} rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm`}
                            >
                                Retry Handshake
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 relative z-0">
                
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="reveal-analytics bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <Maximize2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Feature Synergy</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3D Scatter Projection</p>
                            </div>
                        </div>
                        <RotateCcw className="text-gray-200 group-hover:rotate-180 transition-transform duration-1000 cursor-help" size={20} />
                    </div>

                    <div className="aspect-square w-full rounded-[2rem] bg-gray-50/50 border border-gray-100 overflow-hidden relative">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-emerald-500" size={32} />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculating Clusters...</span>
                            </div>
                        ) : (
                            <Plot
                                data={scatterData}
                                layout={{
                                    ...commonLayout("Feature synergy"),
                                    scene: {
                                        ...commonLayout("").scene,
                                        xaxis: { ...commonLayout("").scene.xaxis, title: 'DAILY RETURN' },
                                        yaxis: { ...commonLayout("").scene.yaxis, title: 'GAP' },
                                        zaxis: { ...commonLayout("").scene.zaxis, title: 'RANGE' }
                                    }
                                }}
                                useResizeHandler={true}
                                className="w-full h-full"
                                config={{ displayModeBar: false }}
                            />
                        )}
                    </div>

                    <div className="mt-10 pt-10 border-t border-gray-50">
                        <p className="text-[13px] text-gray-400 font-bold leading-relaxed uppercase tracking-tight mb-6">
                            This scatter plot shows "Data Clusters." Each dot is a moment in time where the AI recognized a specific price pattern.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Growth Zone (Long)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                <span className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Risk Zone (Short)</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -5 }}
                    className="reveal-analytics bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Model Prediction Matrix</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3D Surface Estimation</p>
                            </div>
                        </div>
                        <Zap className="text-emerald-500 animate-pulse" size={20} />
                    </div>

                    <div className="aspect-square w-full rounded-[2rem] bg-gray-50/50 border border-gray-100 overflow-hidden relative">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-emerald-500" size={32} />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generating Neural Surface...</span>
                            </div>
                        ) : surfaceData.length > 0 ? (
                            <Plot
                                data={surfaceData}
                                layout={{
                                    ...commonLayout("Model Prediction Surface"),
                                    scene: {
                                        ...commonLayout("").scene,
                                        xaxis: { ...commonLayout("").scene.xaxis, title: 'VOLATILITY' },
                                        yaxis: { ...commonLayout("").scene.yaxis, title: 'TREND' },
                                        zaxis: { ...commonLayout("").scene.zaxis, title: 'EST. RETURN' }
                                    }
                                }}
                                useResizeHandler={true}
                                className="w-full h-full"
                                config={{ displayModeBar: false }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                                <Info className="text-gray-300" size={32} />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Insufficient data clusters for neural mapping</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 pt-10 border-t border-gray-50">
                        <p className="text-[13px] text-gray-400 font-bold leading-relaxed uppercase tracking-tight">
                            Think of this as an <span className="text-emerald-600 font-black">AI Weather Map</span>. High green peaks show where the market is stable and likely to go up. Deep valleys show where the market is chaotic and risky. It helps you see the safest "path" for the stock price.
                        </p>
                    </div>
                </motion.div>

             </div>

             <div className="mt-20 reveal-analytics bg-gray-900 p-10 md:p-16 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                            <Activity className="text-emerald-400" size={24} />
                            <h2 className="text-2xl md:text-[42px] font-black italic tracking-tighter uppercase leading-[0.9]">Visualizing <br /><span className="text-gray-500">ML Topology.</span></h2>
                        </div>
                        <p className="text-[13px] md:text-[15px] text-gray-400 font-bold leading-relaxed uppercase tracking-tight mb-8">
                            Our AI scanning engine processes thousands of data points to find hidden patterns in the market. We use 3D visualization to show exactly how the model makes decisions, mapping complex price movements into simple, actionable visual signals.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                                <Binary className="text-emerald-400" size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">3D Scatter Synergy</span>
                            </div>
                            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                                <ShieldCheck className="text-emerald-400" size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Neural Surface Topology</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-emerald-500/50 transition-all duration-500 group">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Zap size={20} />
                                </div>
                                <h4 className="text-[14px] font-black text-white uppercase tracking-widest leading-none">AI Market Patterns</h4>
                             </div>
                             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed">
                                 The <span className="text-white">Pattern Recognition</span> plot shows how the AI identifies "Bullish" (green) and "Bearish" (red) clusters. By mapping <span className="text-emerald-400">Daily Returns</span> against <span className="text-emerald-400">Price Gaps</span>, it visualizes exactly where institutional money is likely moving, helping you spot high-probability entry points.
                             </p>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-indigo-500/50 transition-all duration-500 group">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <Cpu size={20} />
                                </div>
                                <h4 className="text-[14px] font-black text-white uppercase tracking-widest leading-none">Risk & Confidence Map</h4>
                             </div>
                             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed">
                                 The <span className="text-white">Confidence Surface</span> acts as a market "weather report." High peaks show where the model has the most certainty about a trend, while deep valleys highlight high-risk zones. It maps <span className="text-indigo-400">Volatility</span> against the <span className="text-indigo-400">Trend</span> to show you where the market is stable enough for smart trading.
                             </p>
                        </div>
                    </div>
                </div>
             </div>

             <style dangerouslySetInnerHTML={{ __html: `
                .js-plotly-plot .plotly .modebar {
                    display: none !important;
                }
             `}} />
        </div>
    );
};

export default AIAnalytics;
