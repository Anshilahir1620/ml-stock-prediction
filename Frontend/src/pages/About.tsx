import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BookOpen, Code2, Users, Target } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.about-hero', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out' });
            gsap.from('.about-banner', { opacity: 0, scale: 0.97, duration: 0.8, delay: 0.3, ease: 'power2.out' });
            gsap.utils.toArray<Element>('.about-card').forEach((el, i) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
                    opacity: 0,
                    y: 30,
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: 'power2.out',
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const cards = [
        {
            icon: BookOpen,
            title: 'What This Is',
            body: 'A full-stack ML application that fetches stock data, engineers features, applies a Random Forest model, and produces daily BUY / SELL / NO TRADE signals — then visualizes everything in a clear, browser-based dashboard.',
            accent: '#1B4332',
        },
        {
            icon: Target,
            title: 'Why It Was Built',
            body: 'To show that machine learning in finance does not have to mean "predict and pray." Responsible ML means building in risk controls, being transparent about what the model does, and clearly separating prediction from advice.',
            accent: '#9B2226',
        },
        {
            icon: Users,
            title: 'Who Should Use It',
            body: 'CS students, ML practitioners, and finance enthusiasts who want to see a realistic, documented example of how quantitative analysis tools are structured — not a "get rich" scheme.',
            accent: '#D4A373',
        },
        {
            icon: Code2,
            title: 'What Problem It Solves',
            body: 'Most retail investors have no structured way to evaluate market data. This project demonstrates one principled approach: engineer meaningful features, train carefully, and suppress low-confidence signals automatically.',
            accent: '#334155',
        },
    ];

    const techStack = [
        { label: 'Frontend', val: 'React 18 + Vite' },
        { label: 'Styling', val: 'Tailwind CSS' },
        { label: 'Animation', val: 'Framer Motion + GSAP' },
        { label: 'Charts', val: 'Recharts' },
        { label: 'Backend', val: 'FastAPI (Python)' },
        { label: 'ML Model', val: 'Random Forest' },
        { label: 'Data', val: 'NSE/BSE OHLCV' },
        { label: 'Icons', val: 'Lucide React' },
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-background pb-32">

            {/* Hero — fully solid, no canvas overlay */}
            <section className="about-hero max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 text-center">
                <div className="inline-block px-4 py-1 rounded-full border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10 shadow-sm">
                    About This Project
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tighter leading-[1.05] mb-8">
                    Why This<br />
                    <span className="text-slate-400">Was Built.</span>
                </h1>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    A machine learning project built to demonstrate how data science can be applied responsibly in financial analysis — with risk control at its core, not as an afterthought.
                </p>
            </section>

            {/* Stats banner — replaces broken image */}
            <div className="about-banner max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-900">
                    {/* Mac titlebar */}
                    <div className="flex items-center gap-2 px-5 py-3 bg-slate-800 border-b border-slate-700">
                        <span className="w-3 h-3 rounded-full bg-rose-500" />
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="ml-4 text-[11px] font-mono text-slate-400">ml_signal_engine.py — prediction output</span>
                    </div>

                    {/* Stats grid */}
                    <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            { label: '# stocks analyzed', val: '2', color: 'text-emerald-400' },
                            { label: '# features engineered', val: '4', color: 'text-amber-300' },
                            { label: '# model type', val: 'RandomForest', color: 'text-sky-400' },
                            { label: '# risk filter', val: '±0.40%', color: 'text-rose-400' },
                            { label: '# signal options', val: 'BUY / SELL / NO TRADE', color: 'text-violet-400' },
                            { label: '# purpose', val: 'Educational Only', color: 'text-slate-300' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="flex flex-col gap-1 font-mono"
                            >
                                <span className="text-slate-500 text-xs">{item.label}</span>
                                <span className={`${item.color} font-bold text-lg leading-snug`}>{item.val}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Gradient bottom bar */}
                    <div className="h-1 w-full"
                        style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #ec4899)' }} />
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* 4 Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                            className="about-card bg-white border border-slate-200 rounded-xl p-8 shadow-sm transition-all duration-300"
                            style={{ borderTop: `3px solid ${item.accent}` }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${item.accent}18` }}>
                                    <item.icon className="h-4 w-4" style={{ color: item.accent }} />
                                </div>
                                <h3 className="font-bold text-primary text-base">{item.title}</h3>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tech Stack */}
                <div className="about-card bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                    <h3 className="font-bold text-primary text-base mb-6">Technology Stack</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {techStack.map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.04, y: -2 }}
                                className="bg-slate-50 rounded-lg p-4 border border-slate-100 cursor-default"
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                                <p className="text-sm font-bold text-primary">{s.val}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="about-card flex gap-4 p-7 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">Legal Disclaimer</p>
                        <p className="text-amber-900 text-sm leading-relaxed">
                            This project is for educational and demonstration purposes only. Signals and predictions produced by this system do not constitute financial advice. Past performance of any model is not indicative of future market results. Never invest based solely on algorithmic output.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
