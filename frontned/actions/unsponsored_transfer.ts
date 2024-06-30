import { suiClient } from "@/lib/suiClient";
import { Transaction } from "@mysten/sui/transactions";
import { getBalance } from "./get_balance";
import { getTokenToBeSent } from "./get_token_to_spend";

export const unsponsoredTransfer = async (
  sender: string,
  recipient: string,
  amount: number
) => {
  const tx = new Transaction();

  const balance = await getBalance(sender);
  if (balance < amount) {
    throw new Error("Not enough balance");
  }
  const tokenToBeSent = await getTokenToBeSent(tx, sender, amount);

  tx.moveCall({
    target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::transfer`,
    arguments: [tx.object(tokenToBeSent), tx.pure.address(recipient)],
  });
  tx.setSender(sender);
  tx.setGasBudget(100_000_000);

  const txBytes = await tx.build({
    client: suiClient,
  });

  return txBytes;
};
