import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useBlockchain } from '../context/BlockchainContext';
import { RefreshCw, FileText } from 'lucide-react';

const ContractList = () => {
    const { contract, account } = useBlockchain();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchContracts = async () => {
        if (!contract || !account) return;
        try {
            setLoading(true);
            const ids = await contract.getContractsForUser(account);

            const loadedContracts = [];
            for (let id of ids) {
                const details = await contract.contrats(id);
                loadedContracts.push({
                    id: id.toString(),
                    insurer: details[0],
                    insured: details[1],
                    premium: ethers.formatEther(details[2]),
                    indemnity: ethers.formatEther(details[3]),
                    status: Number(details[4]),
                    isPaid: details[5]
                });
            }
            setContracts(loadedContracts);
        } catch (error) {
            console.error("Error fetching contracts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, [contract, account]);

    const statusMap = ["ACTIVE", "CLAIMED", "INDEMNIFIED"];
    const statusColors = ["bg-green-100 text-green-800", "bg-orange-100 text-orange-800", "bg-blue-100 text-blue-800"];

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FileText className="mr-2 text-blue-600" />
                    My Contracts
                </h2>
                <button
                    onClick={fetchContracts}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center bg-blue-50 px-3 py-1 rounded-full transition hover:bg-blue-100"
                >
                    <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {loading && contracts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading contracts...</p>
                </div>
            ) : contracts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 italic">No contracts found associated with this wallet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contracts.map((c) => (
                        <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-bold text-xl text-gray-800">#{c.id}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold tracking-wide ${statusColors[c.status]}`}>
                                        {statusMap[c.status]}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Premium</span>
                                        <span className="font-medium text-gray-900">{c.premium} ETH</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Indemnity</span>
                                        <span className="font-medium text-gray-900">{c.indemnity} ETH</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-gray-500">Paid?</span>
                                        <span className={`font-bold ${c.isPaid ? "text-green-600" : "text-red-500"}`}>
                                            {c.isPaid ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                <div className="flex justify-between mb-1">
                                    <span>Insurer:</span>
                                    <span className="font-mono" title={c.insurer}>{c.insurer.slice(0, 6)}...{c.insurer.slice(-4)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Insured:</span>
                                    <span className="font-mono" title={c.insured}>{c.insured.slice(0, 6)}...{c.insured.slice(-4)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContractList;
