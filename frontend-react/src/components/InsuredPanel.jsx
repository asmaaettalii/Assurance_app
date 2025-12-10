import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useBlockchain } from '../context/BlockchainContext';
import toast from 'react-hot-toast';
import { Search, CreditCard, AlertTriangle } from 'lucide-react';

const InsuredPanel = () => {
    const { contract } = useBlockchain();
    const [contractId, setContractId] = useState('');
    const [contractDetails, setContractDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const getContractDetails = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        if (!contractId) return;
        try {
            const details = await contract.contrats(contractId);

            // Check if contract exists (insurer address should not be zero address)
            if (details[0] === ethers.ZeroAddress) {
                toast.error("Contract not found");
                setContractDetails(null);
                return;
            }

            setContractDetails({
                insurer: details[0],
                insured: details[1],
                premium: ethers.formatEther(details[2]),
                indemnity: ethers.formatEther(details[3]),
                status: Number(details[4]),
                isPaid: details[5]
            });
        } catch (error) {
            console.error(error);
            toast.error("Error fetching contract: " + (error.reason || error.message));
            setContractDetails(null);
        }
    };

    const payPremium = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        try {
            setLoading(true);
            const details = await contract.contrats(contractId);
            const premiumAmount = details[2];

            const tx = await contract.payerPrime(contractId, { value: premiumAmount });
            toast.loading("Paying premium...", { id: 'premium' });
            await tx.wait();
            toast.success("Premium paid successfully!", { id: 'premium' });
            getContractDetails(); // Refresh
        } catch (error) {
            console.error(error);
            toast.error("Error paying premium: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    const declareClaim = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        try {
            setLoading(true);
            const tx = await contract.declarerSinistre(contractId);
            toast.loading("Declaring claim...", { id: 'claim' });
            await tx.wait();
            toast.success("Claim declared successfully!", { id: 'claim' });
            getContractDetails(); // Refresh
        } catch (error) {
            console.error(error);
            toast.error("Error declaring claim: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    const statusMap = ["ACTIVE", "CLAIMED", "INDEMNIFIED"];
    const statusColors = ["text-green-600 bg-green-50", "text-orange-600 bg-orange-50", "text-blue-600 bg-blue-50"];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
                <Search className="text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Manage Contract</h2>
            </div>

            <div className="mb-8">
                <div className="flex gap-2 mb-6">
                    <input
                        type="number"
                        placeholder="Enter Contract ID"
                        value={contractId}
                        onChange={(e) => setContractId(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                        onClick={getContractDetails}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md"
                    >
                        View
                    </button>
                </div>

                {contractDetails && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wide">Insurer</span>
                                <span className="font-mono text-gray-800 break-all">{contractDetails.insurer}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wide">Status</span>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${statusColors[contractDetails.status]}`}>
                                    {statusMap[contractDetails.status]}
                                </span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wide">Premium</span>
                                <span className="font-medium text-lg text-gray-900">{contractDetails.premium} ETH</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wide">Indemnity</span>
                                <span className="font-medium text-lg text-gray-900">{contractDetails.indemnity} ETH</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wide">Payment Status</span>
                                <span className={`font-bold ${contractDetails.isPaid ? "text-green-600" : "text-red-600"}`}>
                                    {contractDetails.isPaid ? "Paid" : "Unpaid"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={payPremium}
                        disabled={loading || !contractDetails}
                        className="flex items-center justify-center space-x-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-4 rounded-xl transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CreditCard className="h-5 w-5" />
                        <span>Pay Premium</span>
                    </button>
                    <button
                        onClick={declareClaim}
                        disabled={loading || !contractDetails}
                        className="flex items-center justify-center space-x-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-xl transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <AlertTriangle className="h-5 w-5" />
                        <span>Declare Claim</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsuredPanel;
