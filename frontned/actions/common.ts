import "server-only";

import { suiClient } from "@/lib/suiClient";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";

export const admin_kp = Ed25519Keypair.deriveKeypair(process.env.MNEMONICS!);

const pk = admin_kp.getPublicKey();
export const admin = pk.toSuiAddress();

export const getTokenToBeSent = async (
  tx: Transaction,
  sender: string,
  amount: number
) => {
  const { data: gooddeedtokens } = await suiClient.getOwnedObjects({
    owner: sender,
    filter: {
      StructType: `0x02::token::Token<${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN>`,
    },
    options: {
      showContent: true,
    },
  });

  let totalSelected = 0;
  let tokenToBeJoined: any = null;
  let tokenToBeSent: any = null;
  for (const token of gooddeedtokens) {
    const shortage = amount - totalSelected;

    const balanceValue = (token.data?.content as any).fields.balance;
    const balance = parseInt(balanceValue, 10);

    console.log("amount", amount);
    console.log("totalSelected", totalSelected);
    console.log("shortage", shortage);
    console.log("balance", balance);

    const tokenRef = tx.objectRef({
      objectId: token.data?.objectId ?? "",
      version: token.data?.version ?? "",
      digest: token.data?.digest ?? "",
    });

    if (balance > shortage) {
      const token = tx.moveCall({
        target: `0x02::token::split`,
        arguments: [tokenRef, tx.pure.u64(amount)],
        typeArguments: [
          `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
        ],
      });

      tokenToBeSent = !!tokenToBeJoined
        ? tx.moveCall({
            target: `0x02::token::join`,
            arguments: [tx.object(token), tx.object(tokenToBeJoined)],
            typeArguments: [
              `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
            ],
          })
        : token;

      break;
    } else if (balance === shortage) {
      tokenToBeSent = !!tokenToBeJoined
        ? tx.moveCall({
            target: `0x02::token::join`,
            arguments: [tokenRef, tx.object(tokenToBeJoined)],
            typeArguments: [
              `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
            ],
          })
        : tx.object(tokenRef);

      break;
    } else {
      !!tokenToBeJoined
        ? (tokenToBeJoined = tx.moveCall({
            target: `0x02::token::join`,
            arguments: [tokenRef, tx.object(tokenToBeJoined)],
            typeArguments: [
              `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
            ],
          }))
        : (tokenToBeJoined = tokenRef);

      totalSelected += balance;
    }
  }

  return tokenToBeSent;
};
