import React from 'react';

interface ConfidenceGaugeProps {
    predictedReturn: number;
    threshold: number;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ predictedReturn, threshold }) => {
    // scale is centered at 0, bounded at ±2*threshold
    const limit = threshold * 2;
    const value = Math.max(-limit, Math.min(limit, predictedReturn));

    // Position as percentage from left (0 to 100)
    const pos = ((value + limit) / (limit * 2)) * 100;

    const getMarkerColor = () => {
        if (predictedReturn > threshold) return 'bg-signal-buy';
        if (predictedReturn < -threshold) return 'bg-signal-sell';
        return 'bg-signal-hold';
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-xs relative pt-6 pb-2">
                {/* Track */}
                <div className="h-1 w-full bg-slate-100 rounded-full relative">
                    {/* Threshold Markers */}
                    <div className="absolute top-1/2 -translate-y-1/2 h-4 w-px bg-slate-200" style={{ left: '25%' }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 h-4 w-px bg-slate-200" style={{ left: '75%' }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 h-6 w-px bg-slate-300" style={{ left: '50%' }}></div>
                </div>

                {/* Indicator Pin */}
                <div
                    className={`absolute bottom-1 w-2.5 h-2.5 border-2 border-white rounded-full shadow-sm transition-all duration-700 ease-out z-10 ${getMarkerColor()}`}
                    style={{ left: `calc(${pos}% - 5px)` }}
                ></div>

                {/* Labels */}
                <div className="flex justify-between mt-4">
                    <span className="label-subtle">Lower Bound</span>
                    <span className="label-subtle">Neutral</span>
                    <span className="label-subtle">Upper Bound</span>
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className="label-subtle mb-1">Return Delta Estimate</p>
                <p className="text-2xl font-bold text-primary">
                    {(predictedReturn * 100).toFixed(2)}%
                </p>
            </div>
        </div>
    );
};

export default ConfidenceGauge;
