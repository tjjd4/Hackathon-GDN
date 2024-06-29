"use server";

import { enokiClient } from "@/lib/enokiClient";
import { suiClient } from "@/lib/suiClient";
import { fromB64, toB64 } from "@mysten/bcs";
import { Transaction } from "@mysten/sui/transactions";
import { admin, admin_kp, getTokenToBeSent } from "./common";
import { getBalance } from "./get_balance";

export const transfer = async (
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
  tx.setSenderIfNotSet(sender);

  const txBytes = await tx.build({
    client: suiClient,
    onlyTransactionKind: true,
  });
  const sponsored = await enokiClient.createSponsoredTransaction({
    network: "testnet",
    transactionKindBytes: toB64(txBytes),
    sender: admin,
    allowedMoveCallTargets: [
      `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::transfer`,
    ],
    allowedAddresses: [recipient],
  });

  const { signature } = await admin_kp.signTransaction(
    fromB64(sponsored.bytes)
  );

  await enokiClient.executeSponsoredTransaction({
    digest: sponsored.digest,
    signature,
  });
};
