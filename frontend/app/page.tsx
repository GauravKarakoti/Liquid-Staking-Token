"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const VAULT_ADDRESS = new PublicKey("9nnn19NzGyrsFVks8GMySjcN3EtoAJCsWXw9XhmWzCes");

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleStake = async () => {
    if (!publicKey) {
      setStatus("Please connect your wallet first.");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setStatus("Please enter a valid amount of SOL.");
      return;
    }

    try {
      setStatus("Initiating transaction...");
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: VAULT_ADDRESS,
          lamports: Number(amount) * LAMPORTS_PER_SOL,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      
      setStatus("Confirming transaction...");

      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      
      setStatus(`Success! Transaction signature: ${signature}. Your Liquid Staking Tokens should arrive shortly!`);
      setAmount("");
    } catch (error: any) {
      console.error("Staking failed", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Liquid Staking
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Stake your Devnet SOL to receive LSTs.
        </p>

        <div className="flex justify-center mb-6">
          <WalletMultiButton />
        </div>

        {publicKey && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Amount to Stake (SOL)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 0.5"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleStake}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Stake SOL
            </button>
          </div>
        )}

        {status && (
          <div className={`mt-6 p-4 rounded-lg text-sm break-words ${status.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-blue-900/50 text-blue-200'}`}>
            {status}
          </div>
        )}
      </div>
    </main>
  );
}