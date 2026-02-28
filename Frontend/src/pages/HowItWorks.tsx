import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Filter, TreePine, AlertCircle, BarChart2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Animated ticker-tape background
const TickerBackground = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const paths = svgRef.current.querySelectorAll('path');
        paths.forEach((path) => {
            const length = (path as SVGPathElement).getTotalLength?.() || 1000;
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(path, {
                strokeDashoffset: 0,
                duration: gsap.utils.random(10, 22),
                ease: 'none',
                repeat: -1,
                delay: gsap.utils.random(0, 8),
                yoyo: true,
            });
        });

        // Floating dots
        const dots = svgRef.current.querySelectorAll('circle');
        dots.forEach((dot) => {
            gsap.to(dot, {
                cy: `+=${gsap.utils.random(-15, 15)}`,
                cx: `+=${gsap.utils.random(-10, 10)}`,
                duration: gsap.utils.random(3, 6),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: gsap.utils.random(0, 3),
            });
        });
    }, []);

    return (
        <svg
            ref={svgRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
        >
            {/* Price-like zigzag lines */}
            <path d="M-100,600 L80,570 L160,605 L240,548 L320,585 L400,530 L480,568 L560,510 L640,550 L720,485 L800,528 L880,462 L960,504 L1040,442 L1120,484 L1200,415 L1280,458 L1360,393 L1540,428"
                fill="none" stroke="#1B4332" strokeWidth="1.5" strokeOpacity="0.1" />
            <path d="M-100,440 L60,420 L140,455 L260,392 L380,438 L480,382 L580,422 L680,358 L760,402 L860,342 L960,392 L1060,328 L1160,368 L1260,302 L1400,352 L1540,285"
                fill="none" stroke="#1B4332" strokeWidth="1" strokeOpacity="0.07" />
            <path d="M-100,720 L100,695 L200,732 L340,668 L440,714 L540,654 L640,694 L740,628 L840,672 L940,608 L1040,648 L1140,582 L1240,622 L1380,555 L1540,598"
                fill="none" stroke="#9B2226" strokeWidth="1" strokeOpacity="0.06" />
            <path d="M-100,290 L50,310 L150,275 L300,300 L420,258 L540,285 L660,242 L780,270 L900,228 L1020,255 L1140,212 L1260,242 L1400,198 L1540,232"
                fill="none" stroke="#D4A373" strokeWidth="1" strokeOpacity="0.07" />
            {/* Floating dots */}
            <circle cx="200" cy="200" r="3" fill="#1B4332" opacity="0.08" />
            <circle cx="500" cy="140" r="2" fill="#1B4332" opacity="0.06" />
            <circle cx="800" cy="250" r="4" fill="#9B2226" opacity="0.05" />
            <circle cx="1100" cy="180" r="2.5" fill="#D4A373" opacity="0.07" />
            <circle cx="1300" cy="320" r="3" fill="#1B4332" opacity="0.06" />
            <circle cx="350" cy="600" r="2" fill="#9B2226" opacity="0.05" />
            <circle cx="650" cy="700" r="3" fill="#1B4332" opacity="0.06" />
            <circle cx="950" cy="650" r="2" fill="#D4A373" opacity="0.05" />
        </svg>
    );
};

const HowItWorks = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-section', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out' });

            gsap.utils.toArray<Element>('.reveal-section').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: 'power3.out',
                });
            });

            gsap.utils.toArray<Element>('.feature-card').forEach((el, i) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
                    opacity: 0,
                    y: 30,
                    duration: 0.5,
                    delay: i * 0.09,
                    ease: 'power2.out',
                });
            });

            // Animate pipeline steps in sequence
            gsap.utils.toArray<Element>('.pipeline-step').forEach((el, i) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.4,
                    delay: i * 0.1,
                    ease: 'back.out(1.4)',
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const features = [
        { icon: TrendingUp, title: 'Daily Return', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'How much the stock price changed from yesterday to today, expressed as a percentage.' },
        { icon: BarChart2, title: 'Gap', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: "The difference between yesterday's closing price and today's opening price." },
        { icon: Filter, title: 'High–Low Range', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', desc: "The distance between the day's highest and lowest price — a proxy for volatility." },
        { icon: ArrowRight, title: 'Previous Trend', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', desc: 'Which direction the stock moved yesterday — helps the model understand momentum.' },
    ];

    const steps = [
        { label: 'Market Data', icon: BarChart2, color: 'from-slate-700 to-slate-900', dot: '#64748b' },
        { label: 'Feature Engineering', icon: Filter, color: 'from-blue-700 to-blue-900', dot: '#3b82f6' },
        { label: 'Random Forest Model', icon: TreePine, color: 'from-emerald-700 to-emerald-900', dot: '#10b981' },
        { label: 'Return Prediction', icon: TrendingUp, color: 'from-violet-700 to-violet-900', dot: '#8b5cf6' },
        { label: 'Risk Threshold Filter', icon: AlertCircle, color: 'from-amber-600 to-amber-800', dot: '#f59e0b' },
        { label: 'Trading Signal', icon: ArrowRight, color: 'from-primary to-slate-900', dot: '#1B4332' },
    ];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden">
            <TickerBackground />

            {/* Subtle gradient top */}
            <div className="fixed inset-0 pointer-events-none z-0"
                style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(27,67,50,0.06), transparent)' }} />

            {/* ── Section 1: Overview ── */}
            <section className="hero-section relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 text-center">
                <div className="inline-block px-4 py-1 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10 shadow-sm">
                    How It Works
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tighter leading-[1.05] mb-8">
                    ML-Powered Stock<br />
                    <span className="text-slate-400">Signal Engine</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                    This system analyzes historical stock data and uses machine learning to estimate possible next-day price movement — while applying a strict risk filter to avoid acting on small, noisy signals.
                </p>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="mt-16 flex justify-center text-slate-300"
                >
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </section>

            {/* ── Section 2: Animated Pipeline ── */}
            <section className="reveal-section relative z-10 border-t border-slate-100 bg-white/80 backdrop-blur-sm py-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-primary tracking-tighter mb-4">How the Pipeline Works</h2>
                        <p className="text-slate-500 font-medium max-w-xl mx-auto">
                            From raw market data to an actionable trading signal — here's the full flow.
                        </p>
                    </div>

                    {/* Animated inline pipeline diagram */}
                    <div className="flex flex-col items-center gap-0 max-w-md mx-auto mb-16">
                        {steps.map((step, i) => (
                            <div key={i} className="pipeline-step flex flex-col items-center w-full">
                                <motion.div
                                    whileHover={{ scale: 1.03, x: 4 }}
                                    className={`w-full px-6 py-4 rounded-xl bg-gradient-to-r ${step.color} shadow-lg flex items-center gap-4 cursor-default`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <step.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-white font-bold text-sm tracking-wide">{step.label}</span>
                                    <div className="ml-auto flex items-center gap-1.5">
                                        <span className="text-white/40 text-xs font-mono">{String(i + 1).padStart(2, '0')}</span>
                                    </div>
                                </motion.div>
                                {i < steps.length - 1 && (
                                    <motion.div
                                        animate={{ scaleY: [0.8, 1, 0.8], opacity: [0.4, 1, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                                        className="flex flex-col items-center py-1.5"
                                    >
                                        <div className="w-0.5 h-4 bg-gradient-to-b from-slate-400 to-transparent" />
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-300 -mt-1" />
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Key model facts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        {[
                            { label: 'Model Type', value: 'Random Forest', note: 'Tree-based ensemble, not a black box.', color: '#1B4332' },
                            { label: 'Training Data', value: 'Historical OHLCV', note: 'Trained separately per stock ticker.', color: '#9B2226' },
                            { label: 'Output', value: 'Predicted Return %', note: 'A number, not directly BUY/SELL.', color: '#D4A373' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4 }}
                                className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm transition-all duration-200"
                                style={{ borderTop: `3px solid ${item.color}` }}
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</p>
                                <p className="font-bold text-primary text-base mb-1">{item.value}</p>
                                <p className="text-slate-500 text-xs leading-relaxed">{item.note}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 3: Feature Engineering ── */}
            <section className="reveal-section relative z-10 py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-primary tracking-tighter mb-4">What the Model Looks At</h2>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">
                        Before making a prediction, the system calculates these key signals from raw price data.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className={`feature-card bg-white border ${f.border} rounded-xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 group`}
                        >
                            <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                                <f.icon className={`h-5 w-5 ${f.color}`} />
                            </div>
                            <h3 className="font-bold text-primary text-sm mb-3">{f.title}</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Section 4: Prediction Logic ── */}
            <section className="reveal-section relative z-10 bg-white/80 backdrop-blur-sm border-t border-b border-slate-100 py-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-primary tracking-tighter mb-6">How Predictions Work</h2>
                            <div className="space-y-5 text-slate-500 text-sm leading-relaxed">
                                <p>
                                    The Random Forest model does not say "BUY" or "SELL" directly. Instead, it outputs a <strong className="text-primary">predicted return percentage</strong> — a number like <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">+0.62%</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">-0.38%</code>.
                                </p>
                                <p>
                                    This number represents the model's best estimate of how much the stock might move on the next trading day, based on what patterns it has seen in historical data.
                                </p>
                                <p>
                                    The actual BUY/SELL/NO TRADE decision only comes <strong className="text-primary">after</strong> this prediction is passed through the risk filter.
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-10 text-white shadow-2xl relative overflow-hidden">
                            {/* Glowing corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500 opacity-5 blur-2xl" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Model Output Example</p>
                            <div className="space-y-4 font-mono text-sm">
                                {[
                                    { key: 'stock', val: 'RELIANCE', valClass: '' },
                                    { key: 'predicted_return', val: '+0.62%', valClass: 'text-emerald-400' },
                                    { key: 'threshold', val: '±0.40%', valClass: '' },
                                    { key: 'signal', val: 'BUY ✓', valClass: 'text-emerald-400 text-base' },
                                ].map((row, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.4 }}
                                        className="flex justify-between items-center border-b border-slate-800 pb-4 last:border-0 last:pb-0 last:pt-2"
                                    >
                                        <span className="text-slate-400">{row.key}</span>
                                        <span className={`font-bold ${row.valClass}`}>{row.val}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 5: Risk & Threshold ── */}
            <section className="reveal-section relative z-10 py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-primary tracking-tighter mb-4">Why NO TRADE is the Right Answer</h2>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">
                        Most of the time, the predicted return is too small to act on. This is intentional — small signals are just market noise.
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-10 shadow-lg">
                    <div className="relative border border-slate-150 rounded-xl overflow-hidden">
                        {[
                            { label: 'BUY Zone', sub: 'Predicted Return > +0.40%', bg: 'bg-emerald-50', border: 'border-emerald-200', txt: 'text-emerald-700', vtxt: 'text-emerald-600' },
                            { label: 'NO TRADE Zone', sub: '−0.40% to +0.40% — Signal suppressed', bg: 'bg-amber-50', border: 'border-amber-200', txt: 'text-amber-700', vtxt: 'text-amber-600', tall: true },
                            { label: 'SELL Zone', sub: 'Predicted Return < −0.40%', bg: 'bg-rose-50', border: 'border-rose-200', txt: 'text-rose-700', vtxt: 'text-rose-600' },
                        ].map((zone, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 4 }}
                                className={`${zone.bg} ${i < 2 ? 'border-b' : ''} ${zone.border} flex items-center justify-between px-8 ${zone.tall ? 'py-8' : 'py-5'} transition-all duration-200`}
                            >
                                <div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${zone.txt} block mb-1`}>{zone.label}</span>
                                    <span className={`text-xs ${zone.vtxt}`}>{zone.sub}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-start gap-4 mt-8 p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            The threshold (default ±0.40%) is carefully tuned. A smaller threshold would trigger too many noisy trades.
                            A larger one would miss real opportunities. This balance is key to responsible use of ML in finance.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="reveal-section relative z-10 text-center pb-28 px-4">
                <Link to="/dashboard">
                    <motion.div
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white text-sm font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 group"
                    >
                        View Live Dashboard
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </motion.div>
                </Link>
            </section>
        </div>
    );
};

export default HowItWorks;
