import "server-only";

import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const admin_kp = Ed25519Keypair.deriveKeypair(process.env.MNEMONICS!);

const pk = admin_kp.getPublicKey();
export const admin = pk.toSuiAddress();
