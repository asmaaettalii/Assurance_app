import React from 'react';
import InsurerPanel from '../components/InsurerPanel';

const InsurerPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Insurer Portal</h1>
                <p className="text-gray-600">Create new insurance contracts and manage payouts.</p>
            </div>
            <InsurerPanel />
        </div>
    );
};

export default InsurerPage;
