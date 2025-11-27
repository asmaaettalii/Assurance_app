const hre = require("hardhat");

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log(`Checking contract at ${contractAddress}...`);

    const code = await hre.ethers.provider.getCode(contractAddress);
    if (code === "0x") {
        console.error("ERROR: No contract code found at this address!");
        return;
    }
    console.log("Contract code found. Length:", code.length);

    const AssuranceContract = await hre.ethers.getContractFactory("AssuranceContract");
    const contract = AssuranceContract.attach(contractAddress);

    const [signer] = await hre.ethers.getSigners();
    console.log("Testing with signer:", signer.address);

    // Simulate the failing transaction
    // Params from user error: 
    // to: 0x5fbdb...
    // from: 0x3c44... (User's wallet, we'll use local signer 0 which is 0xf39f...)
    // data: 0xb82e7339... (creerContrat)

    // We'll try to call it with dummy data similar to what the user might be sending
    // The user sent: 
    // insured: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (Account #1)
    // premium: 1 ETH (de0b6b3a7640000)
    // indemnity: 2 ETH (1bc16d674ec80000)

    const insured = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
    const premium = hre.ethers.parseEther("1.0");
    const indemnity = hre.ethers.parseEther("2.0");

    console.log("Attempting to estimate gas for creerContrat...");
    try {
        const gas = await contract.creerContrat.estimateGas(insured, premium, indemnity);
        console.log("Gas estimation successful:", gas.toString());
    } catch (error) {
        console.error("Gas estimation FAILED:", error.message);
        // Try to call it to get the revert reason
        try {
            await contract.creerContrat(insured, premium, indemnity);
        } catch (callError) {
            console.error("Transaction Revert Reason:", callError.message);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
