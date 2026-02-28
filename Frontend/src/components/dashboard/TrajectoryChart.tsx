import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

interface TrajectoryChartProps {
    data: any[];
    threshold: number;
    signal: 'BUY' | 'SELL' | 'NO TRADE';
}

const TrajectoryChart: React.FC<TrajectoryChartProps> = ({ data, threshold, signal }) => {
    const lastValue = data.length > 0 ? data[data.length - 1].value : 100;
    const upperBound = lastValue * (1 + threshold);
    const lowerBound = lastValue * (1 - threshold);

    const getSignalColor = () => {
        if (signal === 'BUY') return '#1B4332'; // Deep Green
        if (signal === 'SELL') return '#9B2226'; // Muted Red
        return '#ADB5BD'; // Neutral Slate
    };

    const accentColor = getSignalColor();

    return (
        <div className="w-full h-full relative group bg-white">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F3F5" />

                    {/* Threshold Reference Lines */}
                    <ReferenceLine
                        y={upperBound}
                        stroke="#DEE2E6"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                        label={{ value: `+${(threshold * 100).toFixed(2)}%`, position: 'right', fill: '#ADB5BD', fontSize: 10, fontWeight: 600 }}
                    />
                    <ReferenceLine
                        y={lowerBound}
                        stroke="#DEE2E6"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                        label={{ value: `-${(threshold * 100).toFixed(2)}%`, position: 'right', fill: '#ADB5BD', fontSize: 10, fontWeight: 600 }}
                    />

                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        hide
                    />

                    <YAxis
                        domain={[Math.min(lowerBound * 0.99, ...data.map(d => d.value)), Math.max(upperBound * 1.01, ...data.map(d => d.value))]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#ADB5BD', fontSize: 10, fontWeight: 500 }}
                        tickFormatter={(value) => `₹${value.toFixed(0)}`}
                        width={40}
                    />

                    <Tooltip
                        contentStyle={{
                            borderRadius: '4px',
                            border: '1px solid #DEE2E6',
                            boxShadow: 'none',
                            backgroundColor: '#FFFFFF',
                            padding: '8px'
                        }}
                        labelStyle={{ display: 'none' }}
                        itemStyle={{ color: '#1C1C1C', fontWeight: 600, fontSize: '11px' }}
                        formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Valuation']}
                    />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={accentColor}
                        strokeWidth={1.5}
                        dot={false}
                        activeDot={{ r: 4, fill: accentColor, stroke: '#FFF', strokeWidth: 2 }}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrajectoryChart;
