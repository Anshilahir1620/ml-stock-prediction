import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DataContext = createContext({
    cache: { predictions: {}, analytics: {} },
    getPrediction: () => null,
    getAnalytics: () => null,
    prefetchAll: () => {},
    updatePrediction: () => {},
    updateAnalytics: () => {},
    isPrefetching: false
});

const API_BASE = import.meta.env.VITE_API_URL || 'https://ml-stock-prediction.onrender.com';
const SUPPORTED_STOCKS = ["RELIANCE", "TCS", "ADANI", "SUZLON", "GOLD", "SILVER"];

export const DataProvider = ({ children }) => {
    const [cache, setCache] = useState(() => {
        try {
            const stored = localStorage.getItem('ml_stock_cache');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to parse cache from localStorage', e);
        }
        return { predictions: {}, analytics: {} };
    });
    const [isPrefetching, setIsPrefetching] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('ml_stock_cache', JSON.stringify(cache));
        } catch (e) {
            console.error('Failed to save cache to localStorage', e);
        }
    }, [cache]);

    const updatePrediction = useCallback(async (stock) => {
        try {
            const response = await axios.post(`${API_BASE}/predict`, { stock }, { timeout: 6000 });
            setCache(prev => ({
                ...prev,
                predictions: {
                    ...prev.predictions,
                    [stock]: { data: response.data, timestamp: Date.now() }
                }
            }));
            return response.data;
        } catch (err) {
            console.error(`Failed to update prediction for ${stock}:`, err);
            return null;
        }
    }, []);

    const updateAnalytics = useCallback(async (stock) => {
        try {
            const response = await axios.get(`${API_BASE}/historical-data`, { params: { stock }, timeout: 6000 });
            if (response.data && response.data.data) {
                setCache(prev => ({
                    ...prev,
                    analytics: {
                        ...prev.analytics,
                        [stock]: { data: response.data.data, timestamp: Date.now() }
                    }
                }));
                return response.data.data;
            }
        } catch (err) {
            console.error(`Failed to update analytics for ${stock}:`, err);
            return null;
        }
    }, []);

    const prefetchAll = useCallback(async () => {
        if (isPrefetching) return;
        setIsPrefetching(true);
        
        for (const stock of SUPPORTED_STOCKS) {
            await Promise.allSettled([
                updatePrediction(stock),
                updateAnalytics(stock)
            ]);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        setIsPrefetching(false);
    }, [isPrefetching, updatePrediction, updateAnalytics]);

    useEffect(() => {
        const timer = setTimeout(() => {
            prefetchAll();
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <DataContext.Provider value={{ 
            cache, 
            getPrediction: (s) => cache.predictions[s], 
            getAnalytics: (s) => cache.analytics[s],
            updatePrediction,
            updateAnalytics,
            prefetchAll,
            isPrefetching 
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
