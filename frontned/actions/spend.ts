"use server";

import { enokiClient } from "@/lib/enokiClient";
import { suiClient } from "@/lib/suiClient";
import { fromB64, toB64 } from "@mysten/bcs";
import { Transaction } from "@mysten/sui/transactions";
import { admin, admin_kp } from "./common";
import { getTokenToBeSent } from "./get_token_to_spend";

export const spend = async (sender: string, amount: number) => {
  const tx = new Transaction();

  const tokenToBeSent = await getTokenToBeSent(tx, sender, amount);

  tx.moveCall({
    target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::spend`,
    arguments: [tx.object(tokenToBeSent)],
    typeArguments: [
      `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
    ],
  });

  const txBytes = await tx.build({
    client: suiClient,
    onlyTransactionKind: true,
  });
  const sponsored = await enokiClient.createSponsoredTransaction({
    network: "testnet",
    transactionKindBytes: toB64(txBytes),
    sender: admin,
    allowedMoveCallTargets: [
      `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::spend`,
    ],
    allowedAddresses: [sender],
  });

  const { signature } = await admin_kp.signTransaction(
    fromB64(sponsored.bytes)
  );

  await enokiClient.executeSponsoredTransaction({
    digest: sponsored.digest,
    signature,
  });
};
