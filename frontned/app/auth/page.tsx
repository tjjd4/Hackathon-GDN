'use client';

import { useAuthCallback } from "@mysten/enoki/react";
import { useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useHash } from "@/lib/getHash" 

export default function Page() {

  const { handled } = useAuthCallback(); // This hook will handle the callback from the authentication provider
  const getHash = useHash()
  console.log('getHash', getHash)
  console.log('handled', handled)
  useEffect(() => {
    if (handled) {
     window.location.href = "/";
    }
}, [handled]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <ScaleLoader color="#000" />
    </div>
  );
}