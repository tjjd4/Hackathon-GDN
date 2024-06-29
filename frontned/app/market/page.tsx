"use client";

import { useEffect, useState } from "react";
import { MarketPlace } from "@/components/market-place";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Github, LoaderCircle, RefreshCw } from "lucide-react";
import { useEnokiFlow, useZkLogin } from "@mysten/enoki/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useUserStore from "@/lib/store";

import { useSuiClient } from "@mysten/dapp-kit";

export default function MarketPage() {
  const [accountLoading, setAccountLoading] = useState<boolean>(true);
  const { address: suiAddress } = useZkLogin(); // The zkLogin instance
  const [balance, setBalance] = useState<number>(0);
  const { user } = useUserStore();
  const enokiFlow = useEnokiFlow(); // The EnokiFlow instance
  const client = useSuiClient(); // The SuiClient instance

  const getAccountInfo = async () => {
    if (!suiAddress) {
      return;
    }

    setAccountLoading(true);

    const balance = await client.getBalance({ owner: suiAddress });
    setBalance(parseInt(balance.totalBalance) / 10 ** 9);

    setAccountLoading(false);
  };

  useEffect(() => {
    if (suiAddress) {
      getAccountInfo();
      //   getCount();
    }
  }, [suiAddress]);

  return (
    <div className="flex items-center justify-center">
      <MarketPlace />
    </div>
  );
}
