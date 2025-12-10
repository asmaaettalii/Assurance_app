import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI } from '../utils/constants';

const BlockchainContext = createContext();

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [loading, setLoading] = useState(true);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const _signer = await _provider.getSigner();
                const _account = await _signer.getAddress();
                const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _signer);

                setProvider(_provider);
                setSigner(_signer);
                setAccount(_account);
                setContract(_contract);
            } catch (error) {
                console.error("Failed to connect wallet:", error);
                alert("Failed to connect wallet. See console for details.");
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await connectWallet();
                }
            }
            setLoading(false);
        };
        checkConnection();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    connectWallet();
                } else {
                    setAccount(null);
                    setContract(null);
                    setSigner(null);
                }
            });
        }
    }, []);

    return (
        <BlockchainContext.Provider value={{ account, contract, connectWallet, loading, provider, signer }}>
            {children}
        </BlockchainContext.Provider>
    );
};
