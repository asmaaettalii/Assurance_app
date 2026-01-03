import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useBlockchain } from '../context/BlockchainContext';
import toast from 'react-hot-toast';
import { PlusCircle, DollarSign, Search, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';

const InsurerPanel = () => {
    const { contract } = useBlockchain();

    // Create Contract State
    const [insured, setInsured] = useState('');
    const [premium, setPremium] = useState('');
    const [indemnity, setIndemnity] = useState('');

    // Manage Contract State
    const [contractId, setContractId] = useState('');
    const [contractDetails, setContractDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const claimStatusMap = ["NONE", "DECLARED", "APPROVED", "REJECTED"];
    const claimStatusColors = [
        "text-gray-500 bg-gray-100",
        "text-yellow-600 bg-yellow-50",
        "text-green-600 bg-green-50",
        "text-red-600 bg-red-50"
    ];

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

    const getContractDetails = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        if (!contractId) return;
        try {
            const details = await contract.contrats(contractId);
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
                isPaid: details[5],
                claimStatus: Number(details[6]),
                claimDescription: details[7],
                claimEvidence: details[8]
            });
        } catch (error) {
            console.error(error);
            toast.error("Error fetching contract: " + (error.reason || error.message));
            setContractDetails(null);
        }
    };

    const approveClaim = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        try {
            setLoading(true);
            const tx = await contract.approuverSinistre(contractId);
            toast.loading("Approving claim...", { id: 'approve' });
            await tx.wait();
            toast.success("Claim approved!", { id: 'approve' });
            getContractDetails();
        } catch (error) {
            console.error(error);
            toast.error("Error approving claim: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    const rejectClaim = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        try {
            setLoading(true);
            const tx = await contract.rejeterSinistre(contractId);
            toast.loading("Rejecting claim...", { id: 'reject' });
            await tx.wait();
            toast.success("Claim rejected and premium refunded!", { id: 'reject' });
            getContractDetails();
        } catch (error) {
            console.error(error);
            toast.error("Error rejecting claim: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    const payIndemnity = async () => {
        if (!contract) return toast.error("Please connect wallet first");
        try {
            setLoading(true);
            // We need amount from details, assume details loaded
            if (!contractDetails) return;
            const indemnityAmount = ethers.parseEther(contractDetails.indemnity);

            const tx = await contract.payerIndemnisation(contractId, { value: indemnityAmount });
            toast.loading("Paying indemnity...", { id: 'pay' });
            await tx.wait();
            toast.success("Indemnity paid successfully!", { id: 'pay' });
            getContractDetails();
        } catch (error) {
            console.error(error);
            toast.error("Error paying indemnity: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Create Contract */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
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

            {/* Right Column: Manage Contract */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
                <div className="flex items-center space-x-2 mb-6 border-b pb-2">
                    <Search className="text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-800">Manage Contract / Claims</h2>
                </div>

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
                        Load
                    </button>
                </div>

                {contractDetails && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Info Card */}
                        <div className="bg-gray-50 p-4 rounded-lg text-sm border border-gray-200">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-500">Insured:</span>
                                <span className="font-mono text-gray-800 truncate">{contractDetails.insured}</span>

                                <span className="text-gray-500">Premium:</span>
                                <span className="font-medium">{contractDetails.premium} ETH ({contractDetails.isPaid ? 'Paid' : 'Unpaid'})</span>

                                <span className="text-gray-500">Indemnity:</span>
                                <span className="font-medium">{contractDetails.indemnity} ETH</span>

                                <span className="text-gray-500">Claim Status:</span>
                                <span className={`font-bold ${claimStatusColors[contractDetails.claimStatus].split(' ')[0]}`}>{claimStatusMap[contractDetails.claimStatus]}</span>
                            </div>
                        </div>

                        {/* Claim Details if Exists */}
                        {contractDetails.claimStatus > 0 && (
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-sm">
                                <h4 className="font-bold text-orange-800 mb-2 flex items-center"><FileText className="w-4 h-4 mr-2" /> Claim Information</h4>
                                <p><span className="font-semibold">Desc:</span> {contractDetails.claimDescription}</p>
                                <p><span className="font-semibold">Proof:</span> <a href={contractDetails.claimEvidence} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate block">{contractDetails.claimEvidence}</a></p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {/* Actions for DECLARED claims */}
                            {contractDetails.claimStatus === 1 && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={approveClaim}
                                        disabled={loading}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" /> Approve
                                    </button>
                                    <button
                                        onClick={rejectClaim}
                                        disabled={loading}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition flex items-center justify-center"
                                    >
                                        <XCircle className="w-5 h-5 mr-2" /> Reject
                                    </button>
                                </div>
                            )}

                            {/* Actions for APPROVED claims */}
                            {contractDetails.claimStatus === 2 && contractDetails.status !== 2 && ( // Status 2 is INDEMNIFIED
                                <button
                                    onClick={payIndemnity}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition flex items-center justify-center"
                                >
                                    <DollarSign className="w-5 h-5 mr-2" /> Pay Indemnity ({contractDetails.indemnity} ETH)
                                </button>
                            )}

                            {contractDetails.status === 2 && (
                                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-center font-bold border border-blue-200">
                                    Contract Indemnified
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsurerPanel;
