export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "assure",
                "type": "address"
            }
        ],
        "name": "ContratCree",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "montant",
                "type": "uint256"
            }
        ],
        "name": "IndemnisationPayee",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "montant",
                "type": "uint256"
            }
        ],
        "name": "PrimePayee",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "SinistreApprouve",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "SinistreDeclare",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "SinistreRejete",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "approuverSinistre",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "contractsByAddress",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "contrats",
        "outputs": [
            {
                "internalType": "address",
                "name": "assureur",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "assure",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "montantPrime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "montantIndemnisation",
                "type": "uint256"
            },
            {
                "internalType": "enum AssuranceContract.Statut",
                "name": "statut",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "estPaye",
                "type": "bool"
            },
            {
                "internalType": "enum AssuranceContract.StatutSinistre",
                "name": "statutSinistre",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "descriptionSinistre",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "preuveSinistre",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_assure",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_prime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_indemnisation",
                "type": "uint256"
            }
        ],
        "name": "creerContrat",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_preuve",
                "type": "string"
            }
        ],
        "name": "declarerSinistre",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getContractsForUser",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "payerIndemnisation",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "payerPrime",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "rejeterSinistre",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];
