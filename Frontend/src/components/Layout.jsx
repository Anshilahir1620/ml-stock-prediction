import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen text-gray-900 pt-24">
            <Navbar />
            <main className="w-full min-h-[70vh]">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
