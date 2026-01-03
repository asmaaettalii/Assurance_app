import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useBlockchain } from '../context/BlockchainContext';
import toast from 'react-hot-toast';
import { Search, CreditCard, AlertTriangle, FileText, Link as LinkIcon, CheckCircle, XCircle, Upload } from 'lucide-react';
import { uploadToIPFS } from '../utils/ipfs';

const InsuredPanel = () => {
    const { contract, account } = useBlockchain();
    const [contractId, setContractId] = useState('');
    const [contractDetails, setContractDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form states
    const [description, setDescription] = useState('');
    const [evidence, setEvidence] = useState('');
    const [file, setFile] = useState(null);

    const claimStatusMap = ["NONE", "DECLARED", "APPROVED", "REJECTED"];
    const claimStatusColors = [
        "text-gray-500 bg-gray-100",
        "text-yellow-600 bg-yellow-50",
        "text-green-600 bg-green-50",
        "text-red-600 bg-red-50"
    ];

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
        if (!description || (!evidence && !file)) return toast.error("Please provide description and evidence (file or link)");

        try {
            setLoading(true);
            let evidenceLink = evidence;

            if (file) {
                try {
                    toast.loading("Uploading proof to IPFS...", { id: 'ipfs' });
                    const cid = await uploadToIPFS(file);
                    evidenceLink = `https://gateway.pinata.cloud/ipfs/${cid}`;
                    toast.success("Proof uploaded!", { id: 'ipfs' });
                } catch (err) {
                    console.error("Upload error details:", err);
                    toast.error("Upload failed: " + (err.message || "Check console"));
                    setLoading(false);
                    return;
                }
            }

            const tx = await contract.declarerSinistre(contractId, description, evidenceLink);
            toast.loading("Declaring claim...", { id: 'claim' });
            await tx.wait();
            toast.success("Claim declared successfully!", { id: 'claim' });
            getContractDetails(); // Refresh
            setDescription('');
            setEvidence('');
            setFile(null);
        } catch (error) {
            console.error(error);
            toast.error("Error declaring claim: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    const globalStatusMap = ["ACTIVE", "CLAIMED", "INDEMNIFIED"];
    const globalStatusColors = ["text-green-600 bg-green-50", "text-orange-600 bg-orange-50", "text-blue-600 bg-blue-50"];

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
                    <div className="space-y-6">
                        {/* Contract Details Card */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Insurer</span>
                                    <span className="font-mono text-gray-800 break-all">{contractDetails.insurer}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Global Status</span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${globalStatusColors[contractDetails.status]}`}>
                                        {globalStatusMap[contractDetails.status]}
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
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Claim Status</span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${claimStatusColors[contractDetails.claimStatus]}`}>
                                        {claimStatusMap[contractDetails.claimStatus]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Claim Information View */}
                        {contractDetails.claimStatus > 0 && (
                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                <h3 className="text-md font-bold text-orange-800 mb-3 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" /> Claim Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-semibold">Description:</span> {contractDetails.claimDescription}</p>
                                    <p><span className="font-semibold">Evidence:</span> <a href={contractDetails.claimEvidence} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{contractDetails.claimEvidence}</a></p>
                                </div>
                            </div>
                        )}

                        {contractDetails && account && contractDetails.insured.toLowerCase() !== account.toLowerCase() && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <span>You must be connected as the Insured ({contractDetails.insured.slice(0, 6)}...{contractDetails.insured.slice(-4)}) to perform actions.</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pay Premium Section */}
                            <div className="space-y-3">
                                <button
                                    onClick={payPremium}
                                    disabled={loading || !contractDetails || contractDetails.isPaid || (contractDetails.insured.toLowerCase() !== account.toLowerCase())}
                                    className="flex items-center justify-center space-x-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {contractDetails.isPaid ? <CheckCircle className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                                    <span>{contractDetails.isPaid ? "Premium Paid" : "Pay Premium"}</span>
                                </button>
                            </div>

                            {/* Declare Claim Section */}
                            <div className="space-y-3">
                                {contractDetails.isPaid && contractDetails.claimStatus === 0 && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Description (e.g. Accident le 20/12)"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Evidence Link (optional if file uploaded)"
                                                value={evidence}
                                                onChange={(e) => setEvidence(e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg p-2 flex items-center justify-center transition">
                                                <input
                                                    type="file"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                    className="hidden"
                                                />
                                                <Upload className={`w-5 h-5 ${file ? 'text-green-600' : 'text-gray-600'}`} />
                                            </label>
                                        </div>
                                        {file && <span className="text-xs text-green-600 truncate block">Selected: {file.name}</span>}
                                    </>
                                )}
                                <button
                                    onClick={declareClaim}
                                    disabled={
                                        loading ||
                                        !contractDetails ||
                                        !contractDetails.isPaid ||
                                        contractDetails.claimStatus !== 0 ||
                                        (contractDetails.insured.toLowerCase() !== account.toLowerCase())
                                    }
                                    className="flex items-center justify-center space-x-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <AlertTriangle className="h-5 w-5" />
                                    <span>{contractDetails.claimStatus === 0 ? "Declare Claim" : `Claim ${claimStatusMap[contractDetails.claimStatus]}`}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsuredPanel;
