import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useBlockchain } from '../context/BlockchainContext';
import toast from 'react-hot-toast';
import { PlusCircle, DollarSign } from 'lucide-react';

const InsurerPanel = () => {
    const { contract } = useBlockchain();
    const [insured, setInsured] = useState('');
    const [premium, setPremium] = useState('');
    const [indemnity, setIndemnity] = useState('');
    const [contractId, setContractId] = useState('');
    const [loading, setLoading] = useState(false);

    const createContract = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        try {
            setLoading(true);
            const tx = await contract.creerContrat(
                insured,
                ethers.parseEther(premium),
                ethers.parseEther(indemnity)
            );
            toast.loading("Creating contract...", { id: 'create' });
            await tx.wait();
            toast.success("Contract created successfully!", { id: 'create' });
            setInsured('');
            setPremium('');
            setIndemnity('');
        } catch (error) {
            console.error(error);
            toast.error("Error creating contract: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    const payIndemnity = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        try {
            setLoading(true);
            const details = await contract.contrats(contractId);
            const indemnityAmount = details[3];

            const tx = await contract.payerIndemnisation(contractId, { value: indemnityAmount });
            toast.loading("Paying indemnity...", { id: 'pay' });
            await tx.wait();
            toast.success("Indemnity paid successfully!", { id: 'pay' });
            setContractId('');
        } catch (error) {
            console.error(error);
            toast.error("Error paying indemnity: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-2 mb-6 border-b pb-2">
                    <PlusCircle className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">Create New Contract</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Insured Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={insured}
                            onChange={(e) => setInsured(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Premium (ETH)</label>
                            <input
                                type="number"
                                placeholder="0.0"
                                value={premium}
                                onChange={(e) => setPremium(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Indemnity (ETH)</label>
                            <input
                                type="number"
                                placeholder="0.0"
                                value={indemnity}
                                onChange={(e) => setIndemnity(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>
                    <button
                        onClick={createContract}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md disabled:opacity-50 flex justify-center items-center"
                    >
                        {loading ? 'Processing...' : 'Create Contract'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
                <div className="flex items-center space-x-2 mb-6 border-b pb-2">
                    <DollarSign className="text-red-600" />
                    <h2 className="text-xl font-bold text-gray-800">Pay Indemnity</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contract ID</label>
                        <input
                            type="number"
                            placeholder="Enter ID"
                            value={contractId}
                            onChange={(e) => setContractId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                    <button
                        onClick={payIndemnity}
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Pay Indemnity'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsurerPanel;
