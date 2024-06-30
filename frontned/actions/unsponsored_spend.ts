import { suiClient } from "@/lib/suiClient";
import { Transaction } from "@mysten/sui/transactions";
import { getTokenToBeSent } from "./get_token_to_spend";

export const easySpend = async (sender: string, amount: number) => {
  const tx = new Transaction();

  const { data: gooddeedtokens } = await suiClient.getOwnedObjects({
    owner: sender,
    filter: {
      StructType: `0x02::token::Token<${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN>`,
    },
    options: {
      showContent: true,
    },
  });

  if (!gooddeedtokens || gooddeedtokens.length === 0) {
    throw new Error("No tokens found for the sender");
  }

  const tokenId = gooddeedtokens[0].data?.objectId;

  if (!tokenId) {
    throw new Error("No token found");
  }

  console.log("tokenId", tokenId);

  const newToken = tx.moveCall({
    target: `0x02::token::split`,
    arguments: [tx.object(tokenId), tx.pure.u64(amount)],
    typeArguments: [
      `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
    ],
  });
  tx.transferObjects([newToken], tx.pure.address(sender));

  // tx.moveCall({
  //   target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::spend`,
  //   arguments: [tx.object(newToken)],
  //   typeArguments: [
  //     `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
  //   ],
  // });

  tx.setSender(sender);
  tx.setGasBudget(100_000_000);

  const txBytes = await tx.build({
    client: suiClient,
  });

  return txBytes;
};

export const unsponsoredSpend = async (sender: string, amount: number) => {
  const tx = new Transaction();

  const tokenToBeSent = await getTokenToBeSent(tx, sender, amount);

  tx.moveCall({
    target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::spend`,
    arguments: [tx.object(tokenToBeSent)],
    typeArguments: [
      `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
    ],
  });
  tx.setSender(sender);
  tx.setGasBudget(100_000_000);

  const txBytes = await tx.build({
    client: suiClient,
  });

  return txBytes;
};
