# Quick Start Guide - Fix JSON-RPC Error

## Problem
You're getting an "Internal JSON-RPC error" because either:
- The Hardhat local blockchain node is not running
- The contract needs to be redeployed

## Solution - Follow These Steps

### Step 1: Start Hardhat Node
Open a **first terminal/PowerShell window** and run:
```bash
cd c:\Users\Lenovo\.gemini\antigravity\scratch\insurance-dapp
npx hardhat node
```
**Important**: Keep this terminal running! Don't close it.

### Step 2: Deploy the Contract
Open a **second terminal/PowerShell window** and run:
```bash
cd c:\Users\Lenovo\.gemini\antigravity\scratch\insurance-dapp
npx hardhat run scripts/deploy.js --network localhost
```

This will output something like:
```
AssuranceContract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 3: Update Frontend (if address changed)
If the deployed address is different from `0x5FbDB2315678afecb367f032d93F642f64180aa3`:
1. Open `frontend/app.js`
2. Update line 1 with the new address:
   ```javascript
   const contractAddress = "YOUR_NEW_ADDRESS_HERE";
   ```

### Step 4: Open the Frontend
Simply open `frontend/index.html` in your web browser (double-click it or right-click → Open with → Browser)

### Step 5: Connect MetaMask
Make sure MetaMask is:
- Connected to `localhost:8545` network
- Using one of the Hardhat test accounts

## Troubleshooting

### Error: "ECONNREFUSED" or "could not detect network"
- Make sure the Hardhat node (Step 1) is still running
- Check that MetaMask is connected to `localhost:8545`

### Error: "No contract code found"
- Redeploy the contract (Step 2)
- Update the contract address in `app.js` (Step 3)

### Error: "Insufficient funds"
- Make sure you're using a Hardhat test account in MetaMask
- Import a private key from the Hardhat node output (shown when you run `npx hardhat node`)
