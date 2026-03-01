import React, { useRef } from 'react';
import { Linkedin, Github, TrendingUp, ExternalLink, Target } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const footerRef = useRef(null);

    React.useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".footer-reveal", {
                y: 50,
                opacity: 0,
                duration: 1.5,
                stagger: 0.1,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                }
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="w-full bg-white border-t border-gray-100 py-24 px-6 md:px-24 rounded-t-[5rem] shadow-[0_-30px_100px_rgba(0,0,0,0.03)] relative z-50">
            <div className="max-w-7xl mx-auto footer-reveal">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    {/* Left Column: Project Info */}
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gray-900 p-2 rounded-xl shadow-xl">
                                <TrendingUp size={20} className="text-emerald-400" />
                            </div>
                            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">ML Prediction Hub</span>
                        </div>
                        <p className="text-[13px] text-gray-500 font-medium uppercase tracking-tight leading-relaxed">
                            A machine learning–based system designed to analyze historical market data and generate predictive signals using advanced Random Forest ensembles.
                        </p>
                    </div>

                    {/* Middle Column: Developer Info */}
                    <div className="footer-reveal">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Execution Lead</h4>
                        <p className="text-[15px] font-black text-gray-900 uppercase tracking-tight mb-2">Anshil Chotara</p>
                        <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Backend & ML Developer</p>
                    </div>

                    {/* Right Column: Verified Links */}
                    <div className="flex flex-col gap-5 footer-reveal">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Verified Connections</h4>
                        <a
                            href="https://www.linkedin.com/in/anshil-chotara-776075250/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-[13px] font-black text-gray-900 uppercase tracking-widest hover:text-emerald-500 transition-colors group"
                        >
                            <Linkedin size={18} />
                            LinkedIn Profile
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                        </a>
                        <a
                            href="https://github.com/Anshilahir1620/ml-stock-prediction"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-[13px] font-black text-gray-900 uppercase tracking-widest hover:text-emerald-500 transition-colors group"
                        >
                            <Github size={18} />
                            Source Repository
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                        </a>
                        <a
                            href="https://ml-stock-prediction.onrender.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-[13px] font-black text-gray-900 uppercase tracking-widest hover:text-emerald-500 transition-colors group"
                        >
                            <Target size={18} />
                            API Endpoint
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                        </a>
                    </div>
                </div>

                {/* Bottom Bar: Legal & Disclaimer */}
                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        © 2026 ML Stockton Terminal. All Rights Reserved.
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-2 rounded-full border border-gray-100 italic">
                        "This project is for educational and demonstration purposes only."
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
