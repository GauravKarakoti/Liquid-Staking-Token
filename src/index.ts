import "dotenv/config";
import express from "express";
import { mintTokens } from "./mintTokens";
const app = express();
app.use(express.json());
const VAULT = "9nnn19NzGyrsFVks8GMySjcN3EtoAJCsWXw9XhmWzCes";
app.post('/helius', async(req, res) => {
    try {
        const transactions = req.body;

        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            res.status(400).send("No transactions found");
            return;
        }

        for (const tx of transactions) {
            if (tx.nativeTransfers) {
                const incomingTx = tx.nativeTransfers.find((x: any) => x.toUserAccount === VAULT);
                if(incomingTx) {
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
                }
            }
        }
        res.send("Transaction Successful");
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});