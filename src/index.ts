import "dotenv/config";
import express from "express";
import { mintTokens } from "./mintTokens";
const app = express();
const HELIUS_RESPONSE = {};
const VAULT = "9nnn19NzGyrsFVks8GMySjcN3EtoAJCsWXw9XhmWzCes";
app.post('/helius', async(req, res) => {
    const incomingTx = HELIUS_RESPONSE.nativeTransfers.find(x => x.toUserAccount === VAULT);
    if(!incomingTx) {
        res.json({ message: "Processed" });
        return;
    }
    const fromAddress = incomingTx.fromUserAccount;
    const toAddress = VAULT;
    const amount = incomingTx.amount;
    const type = "received_native_sol";
    // if(type === "received_native_sol") {
        await mintTokens(fromAddress, amount);
    // } else {
    //     // What could go wrong here?
    //     await burnTokens(fromAddress, toAddress, amount);
    //     await sendNativeTokens(fromAddress, toAddress, amount);
    // }
    res.send("Transaction Successful");
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});