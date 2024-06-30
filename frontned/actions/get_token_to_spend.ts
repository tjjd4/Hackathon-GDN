import { suiClient } from "@/lib/suiClient";
import { Transaction } from "@mysten/sui/transactions";

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

    const tokenRef = tx.objectRef({
      objectId: token.data?.objectId ?? "",
      version: token.data?.version ?? "",
      digest: token.data?.digest ?? "",
    });

    if (balance > shortage) {
      const newToken = tx.moveCall({
        target: `0x02::token::split`,
        arguments: [tokenRef, tx.pure.u64(amount)],
        typeArguments: [
          `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
        ],
      });
      tx.transferObjects([tx.object(newToken)], tx.pure.address(sender));

      tokenToBeSent = !!tokenToBeJoined
        ? tx.moveCall({
            target: `0x02::token::join`,
            arguments: [tx.object(newToken), tx.object(tokenToBeJoined)],
            typeArguments: [
              `${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN`,
            ],
          })
        : newToken;

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
