"use server";

import { suiClient } from "@/lib/suiClient";
import { Transaction } from "@mysten/sui/transactions";

export const getBalance = async (address: string) => {
  const tx = new Transaction();

  const { data: gooddeedtokens } = await suiClient.getOwnedObjects({
    owner: address,
    filter: {
      StructType: `0x02::token::Token<${process.env.NEXT_PUBLIC_PACKAGE_ID}::gooddeedtoken::GOODDEEDTOKEN>`,
    },
    options: {
      showContent: true,
    },
  });

  // Initialize the total balance
  let totalBalance = 0;

  // Iterate through the tokens and sum up the balances
  gooddeedtokens.forEach((token: any) => {
    // Navigate through the nested structure to find the balance value
    console.log("test", token.data.content.fields.balance);
    if (
      token &&
      token.data &&
      token.data.content &&
      token.data.content.fields &&
      token.data.content.fields.balance
    ) {
      const balanceValue = token.data.content.fields.balance;

      console.log("balanceValue:", balanceValue);

      totalBalance += parseInt(balanceValue, 10);
    }
  });

  // Return the total balance
  return totalBalance;
};
