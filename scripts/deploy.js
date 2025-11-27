const hre = require("hardhat");

async function main() {
    const AssuranceContract = await hre.ethers.getContractFactory("AssuranceContract");
    const assuranceContract = await AssuranceContract.deploy();

    await assuranceContract.waitForDeployment();

    console.log("AssuranceContract deployed to:", await assuranceContract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
