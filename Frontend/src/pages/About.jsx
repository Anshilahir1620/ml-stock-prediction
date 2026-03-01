import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Target, Layers, Rocket, Code2, Globe, ShieldCheck,
    Activity, Cpu, BarChart3, Users, Mail, ArrowRight,
    Linkedin, ExternalLink, Terminal
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section Reveal
            gsap.from(".reveal-block", {
                y: 50,
                opacity: 0,
                filter: "blur(10px)",
                duration: 1.2,
                stagger: 0.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".reveal-block",
                    start: "top 85%",
                }
            });

            // Parallax accents
            gsap.to(".parallax-accent", {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Developer Section Horizontal Reveal
            const devTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".developer-section",
                    start: "top 90%",
                }
            });

            // Ensure elements are pre-set for animation
            gsap.set(".developer-split-left", { x: -300, opacity: 0, filter: "blur(30px)" });
            gsap.set(".developer-split-right", { x: 300, opacity: 0, filter: "blur(30px)" });
            gsap.set(".developer-icon", { scale: 0, opacity: 0 });

            devTl.to(".developer-split-left", {
                x: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.8,
                ease: "power4.out",
                stagger: 0.1
            })
                .to(".developer-split-right", {
                    x: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1.8,
                    ease: "power4.out",
                    stagger: 0.1
                }, "-=1.5")
                .to(".developer-icon", {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: "back.out(1.7)"
                }, "-=1.2");
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const techStack = [
        { name: "React 19", icon: <Globe size={18} /> },
        { name: "FastAPI", icon: <Rocket size={18} /> },
        { name: "Scikit-Learn", icon: <Layers size={18} /> },
        { name: "Tailwind v4", icon: <ShieldCheck size={18} /> },
        { name: "GSAP 3", icon: <Activity size={18} /> },
        { name: "Lucide Icons", icon: <Target size={18} /> },
    ];

    return (
        <div ref={containerRef} className="w-full pt-32 pb-48 px-6 md:px-24 bg-[#fbfbf9] overflow-x-hidden relative min-h-screen">

            {/* BACKGROUND DECORATION */}
            <div className="parallax-accent absolute top-40 right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
            <div className="parallax-accent absolute bottom-40 left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />

            {/* ───────── HEADER ───────── */}
            <div className="max-w-4xl mb-32 reveal-block">
                <span className="bg-white shadow-sm text-gray-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] border border-gray-100 mb-8 inline-block">
                    Terminal Identity v4.2
                </span>
                <h1 className="text-6xl md:text-[95px] font-black text-gray-900 mb-10 tracking-tighter leading-[0.95]">
                    Synthesizing <br /> <span className="text-gray-400 italic">Market Truth.</span>
                </h1>
                <p className="text-[20px] text-gray-500 font-medium leading-relaxed uppercase tracking-tighter">
                    We bridge the gap between institutional-grade quantitative analysis and the modern retail terminal through precision logic and zero-noise design.
                </p>
            </div>

            {/* ───────── ABOUT THE PROJECT ───────── */}
            <section className="mb-48 reveal-block">
                <div className="flex flex-col md:flex-row gap-20 items-start">
                    <div className="md:w-1/3">
                        <div className="flex items-center gap-4 mb-4">
                            <Terminal size={24} className="text-emerald-500" />
                            <h2 className="text-[14px] font-black text-gray-900 uppercase tracking-[0.4em]">About the Project</h2>
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Purpose & <br /> <span className="text-gray-300 tracking-normal">Inspiration.</span></h3>
                    </div>
                    <div className="md:w-2/3 space-y-8">
                        <p className="text-[18px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                            This project is a machine learning–based stock prediction system designed to analyze historical market data and generate predictive signals.
                        </p>
                        <p className="text-[18px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                            The focus of the project is to demonstrate practical ML implementation, clean system design, and real-world deployment using a modern tech stack.
                        </p>
                    </div>
                </div>
            </section>

            {/* ───────── CORE PHILOSOPHY & TECH STACK ───────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-48 reveal-block">
                <div className="space-y-12">
                    <div className="p-12 bg-white border border-gray-100 rounded-[3.5rem] shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Cpu size={120} />
                        </div>
                        <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                            <Code2 size={20} className="text-emerald-500" />
                            Engineering DNA
                        </h3>
                        <p className="text-[16px] text-gray-500 leading-relaxed font-bold uppercase tracking-tighter">
                            Our Random Forest clusters process thousands of high-dimension data points per second. Predictions are strictly filtered to ensure that output only triggers when probability exceeds institutional safety caps.
                        </p>
                    </div>

                    <div className="pl-12 border-l-4 border-emerald-500">
                        <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Execution Goal</h4>
                        <p className="text-[32px] md:text-[44px] text-gray-900 font-black leading-[0.9] tracking-tighter uppercase italic">
                            "To synthesize complex market noise into <span className="text-emerald-500">actionable</span> quantitative visual signals."
                        </p>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                        <BarChart3 className="text-gray-900" size={32} />
                        <h3 className="text-[18px] font-black text-gray-900 uppercase tracking-[0.5em]">The Stack</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {techStack.map((tech) => (
                            <div key={tech.name} className="flex items-center gap-4 p-8 bg-white border border-gray-100 rounded-3xl hover:border-gray-900 transition-all duration-500 group cursor-default">
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    {tech.icon}
                                </div>
                                <span className="text-[13px] font-black text-gray-900 uppercase tracking-widest">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ───────── ABOUT THE DEVELOPER ───────── */}
            <div className="developer-section w-full bg-gradient-to-br from-gray-900 via-[#062419] to-black rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="developer-icon w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(16,185,129,0.5)]">
                        <Users size={40} className="text-white" />
                    </div>

                    <div className="overflow-hidden mb-6">
                        <span className="developer-split-right text-emerald-400 font-black text-[14px] uppercase tracking-[0.8em] block">Lead Architect</span>
                    </div>

                    <h2 className="text-5xl md:text-[100px] font-black mb-12 tracking-tighter leading-none italic flex flex-wrap justify-center gap-x-8">
                        <span className="developer-split-left inline-block">Hi, I’m</span>
                        <span className="developer-split-left text-emerald-400 inline-block">Anshil</span>
                        <span className="developer-split-right inline-block">Chotara.</span>
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8 mt-6">
                        <a
                            href="https://www.linkedin.com/in/anshil-chotara"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="developer-split-left px-12 py-6 bg-white text-gray-900 font-black rounded-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group text-[15px] uppercase tracking-[0.3em] shadow-xl"
                        >
                            <Linkedin size={22} className="text-[#0077B5]" />
                            Connect on LinkedIn
                        </a>
                        <a
                            href="mailto:anshilchotara@gmail.com"
                            className="developer-split-right px-12 py-6 bg-transparent border-2 border-white/20 hover:border-emerald-500 hover:text-emerald-500 text-white font-black rounded-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group text-[15px] uppercase tracking-[0.3em] shadow-xl"
                        >
                            <Mail size={22} />
                            Send Message
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-20 text-center opacity-5">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[1em]">SYSTEM_END_COMMUNICATION</p>
            </div>
        </div>
    );
};

export default About;
