const fs = require('fs');
const artifact = require('./artifacts/contracts/AssuranceContract.sol/AssuranceContract.json');
console.log(JSON.stringify(artifact.abi, null, 2));
