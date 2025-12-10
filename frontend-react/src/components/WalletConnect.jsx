import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';

const WalletConnect = () => {
    const { account, connectWallet } = useBlockchain();

    return (
        <div className="text-center">
            {account ? (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    {account.slice(0, 6)}...{account.slice(-4)}
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-lg transform hover:scale-105"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
