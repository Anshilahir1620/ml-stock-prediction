import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';
import gsap from 'gsap';

const GlobalLoader = () => {
    const { isLoading } = useLoading();
    const dotsRef = useRef(null);
    const ringRef = useRef(null);
    const textRef = useRef(null);
    const laserRef = useRef(null);

    useEffect(() => {
        if (isLoading) {
            // Main ring rotation
            gsap.to(ringRef.current, {
                rotation: 360,
                duration: 3,
                repeat: -1,
                ease: "none"
            });

            // Bouncing dots
            gsap.to(dotsRef.current.children, {
                y: -10,
                stagger: {
                    each: 0.1,
                    repeat: -1,
                    yoyo: true
                },
                ease: "power2.inOut"
            });

            // Laser scanning effect
            gsap.set(laserRef.current, { skewY: 0, opacity: 0 });
            gsap.to(laserRef.current, {
                y: "200%",
                opacity: 0.5,
                duration: 1.5,
                repeat: -1,
                ease: "power1.inOut"
            });
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/95 backdrop-blur-2xl"
                >
                    {/* Neural Network Background Grid */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                        style={{ 
                            backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)',
                            backgroundSize: '32px 32px' 
                        }} 
                    />

                    <div className="relative flex flex-col items-center">
                        {/* Futuristic Scanning Ring */}
                        <div className="relative mb-12">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute -inset-8 bg-emerald-500/5 rounded-full blur-3xl"
                            />
                            
                            <div 
                                ref={ringRef}
                                className="w-32 h-32 border-[1px] border-dashed border-emerald-500/40 rounded-full flex items-center justify-center relative"
                            >
                                {/* Inner Orbit */}
                                <div className="absolute inset-2 border-[0.5px] border-emerald-500/20 rounded-full animate-pulse" />
                                
                                {/* Scanning Laser */}
                                <div 
                                    ref={laserRef}
                                    className="absolute -top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-[1px] opacity-0"
                                />

                                <div className="w-20 h-20 border-2 border-emerald-500/80 rounded-full border-t-transparent animate-[spin_1s_linear_infinite]" />
                            </div>
                        </div>

                        {/* AI Status Panel */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="overflow-hidden h-5 relative w-48 flex justify-center">
                                <motion.span 
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] text-center"
                                >
                                    Node Synthesis
                                </motion.span>
                            </div>
                            
                            <div ref={dotsRef} className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full" />
                                ))}
                            </div>
                            
                            <div className="mt-4 px-6 py-2 bg-slate-900 rounded-full flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                    Initializing Neural Core
                                </span>
                            </div>
                        </div>

                        {/* Ambient Glows */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoader;
