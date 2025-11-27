const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Updated address
// We will fetch the ABI dynamically or hardcode it for simplicity if needed.
// Since we are in a local env, we can try to fetch it from artifacts if served, or just paste it.
// For this setup, I'll fetch it from the artifacts JSON file assuming it's served relative to index.html
// OR I can embed a minimal ABI.

let provider;
let signer;
let contract;
const abi = [
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
        "name": "SinistreDeclare",
        "type": "event"
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
                "name": "assure",
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
            }
        ],
        "name": "declarerSinistre",
        "outputs": [],
        "stateMutability": "nonpayable",
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
    }
];



// Helper function to display user-friendly error messages
function displayError(error) {
    const statusDiv = document.getElementById("statusMessage");
    let message = "";
    let icon = "❌";

    // Extract the actual error reason from complex error objects
    let errorText = "";
    if (error.reason) {
        errorText = error.reason;
    } else if (error.message) {
        errorText = error.message;
    } else if (typeof error === 'string') {
        errorText = error;
    }

    // Parse the error and provide user-friendly messages
    if (errorText.includes("Prime non payee")) {
        icon = "⚠️";
        message = "Premium Not Paid: You must pay the premium before declaring a claim. Click 'Pay Premium' first.";
    } else if (errorText.includes("Seul l'assure peut payer")) {
        icon = "🚫";
        message = "Access Denied: Only the insured person can pay the premium. Switch to the insured's wallet address.";
    } else if (errorText.includes("Pas de sinistre declare")) {
        icon = "⚠️";
        message = "No Claim Declared: You must declare a claim before paying indemnity. Click 'Declare Claim' first.";
    } else if (errorText.includes("Seul l'assureur peut payer")) {
        icon = "🚫";
        message = "Access Denied: Only the insurer can pay the indemnity. Switch to the insurer's wallet address.";
    } else if (errorText.includes(" Contrat non actif")) {
        icon = "⚠️";
        message = "Contract Not Active: This contract is no longer active.";
    } else if (errorText.includes("Deja paye")) {
        icon = "ℹ️";
        message = "Already Paid: The premium has already been paid for this contract.";
    } else if (errorText.includes("Montant incorrect")) {
        icon = "⚠️";
        message = "Incorrect Amount: The payment amount doesn't match the required amount.";
    } else if (errorText.includes("user rejected") || errorText.includes("User denied")) {
        icon = "🚫";
        message = "Transaction Cancelled: You rejected the transaction in MetaMask.";
    } else if (errorText.includes("insufficient funds")) {
        icon = "💰";
        message = "Insufficient Funds: You don't have enough ETH in your wallet.";
    } else if (errorText.includes("network changed") || errorText.includes("wrong network")) {
        icon = "🌐";
        message = "Wrong Network: Please connect to localhost:8545 in MetaMask.";
    } else if (errorText.includes("contract") && errorText.includes("not deployed")) {
        icon = "⚠️";
        message = "Contract Not Found: Please make sure the contract is deployed.";
    } else {
        // Generic error - extract just the meaningful part
        // Try to extract just the error reason without all the JSON
        let cleanMessage = errorText;

        // If it contains "execution reverted:", extract what comes after
        if (errorText.includes("execution reverted:")) {
            const match = errorText.match(/execution reverted: "([^"]+)"/);
            if (match && match[1]) {
                cleanMessage = match[1];
            }
        }

        // Remove any remaining JSON-like structures
        cleanMessage = cleanMessage.split('(action=')[0].split('(error=')[0].trim();

        // Capitalize first letter if needed
        if (cleanMessage && cleanMessage.length > 0) {
            cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
        } else {
            cleanMessage = "An unexpected error occurred";
        }

        message = cleanMessage;
    }

    statusDiv.innerHTML = `
        <div class="p-4 rounded-lg border-2 border-red-300 bg-red-50 text-red-800 shadow-lg">
            <span class="text-2xl mr-2">${icon}</span>
            <strong>${message}</strong>
        </div>
    `;
}

// Helper function to display success messages
function displaySuccess(message, txHash = null) {
    const statusDiv = document.getElementById("statusMessage");
    let content = `
        <div class="p-4 rounded-lg border-2 border-green-300 bg-green-50 text-green-800 shadow-lg">
            <span class="text-2xl mr-2">✅</span>
            <strong>${message}</strong>
    `;

    if (txHash) {
        content += `<br><small class="text-xs">Transaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}</small>`;
    }

    content += `</div>`;
    statusDiv.innerHTML = content;
}

// Helper function to display info messages
function displayInfo(message) {
    const statusDiv = document.getElementById("statusMessage");
    statusDiv.innerHTML = `
        <div class="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 text-blue-800 shadow-lg">
            <span class="text-2xl mr-2">ℹ️</span>
            <strong>${message}</strong>
        </div>
    `;
}

async function init() {
    // ABI is hardcoded above


    document.getElementById("connectWallet").addEventListener("click", connectWallet);
    document.getElementById("createContract").addEventListener("click", createContract);
    document.getElementById("payIndemnity").addEventListener("click", payIndemnity);
    document.getElementById("getContractDetails").addEventListener("click", getContractDetails);
    document.getElementById("payPremium").addEventListener("click", payPremium);

    document.getElementById("declareClaim").addEventListener("click", declareClaim);
    document.getElementById("listMyContracts").addEventListener("click", listMyContracts);

    // Debugging: Check if window.ethereum exists immediately
    if (window.ethereum) {
        console.log("MetaMask detected!");
    } else {
        console.log("MetaMask NOT detected!");
        displayError({ message: "MetaMask not detected. Please ensure the extension is installed and enabled." });
    }
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            const address = await signer.getAddress();
            document.getElementById("walletAddress").innerText = `Connected: ${address}`;

            // Re-initialize contract with signer
            if (contractAddress !== "YOUR_CONTRACT_ADDRESS_HERE") {
                contract = new ethers.Contract(contractAddress, abi, signer);
                displaySuccess("Wallet connected successfully!");
            } else {
                displayError({ message: "Please deploy contract and update address in app.js" });
            }
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        document.getElementById("statusMessage").innerHTML = "Please install <a href='https://metamask.io/download/' target='_blank' class='text-blue-500 underline'>MetaMask</a>!";
    }
}

async function createContract() {
    if (!contract) return alert("Connect wallet first!");
    const insured = document.getElementById("insuredAddress").value;
    const premium = ethers.parseEther(document.getElementById("premiumAmount").value);
    const indemnity = ethers.parseEther(document.getElementById("indemnityAmount").value);

    try {
        displayInfo("Creating contract... Please confirm in MetaMask.");
        const tx = await contract.creerContrat(insured, premium, indemnity);
        displayInfo("Transaction sent. Waiting for confirmation...");
        await tx.wait();
        displaySuccess("Contract created successfully!", tx.hash);
    } catch (error) {
        console.error(error);
        displayError(error);
    }
}

async function getContractDetails() {
    if (!contract) return alert("Connect wallet first!");
    const id = document.getElementById("contractIdView").value;
    try {
        const details = await contract.contrats(id);
        // details is an array-like object: [assureur, assure, prime, indemnisation, statut, estPaye]

        const statusMap = ["ACTIF", "SINISTRE", "INDEMNISE"];

        const html = `
            <p><strong>Insurer:</strong> ${details[0]}</p>
            <p><strong>Insured:</strong> ${details[1]}</p>
            <p><strong>Premium:</strong> ${ethers.formatEther(details[2])} ETH</p>
            <p><strong>Indemnity:</strong> ${ethers.formatEther(details[3])} ETH</p>
            <p><strong>Status:</strong> ${statusMap[Number(details[4])]}</p>
            <p><strong>Paid:</strong> ${details[5] ? "Yes" : "No"}</p>
        `;
        const div = document.getElementById("contractDetails");
        div.innerHTML = html;
        div.classList.remove("hidden");
    } catch (error) {
        console.error(error);
        displayError(error);
    }
}

async function payPremium() {
    if (!contract) return alert("Connect wallet first!");
    const id = document.getElementById("contractIdView").value; // Use same ID input
    if (!id) return alert("Enter Contract ID in View section");

    try {
        // We need to know the premium amount. Fetch it first.
        const details = await contract.contrats(id);
        const premium = details[2];

        displayInfo("Paying premium... Please confirm in MetaMask.");
        const tx = await contract.payerPrime(id, { value: premium });
        displayInfo("Transaction sent. Waiting for confirmation...");
        await tx.wait();
        displaySuccess("Premium paid successfully!", tx.hash);
        getContractDetails(); // Refresh
    } catch (error) {
        console.error(error);
        displayError(error);
    }
}

async function declareClaim() {
    if (!contract) return alert("Connect wallet first!");
    const id = document.getElementById("contractIdView").value;
    if (!id) return alert("Enter Contract ID in View section");

    try {
        displayInfo("Declaring claim... Please confirm in MetaMask.");
        const tx = await contract.declarerSinistre(id);
        displayInfo("Transaction sent. Waiting for confirmation...");
        await tx.wait();
        displaySuccess("Claim declared successfully!", tx.hash);
        getContractDetails();
    } catch (error) {
        console.error(error);
        displayError(error);
    }
}

async function payIndemnity() {
    if (!contract) return alert("Connect wallet first!");
    const id = document.getElementById("contractIdIndemnify").value;

    try {
        const details = await contract.contrats(id);
        const indemnity = details[3];

        displayInfo("Paying indemnity... Please confirm in MetaMask.");
        const tx = await contract.payerIndemnisation(id, { value: indemnity });
        displayInfo("Transaction sent. Waiting for confirmation...");
        await tx.wait();
        displaySuccess("Indemnity paid successfully!", tx.hash);
    } catch (error) {
        console.error(error);
        displayError(error);
    }
}


async function listMyContracts() {
    if (!contract) return alert("Connect wallet first!");
    try {
        const signerAddress = await signer.getAddress();
        const contractIds = await contract.getContractsForUser(signerAddress);

        const listDiv = document.getElementById("myContractsList");
        listDiv.innerHTML = "";

        if (contractIds.length === 0) {
            listDiv.innerHTML = "<p class='text-gray-500'>No contracts found.</p>";
            return;
        }

        for (let id of contractIds) {
            // Fetch details for each contract to display status
            const details = await contract.contrats(id);
            const statusMap = ["ACTIF", "SINISTRE", "INDEMNISE"];

            const card = document.createElement("div");
            card.className = "border p-4 rounded shadow bg-gray-50";
            card.innerHTML = `
                <p class="font-bold">ID: ${id}</p>
                <p>Status: ${statusMap[Number(details[4])]}</p>
                <p>Premium: ${ethers.formatEther(details[2])} ETH</p>
                <button onclick="viewContract(${id})" class="mt-2 text-blue-500 underline text-sm">View Details</button>
            `;
            listDiv.appendChild(card);
        }
    } catch (error) {
        console.error(error);
        displayError(error);
    }
}

window.viewContract = function (id) {
    document.getElementById("contractIdView").value = id;
    getContractDetails();
}

window.addEventListener("load", init);
