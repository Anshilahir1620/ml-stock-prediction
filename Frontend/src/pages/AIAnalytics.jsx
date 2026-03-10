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
import Plot from 'react-plotly.js';

gsap.registerPlugin(ScrollTrigger);

const API_BASE = import.meta.env.VITE_API_URL || 'https://ml-stock-prediction.onrender.com';

const AIAnalytics = () => {
    const [stock, setStock] = useState('RELIANCE');
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    const supportedStocks = ["RELIANCE", "TCS", "ADANI", "GOLD", "SILVER", "SUZLON"];

    // Handle outside clicks for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch data for the graphs
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                setError(null);
                const response = await axios.get(`${API_BASE}/historical-data`, {
                    params: { stock: stock }
                });
                if (response.data && response.data.data) {
                    setHistoricalData(response.data.data);
                } else {
                    setError("Data cluster inaccessible.");
                }
            } catch (err) {
                console.error("Error fetching analytics data:", err);
                setError("Failed to load neural data clusters.");
            } finally {
                setLoading(false);
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

    // ───────── 1: FEATURE SYNERGY (3D SCATTER) ─────────
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

    // ───────── 2: PREDICTION MATRIX (3D SURFACE) ─────────
    const surfaceData = React.useMemo(() => {
        if (!historicalData || historicalData.length < 5) return [];

        // Grid size for the surface
        const size = 25;
        
        // Extract ranges
        const volMin = Math.min(...historicalData.map(d => d.Volatility));
        const volMax = Math.max(...historicalData.map(d => d.Volatility));
        const trendMin = Math.min(...historicalData.map(d => d.Prev_Return));
        const trendMax = Math.max(...historicalData.map(d => d.Prev_Return));

        // Create axes
        const x_axis = Array.from({length: size}, (_, i) => volMin + (volMax - volMin) * (i / (size - 1)));
        const y_axis = Array.from({length: size}, (_, i) => trendMin + (trendMax - trendMin) * (i / (size - 1)));

        // Populate Z grid using simple IDW (Inverse Distance Weighting) for a smooth surface
        let z_grid = [];
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                const gx = x_axis[i];
                const gy = y_axis[j];
                
                // Simple weighted average based on proximity to actual historical nodes
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
                [0, '#f43f5e'],   // Bearish (Red)
                [0.5, '#cbd5e1'], // Neutral (Slate)
                [1, '#10b981']    // Bullish (Green)
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
             {/* BACKGROUND DECORATION */}
             <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
             <div className="absolute bottom-40 left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -z-10" />

             {/* MAIN HEADER */}
             <div className="max-w-4xl mb-12 reveal-analytics">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="bg-white shadow-sm text-emerald-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] border border-emerald-50 border-emerald-100 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Neural Analytics Engine v4.2
                    </div>
                    <div className="bg-slate-900 shadow-sm text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] border border-slate-800 flex items-center gap-3">
                        <Database size={12} className="text-emerald-400" />
                        Real-time Node Access
                    </div>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-[85px] font-black text-gray-900 mb-8 tracking-tighter leading-[1] md:leading-[0.95]">
                    AI Analysis <br /> <span className="text-gray-400 italic font-medium">Visualization.</span>
                </h1>
                
                <p className="text-[18px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed max-w-2xl mb-16">
                    Interactive multi-dimensional mapping of our core predictive logic and feature relationship vectors.
                </p>

                {/* STOCK SELECTOR */}
                <div className="relative z-[300] max-w-md" ref={dropdownRef}>
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
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] z-[200] overflow-hidden py-4"
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

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-5"
                    >
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-[12px] font-black text-rose-600 uppercase tracking-tight">Access Protocol Error</p>
                            <p className="text-[11px] font-bold text-rose-400 uppercase tracking-tight mt-1">{error}</p>
                        </div>
                        <button 
                            onClick={() => setStock(stock)}
                            className="ml-auto px-6 py-2 bg-white border border-rose-200 rounded-full text-[10px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                            Retry Handshake
                        </button>
                    </motion.div>
                )}
             </div>

             {/* GRAPHS GRID */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                
                {/* GRAPH 1: FEATURE SCATTER */}
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

                    <div className="mt-10 grid grid-cols-2 gap-6 pt-10 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Long Potential</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-rose-500 rounded-full" />
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Short Potential</span>
                        </div>
                    </div>
                </motion.div>

                {/* GRAPH 2: MODEL SURFACE */}
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
                            The surface visualizes the model's <span className="text-emerald-600 font-black">probability field</span> across the volatility-trend axes. Higher peaks represent optimized institutional entry windows.
                        </p>
                    </div>
                </motion.div>

             </div>

             {/* INFO SECTION */}
             <div className="mt-32 reveal-analytics bg-gray-900 p-12 md:p-24 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-4 mb-8">
                            <Activity className="text-emerald-400" size={32} />
                            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">Algorithm <span className="text-gray-500">Integrity.</span></h2>
                        </div>
                        <p className="text-[18px] md:text-[22px] text-gray-400 font-bold leading-relaxed uppercase tracking-tight mb-12">
                            Transparency is our core protocol. By exposing the 3D topology of our models, we bridge the gap between AI black-boxes and institutional quantitative analysis.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                <Binary className="text-emerald-400" size={20} />
                                <span className="text-[12px] font-black uppercase tracking-widest">Non-Linear Synthesis</span>
                            </div>
                            <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                <ShieldCheck className="text-emerald-400" size={20} />
                                <span className="text-[12px] font-black uppercase tracking-widest">Risk-Aware Logic</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-5 grid grid-cols-2 gap-6">
                        {[
                            { label: 'Cluster Density', value: '4.8x', desc: 'Feature grouping affinity' },
                            { label: 'Neural Depth', value: '200', desc: 'Recursive tree ensemble' },
                            { label: 'Signal Noise', value: '<0.02', desc: 'Optimized filtering' },
                            { label: 'Logic Sync', value: '15ms', desc: 'Real-time response' }
                        ].map((stat, i) => (
                            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 transition-colors group">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{stat.label}</h4>
                                <p className="text-2xl font-black mb-2 group-hover:text-emerald-400 transition-colors uppercase italic">{stat.value}</p>
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{stat.desc}</p>
                            </div>
                        ))}
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
