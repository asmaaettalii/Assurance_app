# 📖 Understanding Error Messages

## What Are These Errors?

The errors you're seeing are **NOT bugs** - they're **smart contract validations working correctly**! 

Your insurance contract has business rules (like "you must pay premium before declaring a claim"), and when someone tries to break these rules, the blockchain rejects the transaction and sends an error message.

---

## ✨ Before vs After - Error Display

### ❌ OLD (Technical & Confusing)
```
Error: execution reverted: "Prime non payee" (action="estimateGas", data="0x08c379a0000000...", reason="Prime non payee", transaction={...})
```

### ✅ NEW (Modern & User-Friendly)
```
⚠️ Premium Not Paid: You must pay the premium before declaring a claim. Click 'Pay Premium' first.
```

---

## 🔄 The Correct Insurance Workflow

Your smart contract enforces this specific order:

```
┌─────────────────────────────────────────────────────────┐
│  1. CREATE CONTRACT                                     │
│     👤 Who: Insurer (Account #0)                        │
│     📝 What: Set insured, premium, indemnity amounts    │
│     ✅ Result: Contract ID created                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  2. PAY PREMIUM                                         │
│     👤 Who: Insured (Account #1)                        │
│     💰 What: Pay the premium amount                     │
│     ⚠️ Must do: This step BEFORE declaring claim        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  3. DECLARE CLAIM                                       │
│     👤 Who: Insured (Account #1)                        │
│     📢 What: Report that an incident occurred           │
│     ⚠️ Must do: After paying premium                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  4. PAY INDEMNITY                                       │
│     👤 Who: Insurer (Account #0)                        │
│     💸 What: Pay the indemnity to insured               │
│     ⚠️ Must do: After claim is declared                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 Why You Got Those Errors

### Error 1: "Prime non payee" (Premium Not Paid)
**What happened:** You tried to **declare a claim** (step 3) before **paying premium** (step 2)

**The rule:** Smart contract requires premium payment BEFORE allowing claims

**Solution:** Always pay premium first, then declare claim

---

### Error 2: "Seul l'assure peut payer" (Only Insured Can Pay)
**What happened:** You tried to **pay premium** using the **insurer's wallet** (Account #0)

**The rule:** Only the insured person can pay their own premium

**Solution:** Switch to the insured's wallet (Account #1) to pay premium

---

### Error 3: "Pas de sinistre declare" (No Claim Declared)
**What happened:** You tried to **pay indemnity** (step 4) before **declaring claim** (step 3)

**The rule:** Can't pay indemnity if no claim was declared

**Solution:** Declare claim first, then pay indemnity

---

## 🎨 New Modern Error Messages

Your app now shows color-coded alerts!

### 🟢 Success Messages (Green)
- ✅ Wallet connected successfully!
- ✅ Contract created successfully!
- ✅ Premium paid successfully!
- ✅ Claim declared successfully!
- ✅ Indemnity paid successfully!

### 🔵 Info Messages (Blue)
- ℹ️ Creating contract... Please confirm in MetaMask.
- ℹ️ Transaction sent. Waiting for confirmation...

### 🔴 Error Messages (Red)
- ❌ Generic errors
- ⚠️ Workflow errors (wrong order)
- 🚫 Permission errors (wrong person)
- 💰 Payment errors (insufficient funds)

---

## 🎯 Quick Reference: Who Can Do What?

| Action | Who Can Do It | When Can They Do It |
|--------|---------------|---------------------|
| Create Contract | **Insurer** (Account #0) | Anytime |
| Pay Premium | **Insured** (Account #1) | After contract created |
| Declare Claim | **Insured** (Account #1) | After premium paid |
| Pay Indemnity | **Insurer** (Account #0) | After claim declared |

---

## 🔧 How to Test Without Errors

Follow this exact sequence:

```bash
# 1. Connect as Insurer
Switch to Account #0 → Click "Connect Wallet"

# 2. Create Contract
Fill form → Click "Create Contract"
(Remember the Contract ID, usually 0 for first contract)

# 3. Switch to Insured
Switch to Account #1 → Click "Connect Wallet" again

# 4. Pay Premium
Enter Contract ID → Click "Pay Premium" → Confirm in MetaMask

# 5. Declare Claim (stay on Account #1)
Click "Declare Claim" → Confirm in MetaMask

# 6. Switch Back to Insurer
Switch to Account #0 → Click "Connect Wallet"

# 7. Pay Indemnity
Enter Contract ID → Click "Pay Indemnity" → Confirm in MetaMask

✅ SUCCESS! No errors!
```

---

## 💡 Pro Tips

1. **Always check which wallet you're using** - Most errors come from using the wrong account
2. **Follow the workflow order** - Each step depends on the previous one
3. **Watch the colored alerts** - They tell you exactly what's happening
4. **Use the test accounts** - They have 10,000 ETH each, plenty for testing
5. **If stuck, restart fresh** - Create a new contract and follow the workflow again

---

## 🎓 Learn More

For complete testing workflows, see:
- [`TESTING_WORKFLOWS.md`](./TESTING_WORKFLOWS.md) - Step-by-step test cases
- [`QUICK_START.md`](./QUICK_START.md) - Getting the app running

---

## 📞 Still Having Issues?

Check these:
1. ✅ Is Hardhat node running? (`npx hardhat node`)
2. ✅ Is contract deployed? (See deployment address in terminal)
3. ✅ Is MetaMask connected to `localhost:8545`?
4. ✅ Are you using the correct test account?
5. ✅ Is the frontend open in browser?

If all checked and still having issues, try:
- Close and restart Hardhat node
- Redeploy contract
- Clear MetaMask activity data (Settings → Advanced)
- Refresh browser page
