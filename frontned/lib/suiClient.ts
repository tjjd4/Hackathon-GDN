import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

export const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });
