import React from 'react';
import ContractList from '../components/ContractList';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to BlockSure</h1>
                <p className="text-gray-600">
                    Your decentralized platform for parametric insurance. Manage your policies and claims with transparency and speed.
                </p>
            </div>

            <ContractList />
        </div>
    );
};

export default Dashboard;
