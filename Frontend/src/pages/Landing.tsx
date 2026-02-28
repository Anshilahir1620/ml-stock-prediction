import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

// Animated SVG background only — no canvas interference
const TradingBackground = () => {
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
                delay: gsap.utils.random(0, 6),
                yoyo: true,
            });
        });

        // Animate live dot
        gsap.to('.live-dot', {
            opacity: 0.2,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
        });
    }, []);

    return (
        <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1440 800"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <radialGradient id="heroGlow" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#1B4332" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                </radialGradient>
            </defs>
            <ellipse cx="720" cy="400" rx="720" ry="400" fill="url(#heroGlow)" />
            <path d="M-100,600 L80,575 L160,608 L240,556 L320,588 L400,538 L480,572 L560,518 L640,552 L720,488 L800,532 L880,468 L960,508 L1040,448 L1120,488 L1200,418 L1280,462 L1360,398 L1540,428"
                fill="none" stroke="#1B4332" strokeWidth="1.8" strokeOpacity="0.13" />
            <path d="M-100,450 L60,428 L140,458 L260,398 L380,442 L480,388 L580,428 L680,362 L760,408 L860,348 L960,398 L1060,332 L1160,372 L1260,308 L1400,358 L1540,292"
                fill="none" stroke="#1B4332" strokeWidth="1.2" strokeOpacity="0.09" />
            <path d="M-100,700 L100,678 L200,718 L340,662 L440,708 L540,648 L640,688 L740,622 L840,668 L940,602 L1040,642 L1140,578 L1240,618 L1380,552 L1540,592"
                fill="none" stroke="#9B2226" strokeWidth="1.2" strokeOpacity="0.07" />
            <path d="M-100,290 L50,318 L150,282 L300,308 L420,266 L540,292 L660,250 L780,278 L900,236 L1020,262 L1140,220 L1260,248 L1400,206 L1540,238"
                fill="none" stroke="#D4A373" strokeWidth="1.2" strokeOpacity="0.09" />
            <path d="M-100,148 L120,168 L240,138 L380,162 L500,128 L620,152 L740,116 L860,142 L980,106 L1100,132 L1220,96 L1380,126 L1540,88"
                fill="none" stroke="#1B4332" strokeWidth="0.8" strokeOpacity="0.06" />
            {/* Subtle floating dots */}
            <circle cx="180" cy="180" r="3" fill="#1B4332" opacity="0.08" />
            <circle cx="450" cy="125" r="2" fill="#1B4332" opacity="0.06" />
            <circle cx="750" cy="220" r="4" fill="#9B2226" opacity="0.05" />
            <circle cx="1050" cy="165" r="2.5" fill="#D4A373" opacity="0.07" />
            <circle cx="1280" cy="310" r="3" fill="#1B4332" opacity="0.06" />
        </svg>
    );
};

const Landing = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.fromTo('.hero-badge', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 })
                .fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, '-=0.3')
                .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
                .fromTo('.hero-cta', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
                .fromTo('.feature-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, '-=0.2');
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const features = [
        { icon: TrendingUp, title: 'Price Trend Analysis', desc: 'Tracks 30-day historical price movement with clean visual charts.', color: '#1B4332' },
        { icon: BarChart2, title: 'ML-Powered Prediction', desc: 'Random Forest model trained separately on each NSE stock.', color: '#9B2226' },
        { icon: ShieldCheck, title: 'Risk Threshold Filter', desc: 'Signals only fire when return exceeds the noise boundary.', color: '#D4A373' },
        { icon: ArrowRight, title: 'Clear Trading Signal', desc: 'BUY, SELL, or NO TRADE — explained in plain language.', color: '#1B4332' },
    ];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden flex flex-col">
            {/* Animated SVG background */}
            <TradingBackground />

            {/* Hero — z-10 so it's above SVG */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="hero-badge inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Data-Driven · Risk-Controlled · Open Source
                </div>

                <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-primary leading-[1.05] mb-2">
                    Market Analysis
                </h1>
                <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-10">
                    <span className="text-slate-500">for Smarter Decisions.</span>
                </h1>

                <p className="hero-sub max-w-xl text-base text-slate-600 font-medium leading-relaxed mb-12">
                    Daily market insights using data-driven models and risk filters.<br className="hidden sm:block" />
                    Built for clarity, not complexity.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/dashboard">
                        <motion.div
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="hero-cta group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            View Dashboard
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                        </motion.div>
                    </Link>
                    <Link to="/how-it-works">
                        <motion.div
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="hero-cta inline-flex items-center gap-3 px-8 py-4 bg-white text-primary text-sm font-bold rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            How It Works
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* Feature Strip */}
            <div className="relative z-10 border-y-2 border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ backgroundColor: '#F8F9FA', y: -2 }}
                            className="feature-card p-8 flex flex-col gap-4 cursor-default"
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${f.color}18` }}
                            >
                                <f.icon className="h-5 w-5" style={{ color: f.color }} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-primary mb-1.5">{f.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Core Pillars */}
            <section className="relative z-10 py-24 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Our Foundation</h2>
                        <h3 className="text-3xl font-bold text-primary tracking-tight">Built on Three Pillars</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'High-Fidelity Data', desc: 'Sourced from primary market feeds, cleaned and normalized for institutional-grade reliability.', icon: BarChart2 },
                            { title: 'Model Integrity', desc: 'Random Forest ensembles trained to recognize patterns, not just noise, with separate state per ticker.', icon: TrendingUp },
                            { title: 'Risk Parameters', desc: 'A strict ±0.40% threshold ensures signals only fire when the statistical edge is undeniable.', icon: ShieldCheck },
                        ].map((pillar, i) => (
                            <div key={i} className="pillar-item flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                                    <pillar.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h4 className="font-bold text-lg text-primary mb-3">{pillar.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Specs Strip */}
            <section className="relative z-10 py-12 bg-primary text-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-8">
                    {[
                        { label: 'Prediction Latency', val: '15ms' },
                        { label: 'Backtest Success', val: '72%' },
                        { label: 'System Uptime', val: '99.9%' },
                        { label: 'Features Tracked', val: '4/tick' },
                    ].map((spec, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{spec.label}</span>
                            <span className="text-2xl font-bold tracking-tight">{spec.val}</span>
                        </div>
                    ))}
                </div>
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-[0.03] blur-[100px]" />
            </section>

            {/* Final CTA */}
            <section className="relative z-10 py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-primary tracking-tight mb-6">Ready to see the engine in action?</h2>
                    <p className="text-slate-500 mb-10 text-lg">Access the live dashboard for any of our 6 supported stocks and commodities.</p>
                    <Link to="/dashboard">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white text-sm font-bold rounded-xl shadow-lg"
                        >
                            Enter Terminal
                            <ArrowRight className="w-4 h-4" />
                        </motion.div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Landing;
