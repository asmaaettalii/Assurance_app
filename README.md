# Blockchain Insurance DApp

A decentralized application for parametric insurance on Ethereum.

## Features
- **Insurer**: Create contracts, pay indemnities.
- **Insured**: View contracts, pay premiums, declare claims.
- **Smart Contract**: Automated state management (Active -> Claimed -> Indemnified).

## Quick Start

1.  **Install**
    ```bash
    npm install
    ```

2.  **Start Node**
    ```bash
    npx hardhat node
    ```

3.  **Deploy**
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```

4.  **Run Frontend**
    Update `contractAddress` in `frontend/app.js` with the deployed address.
    ```bash
    npx http-server frontend
    ```

5.  **Use**
    Open `http://localhost:8080` (or port shown) and connect MetaMask (Localhost 8545).
