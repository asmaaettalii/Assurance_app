import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import { Shield, LayoutDashboard, Briefcase, UserCheck } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-600 hover:text-white";
    };

    return (
        <nav className="bg-blue-900 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
                            <Shield className="h-8 w-8 text-blue-400" />
                            <span>BlockSure</span>
                        </Link>

                        <div className="hidden md:flex space-x-4">
                            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/')}`}>
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/insurer" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/insurer')}`}>
                                <Briefcase className="h-4 w-4" />
                                <span>Insurer Panel</span>
                            </Link>
                            <Link to="/insured" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/insured')}`}>
                                <UserCheck className="h-4 w-4" />
                                <span>Insured Panel</span>
                            </Link>
                        </div>
                    </div>

                    <WalletConnect />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
