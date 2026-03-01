import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Database, Cpu, Activity, BarChart3, TreeDeciduous,
    Info, Binary, LineChart, Layers, ArrowRight, Zap,
    Users, Monitor, Server
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".content-block", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".content-block",
                    start: "top 85%",
                }
            });

            // Parallax effect for images
            gsap.to(".parallax-img", {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: ".parallax-img",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Live System Flow Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".flow-section",
                    start: "top 75%",
                }
            });

            tl.from(".flow-element", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            })
                .to(".flow-line-fill", {
                    scaleX: 1,
                    duration: 1.5,
                    ease: "power4.inOut"
                }, "-=0.4")
                .to(".flow-step", {
                    opacity: 1,
                    y: -10,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }, "-=1.2");
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full py-24 px-6 md:px-24 bg-[#fbfbf9] overflow-x-hidden relative">
            {/* ───────── HEADER ───────── */}
            <div className="text-center mb-32 content-block">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white shadow-sm text-gray-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] border border-gray-100 mb-8 inline-block"
                >
                    System Architecture v4.2
                </motion.span>
                <h1 className="text-6xl md:text-[85px] font-black text-gray-900 mb-6 tracking-tighter leading-[0.95]">
                    The Science of <br /><span className="text-gray-400">Market Synthesis.</span>
                </h1>
                <p className="text-[14px] text-gray-400 font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
                    Deconstructing our multi-layered Random Forest pipeline and real-time data ingestion infrastructure.
                </p>
            </div>

            {/* ───────── SECTION 1: ML PIPELINE (3D VIZ) ───────── */}
            <section className="mb-48 content-block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative rounded-[4rem] overflow-hidden bg-black aspect-[4/3] shadow-2xl border border-gray-100">
                        <img
                            src="/ml_pipeline_3d_viz.png"
                            alt="ML Pipeline Visualization"
                            className="parallax-img w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-10 left-10 text-white">
                            <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Visual Core</span>
                            <h4 className="text-xl font-black tracking-tight">Recursive Data Tunneling</h4>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                                <Layers size={24} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic">Machine Learning <br /> <span className="text-gray-300">Pipeline.</span></h2>
                        </div>
                        <p className="text-[18px] text-gray-500 font-medium leading-relaxed uppercase tracking-tight">
                            A multi-stage asynchronous pipeline that harvests raw exchange data, normalizes momentum vectors, and executes ensemble logic within milliseconds.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { title: "Data Harvesting", desc: "Real-time ingestion of OHLCV and volatility vectors." },
                                { title: "Normalization", desc: "Cleaning and scaling features for model stability." },
                                { title: "Feature Engineering", desc: "Generating Technical Indicators (RSI, EMA, MACD)." },
                                { title: "Ensemble Logic", desc: "Averaging weights from multiple recursive trees." }
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-gray-900 transition-all duration-500 shadow-sm group">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <ArrowRight size={14} />
                                    </div>
                                    <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-tight mb-2">{s.title}</h4>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight leading-tight">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── SECTION 2: RANDOM FOREST (3D VIZ) ───────── */}
            <section className="mb-48 content-block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                                <TreeDeciduous size={24} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic text-right lg:text-left w-full">Premium <br /> <span className="text-gray-300">Random Forest.</span></h2>
                        </div>
                        <p className="text-[18px] text-gray-500 font-medium leading-relaxed uppercase tracking-tight text-right lg:text-left">
                            At the heart of our synthesis lies the Random Forest Regressor—an ensemble of hundreds of decision trees that eliminate market noise through statistical consensus.
                        </p>
                        <div className="bg-gray-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Cpu size={120} />
                            </div>
                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-4 items-center mb-6">
                                    <Zap size={20} className="text-emerald-400" />
                                    <h4 className="text-[14px] font-black uppercase tracking-[0.3em]">Institutional Logic</h4>
                                </div>
                                <ul className="space-y-8">
                                    {[
                                        { t: "Noise Filtering", d: "Averaging multiple trees cancels out individual stock outliers." },
                                        { t: "Non-Linear Mapping", d: "Captures complex signals that standard linear models miss." },
                                        { t: "Recursive Pruning", d: "Optimizing tree depth to prevent overfitting on volatile data." }
                                    ].map((l, i) => (
                                        <li key={i} className="flex gap-6 items-start">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                            <div>
                                                <h5 className="text-[13px] font-black text-white uppercase tracking-tight mb-1">{l.t}</h5>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">{l.d}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-[4rem] overflow-hidden bg-black aspect-[4/3] shadow-2xl border border-gray-100">
                        <img
                            src="/random_forest_3d.png"
                            alt="Random Forest 3D Viz"
                            className="parallax-img w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                        <div className="absolute top-10 right-10 text-white text-right">
                            <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Architecture Layer</span>
                            <h4 className="text-xl font-black tracking-tight italic">Crystal Consensus Engine</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── SECTION 3: LIVE SYSTEM FLOW ───────── */}
            <section className="mb-48 content-block flow-section">
                <div className="text-center mb-16 overflow-hidden">
                    <span className="text-emerald-500 font-black text-[12px] uppercase tracking-[0.4em] mb-4 block flow-element">Deployment Architecture</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic flow-element">Live System <span className="text-gray-300">Flow.</span></h2>
                </div>

                <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 max-w-5xl mx-auto py-16 px-8 bg-white/5 border border-gray-100 rounded-[4rem] shadow-sm relative">
                    <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-gray-100 -translate-y-1/2 hidden md:block overflow-hidden">
                        <div className="flow-line-fill absolute inset-0 bg-emerald-500 origin-left scale-x-0" />
                    </div>

                    {[
                        { icon: <Users size={28} />, label: "User Request", detail: "Stock Selection" },
                        { icon: <Server size={28} />, label: "FastAPI Backend", detail: "/predict Endpoint" },
                        { icon: <Cpu size={28} />, label: "ML Model", detail: "Ensemble Logic" },
                        { icon: <Monitor size={28} />, label: "Dashboard", detail: "Real-time Viz" }
                    ].map((step, i) => (
                        <div key={i} className="flow-step flex flex-col items-center gap-6 relative z-10 w-full md:w-1/4 opacity-0">
                            <div className="w-24 h-24 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-700 cursor-pointer group">
                                <div className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                                    {step.icon}
                                </div>
                            </div>
                            <div className="text-center">
                                <h4 className="text-[15px] font-black text-gray-900 uppercase tracking-tight mb-1">{step.label}</h4>
                                <p className="text-[11px] text-emerald-500 font-bold uppercase tracking-widest">{step.detail}</p>
                            </div>
                            {i < 3 && (
                                <div className="md:hidden">
                                    <ArrowRight size={20} className="text-gray-300 rotate-90" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <p className="text-center mt-16 text-[14px] text-gray-400 font-bold uppercase tracking-widest max-w-xl mx-auto leading-relaxed flow-element">
                    “Predictions are served through a live <span className="text-gray-900">FastAPI backend</span> <br /> and displayed in a real-time <span className="text-gray-900">dashboard</span>.”
                </p>
            </section>

            {/* ───────── EXECUTION LAYER ───────── */}
            <div className="content-block p-20 bg-white border border-gray-100 rounded-[4rem] text-center space-y-10 shadow-2xl shadow-gray-200/50">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto border border-gray-100">
                    <Binary className="text-gray-900" size={32} />
                </div>
                <h3 className="text-[18px] font-black text-gray-900 uppercase tracking-[0.6em]">The Execution Protocol</h3>
                <p className="text-[18px] text-gray-400 font-bold uppercase tracking-tight max-w-3xl mx-auto leading-[1.8]">
                    Once the Random Forest completes its synthesis, the terminal produces a clear visual signal. If the predicted yield exceeds the institutional risk threshold, an <span className="text-gray-900 italic font-black">"EXECUTION SIGNAL"</span> is triggered.
                    <br /><br />
                    <span className="text-gray-200">Handcrafted Logic. Quantitative Precision.</span>
                </p>
                <Link to="/predict">
                    <button className="px-12 py-5 bg-gray-900 hover:bg-black text-white font-black rounded-2xl flex items-center gap-4 transition-all mx-auto active:scale-95 group text-[14px] uppercase tracking-[0.3em] shadow-xl">
                        View Live Terminal <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default HowItWorks;
