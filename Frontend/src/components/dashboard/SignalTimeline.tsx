import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SignalTimelineProps {
    currentSignal: 'BUY' | 'SELL' | 'NO TRADE';
}

const SignalTimeline: React.FC<SignalTimelineProps> = ({ currentSignal }) => {
    const mockHistory = useMemo(() => {
        const history: ('BUY' | 'SELL' | 'NO TRADE')[] = [];
        for (let i = 0; i < 14; i++) {
            const r = Math.random();
            if (r < 0.2) history.push('BUY');
            else if (r < 0.4) history.push('SELL');
            else history.push('NO TRADE');
        }
        history.push(currentSignal);
        return history;
    }, [currentSignal]);

    const getMarkerColor = (signal: string) => {
        if (signal === 'BUY') return 'bg-signal-buy';
        if (signal === 'SELL') return 'bg-signal-sell';
        return 'bg-slate-300';
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-6">
                <h3 className="label-subtle">Signal Compliance Timeline</h3>
                <span className="text-[10px] font-mono text-slate-400">15D Data Track</span>
            </div>

            <div className="relative pt-2 pb-6 flex justify-between items-center bg-slate-50/50 p-4 rounded border border-slate-100">
                <div className="absolute top-1/2 left-4 right-4 h-px bg-slate-200 -translate-y-1/2"></div>

                {mockHistory.map((signal, index) => {
                    const isToday = index === mockHistory.length - 1;
                    return (
                        <div key={index} className="relative flex flex-col items-center group">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.02, duration: 0.2, ease: "easeOut" }}
                                className={clsx(
                                    "w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform z-10",
                                    getMarkerColor(signal),
                                    isToday ? "scale-125 ring-2 ring-slate-900/10" : "hover:scale-150"
                                )}
                                title={isToday ? `Today: ${signal}` : `Historical: ${signal}`}
                            />
                            {isToday && (
                                <span className="absolute -bottom-6 text-[8px] font-black text-slate-900 tracking-tighter">NOW</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SignalTimeline;
