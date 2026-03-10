import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingContext = createContext({
    isLoading: false,
    setIsLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    // Trigger loader on route change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // Minimum animation time for smoother transition
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
