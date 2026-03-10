import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

const Layout = ({ children }) => {
    const { isLoading } = useLoading();

    return (
        <div className="min-h-screen text-gray-900 pt-24">
            <Navbar />
            <main className="w-full min-h-[70vh] relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoading ? 0 : 1 }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                >
                    {children}
                </motion.div>
            </main>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
            >
                <Footer />
            </motion.div>
        </div>
    );
};

export default Layout;
