import { mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { PRIVATE_KEY, TOKEN_MINT_ADDRESS } from "./address";
import bs58 from "bs58";

// mint more tokens?
const connection = new Connection("https://api.devnet.solana.com");
function base58ToKeypair(base58PrivateKey: string): Keypair {
    try {
        const privateKeyBuffer = bs58.decode(base58PrivateKey);
        return Keypair.fromSecretKey(privateKeyBuffer);
    } catch(error) {
        throw new Error("Invalid base58 private key.");
    }
}
const keypair = base58ToKeypair(PRIVATE_KEY!);
export const mintTokens = async(fromAddress: string, amount: number) => {
    await mintTo(connection, keypair, TOKEN_MINT_ADDRESS, new PublicKey(fromAddress), keypair, amount);
}
// export const burnTokens = async(fromAddress: string, amount: number) => {
//     console.log("Burning Tokens");
// }
// export const sendNativeTokens = async(fromAddress: string, amount: number) => {
//     console.log("Sending Native Tokens");
// }