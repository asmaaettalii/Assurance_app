import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} BlockSure Decentralized Insurance. All rights reserved.</p>
                </div>
            </footer>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default Layout;
