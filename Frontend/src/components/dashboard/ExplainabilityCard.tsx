import React from 'react';
import { CheckCircle2, AlertTriangle, Info, Shield } from 'lucide-react';

interface ExplainabilityCardProps {
    prediction: number;
    threshold: number;
    signal: 'BUY' | 'SELL' | 'NO TRADE';
}

const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ prediction, threshold, signal }) => {
    const isAboveThreshold = Math.abs(prediction) >= threshold;

    const insights = [
        {
            label: "Expected Valuation Delta",
            value: `${(prediction * 100).toFixed(2)}%`,
            icon: <Info className="w-3.5 h-3.5 text-slate-400" />
        },
        {
            label: "Volatility Boundary",
            value: `±${(threshold * 100).toFixed(2)}%`,
            icon: <Shield className="w-3.5 h-3.5 text-slate-400" />
        },
        {
            label: "Strategy Compliance",
            value: isAboveThreshold ? "THRESHOLD EXCEEDED" : "NEUTRAL RANGE",
            icon: isAboveThreshold ? <CheckCircle2 className="w-3.5 h-3.5 text-signal-buy" /> : <AlertTriangle className="w-3.5 h-3.5 text-signal-hold" />
        }
    ];

    return (
        <div className="h-full flex flex-col pt-2 bg-white">
            <h3 className="label-subtle mb-10">Analysis Summary</h3>

            <div className="space-y-8 flex-grow">
                {insights.map((insight, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {insight.icon}
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{insight.label}</span>
                        </div>
                        <p className="text-lg font-bold text-primary pl-5">
                            {insight.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${signal === 'BUY' ? 'bg-signal-buy' : signal === 'SELL' ? 'bg-signal-sell' : 'bg-signal-hold'}`} />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inference: {signal}</p>
            </div>
        </div>
    );
};

export default ExplainabilityCard;
