import React from 'react';
import InsuredPanel from '../components/InsuredPanel';

const InsuredPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Policyholder Portal</h1>
                <p className="text-gray-600">View your policies, pay premiums, and file claims.</p>
            </div>
            <InsuredPanel />
        </div>
    );
};

export default InsuredPage;
