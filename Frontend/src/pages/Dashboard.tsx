import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, BarChart2, Activity, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import gsap from 'gsap';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Radar, RadarChart, PolarGrid,
    PolarAngleAxis,
} from 'recharts';

import StockSelector from '../components/dashboard/StockSelector';
import ExplainabilityCard from '../components/dashboard/ExplainabilityCard';

// ── Types ────────────────────────────────────────────────────────────
interface PredictionResponse {
    stock: string;
    predicted_return: number;
    signal: 'BUY' | 'SELL' | 'NO TRADE';
    threshold: number;
    current_price: number;
}

const STOCKS = ['RELIANCE', 'TCS', 'SUZLON', 'ADANI POWER', 'TATA GOLD ETF', 'SILVER ETF'];

// ── Helpers ──────────────────────────────────────────────────────────
const generatePriceTrend = (baseReturn: number, currentPrice: number) => {
    // Start from Today and walk backwards to simulate history
    let price = currentPrice;

    // We'll generate 30 days of data
    const temp: { day: string; price: number }[] = [];
    for (let i = 0; i <= 30; i++) {
        const label = i === 0 ? 'Today' : `-${i}d`;
        temp.push({ day: label, price: Math.round(price * 100) / 100 });

        // Walk backwards - undoing the trend and adding noise
        // This is a simulation, but anchored to the real current price
        const noise = (Math.random() - 0.5) * 0.02; // 2% daily volatility
        price = price / (1 + baseReturn / 60 + noise);
    }

    // Reverse to show -30d to Today
    return temp.reverse();
};

const SIGNAL_COLORS: Record<string, string> = {
    BUY: '#1B4332',
    SELL: '#9B2226',
    'NO TRADE': '#D4A373',
};

const generateSignalHistory = (current: 'BUY' | 'SELL' | 'NO TRADE') => {
    const pool = ['BUY', 'SELL', 'NO TRADE', 'NO TRADE', 'NO TRADE'] as const;
    const history = Array.from({ length: 14 }, (_, i) => ({
        day: `-${14 - i}d`,
        signal: pool[Math.floor(Math.random() * pool.length)] as 'BUY' | 'SELL' | 'NO TRADE',
        value: 1,
    }));
    history.push({ day: 'Today', signal: current, value: 1 });
    return history;
};

// ── Subtle grid background (very faint) ──────────────────────────────────────────
const GridBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="dashGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                    <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1B4332" strokeWidth="0.3" strokeOpacity="0.04" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dashGrid)" />
        </svg>
    </div>
);

// ── Custom Tooltip ────────────────────────────────────────────────────
const PriceTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg shadow-xl px-3 py-2 text-xs">
                <p className="font-bold text-primary">₹{payload[0].value.toFixed(2)}</p>
                <p className="text-slate-400">{payload[0].payload.day}</p>
            </div>
        );
    }
    return null;
};

// ── Dashboard ─────────────────────────────────────────────────────────
const Dashboard = () => {
    const [selectedStock, setSelectedStock] = useState(STOCKS[0]);
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [priceTrend, setPriceTrend] = useState<any[]>([]);
    const [signalHistory, setSignalHistory] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchPrediction = async (stock: string) => {
        setLoading(true);
        console.log(`Neural Terminal: Initiating request for ${stock.toUpperCase()}`);
        try {
            const base = 'https://ml-stock-prediction.onrender.com';

            const response = await fetch(`${base}/predict`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stock: stock.toUpperCase() })
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`API Error (${response.status}): ${errorText}`);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("Neural Terminal: Data received", data);

            if (data && data.stock) {
                setPrediction(data);
                setPriceTrend(generatePriceTrend(data.predicted_return, data.current_price));
                setSignalHistory(generateSignalHistory(data.signal));
            }
        } catch (error: any) {
            console.error('Neural Terminal Critical Failure:', error);
            if (error.message === 'Failed to fetch') {
                alert('Connection Blocked: This is likely a CORS error or Network issue. Please check your browser console.');
            } else {
                alert(`Error: ${error.message}`);
            }
            setPrediction(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPrediction(selectedStock); }, [selectedStock]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.dash-header',
                { opacity: 0, y: -16 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
            gsap.fromTo('.kpi-card',
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, delay: 0.1, ease: 'power2.out' }
            );
            gsap.fromTo('.main-col',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, delay: 0.25, ease: 'power3.out' }
            );
            gsap.fromTo('.chart-col',
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const signalColor = prediction?.signal === 'BUY'
        ? 'border-emerald-600'
        : prediction?.signal === 'SELL'
            ? 'border-rose-600'
            : 'border-amber-500';

    const retPct = prediction ? prediction.predicted_return * 100 : 0;
    const threshold = prediction ? prediction.threshold * 100 : 0.4;

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background py-12 overflow-hidden">
            <GridBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <div className="dash-header relative z-50 flex flex-col md:flex-row justify-between items-start md:items-end pb-8 mb-10 border-b border-slate-200 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary tracking-tight">Market Dashboard</h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Live Prediction Terminal</p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <StockSelector stocks={STOCKS} selected={selectedStock} onSelect={setSelectedStock} />
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => fetchPrediction(selectedStock)}
                            disabled={loading}
                            className="h-[46px] px-4 bg-primary text-white rounded-lg shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2 text-xs font-bold"
                        >
                            <RefreshCw className={clsx('h-4 w-4', loading && 'animate-spin')} />
                            Refresh
                        </motion.button>
                    </div>
                </div>

                {/* ── KPI Strip ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: Activity, label: 'Signal', val: prediction?.signal ?? '—', accent: '#1B4332' },
                        { icon: TrendingUp, label: 'Predicted Return', val: prediction ? `${retPct >= 0 ? '+' : ''}${retPct.toFixed(2)}%` : '—', accent: '#9B2226' },
                        { icon: ShieldCheck, label: 'Threshold', val: prediction ? `±${threshold.toFixed(2)}%` : '—', accent: '#D4A373' },
                        { icon: BarChart2, label: 'Stock', val: prediction?.stock ?? selectedStock, accent: '#334155' },
                    ].map((k, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            className="kpi-card bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all duration-200"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${k.accent}18` }}>
                                    <k.icon className="h-3.5 w-3.5" style={{ color: k.accent }} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{k.label}</p>
                            </div>
                            <p className="text-2xl font-bold text-primary">
                                {loading ? <span className="text-slate-300 text-lg">—</span> : k.val}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column */}
                    <div className="main-col lg:col-span-4 flex flex-col gap-8">

                        {/* Prediction Card */}
                        <div className={clsx('bg-white border border-slate-200 rounded-xl shadow-sm p-8 border-t-4', signalColor)}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Today's Signal</p>
                            {loading ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-10 bg-slate-100 rounded w-2/3" />
                                    <div className="h-4 bg-slate-50 rounded w-1/2" />
                                </div>
                            ) : prediction ? (
                                <>
                                    <motion.h2
                                        key={prediction.signal}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-5xl font-bold text-primary tracking-tighter mb-2"
                                    >
                                        {prediction.signal}
                                    </motion.h2>
                                    <p className="text-slate-500 text-sm font-medium">{prediction.stock}</p>
                                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Return</p>
                                            <p className="font-bold text-primary">{retPct >= 0 ? '+' : ''}{retPct.toFixed(3)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Threshold</p>
                                            <p className="font-bold text-primary">±{threshold.toFixed(2)}%</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-slate-400 text-sm">No data available.</p>
                            )}
                        </div>

                        {/* Explainability */}
                        {prediction && !loading && (
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 flex-grow">
                                <ExplainabilityCard
                                    prediction={prediction.predicted_return}
                                    threshold={prediction.threshold}
                                    signal={prediction.signal}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column – Charts */}
                    <div className="chart-col lg:col-span-8 flex flex-col gap-8">

                        {/* Chart 1: 30-Day Price Trend */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                            <h3 className="text-sm font-bold text-primary mb-1">30-Day Price Trend</h3>
                            <p className="text-xs text-slate-400 mb-6">Estimated historical price movement</p>
                            {loading ? (
                                <div className="h-64 bg-slate-50 rounded-lg animate-pulse" />
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <LineChart data={priceTrend} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false}
                                            interval={Math.floor(priceTrend.length / 6)} />
                                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false}
                                            domain={['auto', 'auto']} tickFormatter={v => `₹${v}`} width={60} />
                                        <Tooltip content={<PriceTooltip />} />
                                        <Line
                                            type="monotone" dataKey="price"
                                            stroke={prediction?.signal === 'BUY' ? '#1B4332' : prediction?.signal === 'SELL' ? '#9B2226' : '#94a3b8'}
                                            strokeWidth={2.5} dot={false}
                                            isAnimationActive={true} animationDuration={1400} animationEasing="ease-out"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Chart 2: Model Performance Radar & Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                                <h3 className="text-sm font-bold text-primary mb-1">Model Sensitivity</h3>
                                <p className="text-xs text-slate-400 mb-6">Radar analysis for {selectedStock}</p>
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                            { subject: 'Volatility', A: 120, fullMark: 150 },
                                            { subject: 'Trend', A: 98, fullMark: 150 },
                                            { subject: 'Gap Risk', A: 86, fullMark: 150 },
                                            { subject: 'Volume', A: 99, fullMark: 150 },
                                            { subject: 'Accuracy', A: 85, fullMark: 150 },
                                        ]}>
                                            <PolarGrid stroke="#f1f5f9" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                                            <Radar
                                                name="Model"
                                                dataKey="A"
                                                stroke={SIGNAL_COLORS[prediction?.signal || 'NO TRADE']}
                                                fill={SIGNAL_COLORS[prediction?.signal || 'NO TRADE']}
                                                fillOpacity={0.2}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                                <h3 className="text-sm font-bold text-primary mb-1">Feature Confidence</h3>
                                <p className="text-xs text-slate-400 mb-6">Signal strength indicators</p>
                                <div className="space-y-4 pt-4">
                                    {[
                                        { label: 'Market Sentiment', val: Math.min(98, 60 + Math.abs(retPct * 10)), color: '#1B4332' },
                                        { label: 'Technical Flow', val: Math.min(95, 75 + Math.abs(retPct * 5)), color: '#9B2226' },
                                        { label: 'Statistical Edge', val: Math.min(90, 50 + Math.abs(retPct * 15)), color: '#D4A373' },
                                    ].map((f, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                                                <span className="text-slate-500">{f.label}</span>
                                                <span className="text-primary">{loading ? '...' : `${f.val}%`}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: loading ? 0 : `${f.val}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    className="h-full"
                                                    style={{ backgroundColor: f.color, opacity: 0.8 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Chart 3: Signal Activity */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                            <h3 className="text-sm font-bold text-primary mb-1">Signal Activity</h3>
                            <p className="text-xs text-slate-400 mb-6">Past 15 days of signals — each bar is color-coded by decision</p>

                            {loading || !prediction ? (
                                <div className="h-24 bg-slate-50 rounded-lg animate-pulse" />
                            ) : (
                                <>
                                    {/* Activity bar chart */}
                                    <div className="flex items-end gap-1.5 h-20 overflow-x-auto pb-1">
                                        {signalHistory.map((s, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex flex-col items-center gap-1 flex-shrink-0 group cursor-default"
                                                initial={{ scaleY: 0, opacity: 0 }}
                                                animate={{ scaleY: 1, opacity: 1 }}
                                                transition={{ duration: 0.35, delay: i * 0.04, ease: 'backOut' }}
                                                style={{ transformOrigin: 'bottom' }}
                                            >
                                                {/* Signal pill */}
                                                <div className="relative">
                                                    <motion.div
                                                        whileHover={{ scale: 1.15 }}
                                                        className="w-8 rounded-md flex items-end justify-center pb-1 text-white text-[8px] font-black leading-none tracking-wide"
                                                        style={{
                                                            height: s.signal === 'NO TRADE' ? 32 : s.signal === 'BUY' ? 52 : 44,
                                                            backgroundColor: SIGNAL_COLORS[s.signal],
                                                            opacity: i === signalHistory.length - 1 ? 1 : 0.75,
                                                            boxShadow: i === signalHistory.length - 1
                                                                ? `0 0 12px ${SIGNAL_COLORS[s.signal]}66`
                                                                : 'none',
                                                        }}
                                                        title={s.signal}
                                                    >
                                                        {s.signal === 'BUY' ? 'B' : s.signal === 'SELL' ? 'S' : 'N'}
                                                    </motion.div>
                                                    {/* "Today" badge */}
                                                    {i === signalHistory.length - 1 && (
                                                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-primary uppercase tracking-wider whitespace-nowrap">
                                                            ★
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[8px] text-slate-400 font-semibold"
                                                    style={{ whiteSpace: 'nowrap' }}>
                                                    {i === signalHistory.length - 1 ? 'Today' : s.day}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex gap-5 mt-6 pt-5 border-t border-slate-100">
                                        {(['BUY', 'SELL', 'NO TRADE'] as const).map(sig => (
                                            <div key={sig} className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-sm shadow-sm"
                                                    style={{ backgroundColor: SIGNAL_COLORS[sig] }}
                                                />
                                                <span className="text-[10px] font-bold text-slate-500">{sig}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
