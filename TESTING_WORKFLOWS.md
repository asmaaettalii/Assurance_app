# 🧪 Insurance DApp - Testing Workflows

This guide provides step-by-step workflows to test all features of the Insurance DApp.

## Prerequisites Setup

Before testing, ensure:
1. ✅ Hardhat node is running (`npx hardhat node`)
2. ✅ Contract is deployed (`npx hardhat run scripts/deploy.js --network localhost`)
3. ✅ Frontend is open in browser (`frontend/index.html`)
4. ✅ MetaMask is installed and connected to `localhost:8545`
5. ✅ Two test accounts imported into MetaMask (Account #0 as Insurer, Account #1 as Insured)

---

## 📋 Workflow 1: Complete Happy Path (All Steps Work)

This workflow tests the complete insurance lifecycle without errors.

### Step 1: Setup Accounts
- **Account #0 (Insurer)**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Account #1 (Insured)**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

### Step 2: Connect as Insurer (Account #0)
1. Switch MetaMask to **Account #0**
2. Click **"Connect Wallet"** button
3. ✅ Should see: "Wallet connected successfully!" (green alert)

### Step 3: Create New Contract
1. Fill in the form:
   - **Insured Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (Account #1)
   - **Premium Amount**: `1` (ETH)
   - **Indemnity Amount**: `2` (ETH)
2. Click **"Create Contract"**
3. Confirm in MetaMask
4. ✅ Should see: "Contract created successfully!" (green alert)
5. Note: First contract ID is always `0`

### Step 4: View Contract Details
1. Enter Contract ID: `0`
2. Click **"Get Contract Details"**
3. ✅ Should see:
   - Insurer: `0xf39Fd6...` (Account #0)
   - Insured: `0x70997...` (Account #1)
   - Premium: `1 ETH`
   - Indemnity: `2 ETH`
   - Status: `ACTIF`
   - Paid: `No`

### Step 5: Switch to Insured and Pay Premium
1. Switch MetaMask to **Account #1** (Insured)
2. Click **"Connect Wallet"** again
3. Make sure Contract ID is still `0`
4. Click **"Pay Premium"**
5. Confirm in MetaMask (paying 1 ETH)
6. ✅ Should see: "Premium paid successfully!" (green alert)
7. Contract status should update to `Paid: Yes`

### Step 6: Declare Claim (Still as Insured)
1. Still on **Account #1** (Insured)
2. Contract ID: `0`
3. Click **"Declare Claim"**
4. Confirm in MetaMask
5. ✅ Should see: "Claim declared successfully!" (green alert)
6. Contract status should update to `Status: SINISTRE`

### Step 7: Pay Indemnity (Switch to Insurer)
1. Switch MetaMask back to **Account #0** (Insurer)
2. Click **"Connect Wallet"**
3. Enter Contract ID in the **Pay Indemnity** section: `0`
4. Click **"Pay Indemnity"**
5. Confirm in MetaMask (paying 2 ETH)
6. ✅ Should see: "Indemnity paid successfully!" (green alert)
7. Contract status should update to `Status: INDEMNISE`

### ✅ Workflow 1 Complete!
The contract lifecycle is now complete: Created → Premium Paid → Claim Declared → Indemnity Paid

---

## 🚫 Workflow 2: Testing Error Cases

This workflow deliberately triggers errors to test validation.

### Test Case 1: Trying to Declare Claim Without Paying Premium
1. Create a new contract (as Account #0, insurer)
2. Switch to Account #1 (insured)
3. Try to click **"Declare Claim"** on the new contract
4. ⚠️ Should see: "Premium Not Paid: You must pay the premium before declaring a claim"

### Test Case 2: Wrong Person Trying to Pay Premium
1. Create a new contract (as Account #0)
2. **Stay on Account #0** (don't switch to insured)
3. Try to click **"Pay Premium"**
4. 🚫 Should see: "Access Denied: Only the insured person can pay the premium"

### Test Case 3: Trying to Pay Indemnity Without Claim
1. Create a new contract
2. Switch to Account #1 and pay premium
3. Switch back to Account #0 (insurer)
4. Try to click **"Pay Indemnity"** WITHOUT declaring claim first
5. ⚠️ Should see: "No Claim Declared: You must declare a claim before paying indemnity"

### Test Case 4: Trying to Pay Indemnity as Non-Insurer
1. Create contract, pay premium, declare claim
2. **Stay on Account #1** (insured) instead of switching
3. Try to click **"Pay Indemnity"**
4. 🚫 Should see: "Access Denied: Only the insurer can pay the indemnity"

---

## 📊 Workflow 3: List My Contracts

Test the "List My Contracts" feature.

### Step 1: Create Multiple Contracts
1. As Account #0 (insurer), create 3 contracts:
   - Contract with Account #1 as insured
   - Contract with Account #2 as insured
   - Contract with Account #1 as insured (again)

### Step 2: View from Insurer Perspective
1. Stay on Account #0
2. Click **"List My Contracts"**
3. ✅ Should see all 3 contracts listed

### Step 3: View from Insured Perspective
1. Switch to Account #1 (insured)
2. Connect wallet
3. Click **"List My Contracts"**
4. ✅ Should see 2 contracts (where Account #1 is the insured)

---

## 🎯 Workflow 4: Multi-Contract Management

Test managing multiple contracts simultaneously.

### Scenario: Two Active Insurance Policies

**Contract 0**: Car Insurance
- Insurer: Account #0
- Insured: Account #1
- Premium: 0.5 ETH
- Indemnity: 3 ETH

**Contract 1**: Home Insurance
- Insurer: Account #0
- Insured: Account #2
- Premium: 1.5 ETH
- Indemnity: 10 ETH

### Steps:
1. Create both contracts as Account #0
2. Switch to Account #1, pay premium for Contract 0
3. Switch to Account #2, pay premium for Contract 1
4. Switch to Account #1, declare claim for Contract 0
5. Switch to Account #0, pay indemnity for Contract 0
6. Contract 1 remains in active state

---

## 🔍 Common Issues & Solutions

### Issue: "Internal JSON-RPC Error"
**Cause**: Hardhat node not running
**Solution**: Run `npx hardhat node` in terminal

### Issue: "No contract code found"
**Cause**: Contract not deployed
**Solution**: Run `npx hardhat run scripts/deploy.js --network localhost`

### Issue: Contract address mismatch
**Cause**: Node was restarted, old contract address no longer valid
**Solution**: 
1. Redeploy contract
2. Update address in `frontend/app.js` line 1

### Issue: "Insufficient funds"
**Cause**: Test account doesn't have enough ETH
**Solution**: Use a fresh Hardhat test account (they start with 10,000 ETH)

### Issue: Transaction stuck
**Cause**: MetaMask nonce issue after node restart
**Solution**: 
1. MetaMask → Settings → Advanced → Clear activity tab data
2. Reconnect wallet

---

## ✅ Testing Checklist

Use this checklist to ensure all features work:

- [ ] Wallet connection works
- [ ] Creating contract works
- [ ] Viewing contract details works
- [ ] Paying premium works (as insured)
- [ ] Declaring claim works (as insured)
- [ ] Paying indemnity works (as insurer)
- [ ] List my contracts works
- [ ] Error messages display correctly
- [ ] Can't pay premium as wrong person
- [ ] Can't declare claim without paying premium
- [ ] Can't pay indemnity without claim
- [ ] Can't pay indemnity as wrong person
- [ ] Multiple contracts can coexist
- [ ] Success messages show with green alerts
- [ ] Error messages show with red alerts  
- [ ] Info messages show with blue alerts

---

## 🎓 Understanding the Error Messages

Your DApp now has **modern, user-friendly error messages**:

| Error | Icon | Meaning | Solution |
|-------|------|---------|----------|
| Premium Not Paid | ⚠️ | Claim declared before premium paid | Pay premium first |
| Access Denied | 🚫 | Wrong wallet trying action | Switch to correct wallet |
| No Claim Declared | ⚠️ | Indemnity paid before claim | Declare claim first |
| Already Paid | ℹ️ | Premium already paid | No action needed |
| Insufficient Funds | 💰 | Not enough ETH | Use account with more ETH |
| Transaction Cancelled | 🚫 | User rejected in MetaMask | Approve transaction |

---

## 🚀 Quick Test Script

For rapid testing, copy these Hardhat account addresses:

```
Account #0 (Insurer): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account #1 (Insured): 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Account #2 (Insured): 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```

**5-Minute Complete Test:**
1. Connect as Account #0
2. Create contract with Account #1, premium 1 ETH, indemnity 2 ETH
3. Switch to Account #1, pay premium
4. Declare claim
5. Switch to Account #0, pay indemnity
6. ✅ Complete lifecycle tested!
