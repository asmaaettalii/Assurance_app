const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    console.log("Account 0 Address:", accounts[0].address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
