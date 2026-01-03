const fs = require('fs');
const path = require('path');
const artifact = require('./artifacts/contracts/AssuranceContract.sol/AssuranceContract.json');

const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const abi = artifact.abi;

const fileContent = `export const CONTRACT_ADDRESS = "${address}";

export const ABI = ${JSON.stringify(abi, null, 4)};
`;

const targetPath = path.join(__dirname, 'frontend-react', 'src', 'utils', 'constants.js');
fs.writeFileSync(targetPath, fileContent);

console.log(`Updated ${targetPath}`);
