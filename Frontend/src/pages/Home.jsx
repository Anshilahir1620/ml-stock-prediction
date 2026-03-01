import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    TrendingUp, ArrowRight, ShieldCheck, Zap,
    Cpu, Globe, Activity, Lock, Target, Server
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef = useRef(null);
    const nodesRef = useRef(null);
    const fullImgRef = useRef(null);
    const parallaxBgRef = useRef(null);

    const dashboardImg = "/fintech_market_analysis_preview_1772374264428.png";

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Entrance
            gsap.from(".hero-element", {
                y: 50,
                filter: "blur(10px)",
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power4.out"
            });

            // Parallax Hero Background
            gsap.to(parallaxBgRef.current, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Section Progressive Reveal
            gsap.utils.toArray("section").forEach((section, i) => {
                if (i === 0) return;
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top center",
                        scrub: 1.5,
                    },
                    scale: 0.95,
                    opacity: 0,
                    y: 60,
                    filter: "blur(10px)",
                    ease: "power2.out"
                });
            });

            // "The Synthesis" DNA/Nodes Animation
            gsap.to(".synthesis-node", {
                y: "random(-40, 40)",
                x: "random(-20, 20)",
                duration: "random(3, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Full Width Image Parallax
            gsap.fromTo(".full-width-img",
                { scale: 1.3, yPercent: -15 },
                {
                    scale: 1,
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: fullImgRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );

            // Skew on Scroll for Feature Cards
            let proxy = { skew: 0 },
                skewSetter = gsap.quickSetter(".feature-card", "skewY", "deg"),
                clamp = gsap.utils.clamp(-8, 8);

            ScrollTrigger.create({
                onUpdate: (self) => {
                    let skew = clamp(self.getVelocity() / -400);
                    if (Math.abs(skew) > Math.abs(proxy.skew)) {
                        proxy.skew = skew;
                        gsap.to(proxy, {
                            skew: 0,
                            duration: 0.8,
                            ease: "power3",
                            overwrite: true,
                            onUpdate: () => skewSetter(proxy.skew)
                        });
                    }
                }
            });

            // Statistical Numbers Animation
            gsap.from(".stat-num", {
                scrollTrigger: {
                    trigger: ".stat-num",
                    start: "top 85%",
                },
                opacity: 0,
                y: 40,
                duration: 1.2,
                stagger: 0.2,
                ease: "expo.out"
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={heroRef} className="flex flex-col items-center justify-center pt-20 overflow-x-hidden bg-[#fbfbf9]">

            <div
                ref={parallaxBgRef}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none"
            />

            {/* ───────── HERO SECTION ───────── */}
            <section className="w-full px-6 md:px-24 text-center mb-24 md:mb-48 min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center relative">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hero-element bg-white shadow-sm text-gray-400 px-6 py-2.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] border border-gray-100 mb-6 md:mb-10 inline-block"
                >
                    Institutional Intelligence v4.2
                </motion.span>
                <h1 className="hero-element text-4xl sm:text-5xl md:text-[95px] font-black text-gray-900 mb-8 md:mb-10 leading-[0.9] md:leading-[0.85] tracking-tighter px-2">
                    Precision Logic. <br /><span className="text-gray-400">Market Synthesis.</span>
                </h1>
                <p className="hero-element text-[14px] md:text-[20px] text-gray-400 mb-12 md:mb-16 leading-relaxed max-w-2xl mx-auto font-bold uppercase tracking-tight px-6 md:px-4">
                    Architecting high-frequency Random Forest clusters to <br className="hidden md:block" /> eliminate market noise and deliver structural clarity.
                </p>

                <div className="hero-element flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full sm:w-auto px-6 sm:px-0">
                    <Link to="/predict" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5.5 bg-gray-900 hover:bg-black text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-gray-300 active:scale-95 group text-[13px] md:text-[15px] uppercase tracking-[0.2em]">
                            Enter Terminal <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                        </button>
                    </Link>
                    <Link to="/how-it-works" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5.5 bg-white border-2 border-gray-100 hover:border-gray-900 text-gray-900 font-black rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95 text-[13px] md:text-[15px] uppercase tracking-[0.2em]">
                            System Architecture
                        </button>
                    </Link>
                </div>
            </section>

            {/* ───────── SECTION 1: THE SYNTHESIS MECHANISM ───────── */}
            <section className="w-full bg-[#0a0a0a] py-24 md:py-52 relative overflow-hidden text-white border-y border-white/5">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>

                <div className="w-full px-6 md:px-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <div>
                            <span className="text-emerald-500 font-black text-[11px] md:text-[13px] uppercase tracking-[0.5em] mb-4 md:mb-6 block">Model Synthesis</span>
                            <h2 className="text-4xl md:text-[72px] font-black mb-6 md:mb-10 leading-[1] md:leading-[0.9] tracking-tighter text-white">
                                Built for <br /> <span className="text-gray-700">Structural Trust.</span>
                            </h2>
                            <p className="text-gray-400 text-[16px] md:text-[18px] font-medium leading-relaxed mb-10 md:mb-16 max-w-lg uppercase tracking-tight">
                                Our recursive engine processes non-linear market vectors, isolating high-probability structural shifts with institutional precision.
                            </p>

                            <div className="space-y-6 md:space-y-8">
                                {[
                                    { icon: <Cpu size={24} />, title: "Recursive Branch Pruning", desc: "Adaptive optimization for noise-free signal clusters." },
                                    { icon: <Target size={24} />, title: "Structural Filter Layers", desc: "Multi-layered validation across algorithmic trees." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 md:gap-7 items-start bg-white/5 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/10 max-w-xl transition-all hover:bg-white/10 group">
                                        <div className="bg-emerald-500 p-2.5 md:p-3.5 rounded-xl md:rounded-2xl text-white shadow-[0_0_30px_rgba(16,185,129,0.2)] shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] md:text-[16px] font-black text-white uppercase tracking-tight mb-2">{item.title}</h4>
                                            <p className="text-[11px] md:text-[12px] text-gray-500 font-bold uppercase tracking-tight leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div ref={nodesRef} className="bg-white/5 border border-white/10 rounded-[40px] md:rounded-[80px] p-6 md:p-12 aspect-square relative flex items-center justify-center overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-transparent transition-opacity group-hover:opacity-30"></div>

                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="synthesis-node absolute w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-2xl"
                                    style={{
                                        top: `${10 + Math.random() * 80}%`,
                                        left: `${10 + Math.random() * 80}%`,
                                    }}
                                >
                                    <Activity size={24} className="md:size-32 text-emerald-500/20" />
                                </div>
                            ))}
                            <div className="relative z-20 bg-emerald-500 w-32 h-32 md:w-48 md:h-48 rounded-[35%] shadow-[0_0_80px_rgba(16,185,129,0.4)] flex items-center justify-center border-[6px] md:border-[10px] border-emerald-400 rotate-12 group-hover:rotate-0 transition-all duration-1000 ease-expo">
                                <Zap size={48} className="md:size-80 text-white fill-emerald-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: INSTITUTIONAL PRECISION (STATISTICS) */}
            <section className="py-24 md:py-52 w-full px-6 md:px-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32">
                    {[
                        { val: "40–50%", label: "MODEL ACCURACY", color: "text-emerald-500", desc: "Mean predictive accuracy across verified institutional data cycles." },
                        { val: "7 Days", label: "PREDICTION WINDOW", color: "text-gray-900", desc: "Extended horizon for high-probability market synthesis." },
                        { val: "2+", label: "ML MODELS", color: "text-orange-500", desc: "Recursive evaluation of Logistic Regression and Random Forest clusters." }
                    ].map((m, i) => (
                        <div key={i} className="text-center group flex flex-col items-center px-6">
                            <div className="mb-10 md:mb-14 h-auto">
                                <p className={`stat-num text-5xl md:text-[110px] font-black leading-none ${m.color} tracking-tighter group-hover:scale-105 transition-transform duration-500 block`}>
                                    {m.val}
                                </p>
                            </div>
                            <h4 className="text-[10px] md:text-[13px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 md:mb-8">
                                {m.label}
                            </h4>
                            <p className="text-[12px] md:text-[14px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed max-w-[260px] mx-auto opacity-70">
                                {m.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───────── FULL WIDTH IMAGE SECTION ───────── */}
            <section ref={fullImgRef} className="w-full h-[60vh] md:h-[80vh] overflow-hidden relative border-y border-gray-100 bg-black text-center">
                <img
                    src={dashboardImg}
                    alt="Fintech Analysis Preview"
                    className="full-width-img w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                    <span className="text-emerald-400 font-black text-[10px] md:text-[12px] uppercase tracking-[0.5em] mb-4 md:mb-6 block drop-shadow-lg">Visual Intelligence</span>
                    <h2 className="text-3xl md:text-[64px] font-black text-white mb-8 md:mb-10 tracking-tighter leading-tight max-w-4xl drop-shadow-2xl">
                        A Terminal Designed for <br /> <span className="text-emerald-400 font-black uppercase">Absolute Clarity.</span>
                    </h2>
                    <Link to="/predict">
                        <button className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black rounded-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 text-[13px] md:text-[15px] uppercase tracking-[0.3em]">
                            Launch Terminal <TrendingUp size={20} />
                        </button>
                    </Link>
                </div>
            </section>

            {/* ───────── SECTION 3: RECURSIVE LAYERS ───────── */}
            <section className="w-full bg-[#fbfbf9] py-24 md:py-52 border-t border-gray-100 mb-0">
                <div className="w-full px-6 md:px-24 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 md:mb-32 gap-10">
                        <div className="max-w-2xl">
                            <span className="text-gray-400 font-black text-[11px] md:text-[12px] uppercase tracking-[0.5em] mb-4 md:mb-6 block">Infrastructure</span>
                            <h2 className="text-4xl md:text-[80px] font-black text-gray-900 tracking-tighter leading-[1] md:leading-[0.85] uppercase">Synthesized <br /> Security.</h2>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-tight text-[12px] md:text-[13px] max-w-[340px] leading-relaxed opacity-60">
                            Our resilient cloud architecture ensures zero-latency data tunneling and verified structural integrity.
                        </p>
                    </div>

                    <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { icon: <Lock size={22} />, title: "Encrypted Feeds", desc: "Institutional-grade API tunneling with zero-noise protocols." },
                            { icon: <Server size={22} />, title: "Render Clusters", desc: "High-performance compute clusters for real-time synthesis." },
                            { icon: <Globe size={22} />, title: "Exchange Sync", desc: "Synchronized sub-second data processing across global hubs." },
                            { icon: <ShieldCheck size={22} />, title: "Volatility Guard", desc: "Recursive filtering logic that invalidates noise in real-time." }
                        ].map((feature, idx) => (
                            <div key={idx} className="feature-card bg-white border border-gray-200 p-8 md:p-12 rounded-[32px] md:rounded-[40px] text-left hover:border-gray-900 transition-all duration-700 group relative overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/50">
                                <div className="bg-gray-50 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-8 md:mb-12 border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500 shadow-sm">
                                    {feature.icon}
                                </div>
                                <h3 className="text-[15px] md:text-[16px] font-black text-gray-900 mb-4 md:mb-5 uppercase tracking-tighter">{feature.title}</h3>
                                <p className="text-gray-400 text-[11px] md:text-[12px] leading-relaxed font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
