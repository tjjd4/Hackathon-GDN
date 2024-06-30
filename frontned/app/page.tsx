"use client";

import { getBalance } from "@/actions/get_balance";
import Member from "@/components/member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useUserStore from "@/lib/store";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEnokiFlow, useZkLogin } from "@mysten/enoki/react";
import { BalanceChange } from "@mysten/sui/client";
import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { Transaction } from "@mysten/sui/transactions";
import { skipToken, useQuery } from "@tanstack/react-query";
import { track } from "@vercel/analytics";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { ExternalLink, LoaderCircle } from "lucide-react";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "./firebase";

export default function Page() {
  const client = useSuiClient(); // The SuiClient instance
  const enokiFlow = useEnokiFlow(); // The EnokiFlow instance
  const { address: suiAddress } = useZkLogin(); // The zkLogin instance
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  const [oauthParams, setOauthParams] =
    useState<queryString.ParsedQuery<string>>();
  /* The account information of the current user. */
  const [balance, setBalance] = useState<number>(0);
  // const [tokenBalance, setTokenBalance] = useState<number>(0);
  // const [tokenBalanceLoading, setTokenBalanceLoading] = useState<boolean>(true);
  const { data: tokenBalance, isLoading: tokenBalanceLoading } = useQuery({
    queryKey: ["tokenBalance", suiAddress],
    queryFn: !!suiAddress ? () => getBalance(suiAddress) : skipToken,
  });
  const [accountLoading, setAccountLoading] = useState<boolean>(true);
  // const [oauthParams, setOauthParams] = useState<queryString.ParsedQuery<string>>();
  const [jwtString, setJwtString] = useState("");
  const [decodedJwt, setDecodedJwt] = useState<JwtPayload>();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /* Transfer form state */
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [transferLoading, setTransferLoading] = useState<boolean>(false);

  /* Counter state */
  const [counter, setCounter] = useState<number>(0);
  const [counterLoading, setCounterLoading] = useState<boolean>(false);
  const [countLoading, setCountLoading] = useState<boolean>(true);
  const [users, setUsers] = useState([]);

  /**
   * Timeout for the counter.
   * This is used to refresh the counter every 5 seconds.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      getCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "users");
        const q = query(colRef, where("address", "==", suiAddress));
        const snapshot = await getDocs(q);
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (usersList.length > 0) {
          setUser(usersList[0]);
        } else {
          console.log("No matching documents found");
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchData();
  }, [suiAddress]);

  console.log(user, suiAddress);

  useEffect(() => {
    updateUser(suiAddress, 20);
  }, [suiAddress]);

  const updateUser = async (address: string, point: number) => {
    try {
      const docRef = doc(db, "users", address);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document already exists!");
      } else {
        await setDoc(docRef, {
          address: address,
          point: point,
        });
        console.log("Document successfully written!");
      }
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  /**
   * When the user logs in, fetch the account information.
   */
  useEffect(() => {
    if (suiAddress) {
      getAccountInfo();
      getCount();
    }
  }, [suiAddress]);

  const startLogin = async () => {
    // return null;
    const promise = async () => {
      enokiFlow
        .createAuthorizationURL({
          provider: "google",
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          redirectUrl: `http://localhost:3000/auth`,
          network: "testnet",
        })
        .then((url: string) => {
          console.log("url ", url);
          typeof window !== 'undefined' ?? window.location.href = url;

          // window.alert(url)
        })
        .catch((error: string) => {
          console.log(error);
        });
    };

    toast.promise(promise, {
      loading: "Loggin in...",
    });
  };

  /**
   * Fetch the account information of the current user.
   */
  const getAccountInfo = async () => {
    if (!suiAddress) {
      return;
    }

    setAccountLoading(true);

    const balance = await client.getBalance({ owner: suiAddress });
    setBalance(parseInt(balance.totalBalance) / 10 ** 9);

    setAccountLoading(false);
  };

  /**
   * Request SUI from the faucet.
   */
  const onRequestSui = async () => {
    const promise = async () => {
      track("Request SUI");

      // Ensures the user is logged in and has a SUI address.
      if (!suiAddress) {
        throw new Error("No SUI address found");
      }

      if (balance > 3) {
        throw new Error("You already have enough SUI!");
      }

      // Request SUI from the faucet.
      const res = await requestSuiFromFaucetV0({
        host: getFaucetHost("testnet"),
        recipient: suiAddress,
      });

      if (res.error) {
        throw new Error(res.error);
      }

      return res;
    };

    toast.promise(promise, {
      loading: "Requesting SUI...",
      success: (data) => {
        console.log("SUI requested successfully!", data);

        const suiBalanceChange = data.transferredGasObjects
          .map((faucetUpdate) => {
            return faucetUpdate.amount / 10 ** 9;
          })
          .reduce((acc: number, change: any) => {
            return acc + change;
          }, 0);

        setBalance(balance + suiBalanceChange);

        return "SUI requested successfully! ";
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  /**
   * Transfer SUI to another account. This transaction is not sponsored by the app.
   */
  async function transferSui() {
    const promise = async () => {
      track("Transfer SUI");

      setTransferLoading(true);

      // Validate the transfer amount
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        setTransferLoading(false);
        throw new Error("Invalid amount");
      }

      // Get the keypair for the current user.
      const keypair = await enokiFlow.getKeypair({ network: "testnet" });

      // Create a new transaction block
      const txb = new Transaction();

      // Add some transactions to the block...
      const [coin] = txb.splitCoins(txb.gas, [
        txb.pure.u64(parsedAmount * 10 ** 9),
      ]);
      txb.transferObjects([coin], txb.pure.address(recipientAddress));

      // Sign and execute the transaction block, using the Enoki keypair
      const res = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: txb,
        options: {
          showEffects: true,
          showBalanceChanges: true,
        },
      });

      setTransferLoading(false);

      console.log("Transfer response", res);

      if (res.effects?.status.status !== "success") {
        const suiBalanceChange =
          res.balanceChanges
            ?.filter((balanceChange: BalanceChange) => {
              return balanceChange.coinType === "0x2::sui::SUI";
            })
            .map((balanceChange: BalanceChange) => {
              return parseInt(balanceChange.amount) / 10 ** 9;
            })
            .reduce((acc: number, change: any) => {
              if (change.coinType === "0x2::sui::SUI") {
                return acc + parseInt(change.amount);
              }
              return acc;
            }) || 0;
        setBalance(balance - suiBalanceChange);
        throw new Error(
          "Transfer failed with status: " + res.effects?.status.error
        );
      }

      return res;
    };

    toast.promise(promise, {
      loading: "Transfer SUI...",
      success: (data) => {
        const suiBalanceChange =
          data.balanceChanges
            ?.filter((balanceChange: BalanceChange) => {
              return balanceChange.coinType === "0x2::sui::SUI";
            })
            .map((balanceChange: BalanceChange) => {
              return parseInt(balanceChange.amount) / 10 ** 9;
            })
            .reduce((acc: number, change: any) => {
              if (change.coinType === "0x2::sui::SUI") {
                return acc + parseInt(change.amount);
              }
              return acc;
            }) || 0;
        setBalance(balance - suiBalanceChange);

        return (
          <span className="flex flex-row items-center gap-2">
            Transfer successful!{" "}
            <a
              href={`https://suiscan.xyz/testnet/tx/${data.digest}`}
              target="_blank"
            >
              <ExternalLink width={12} />
            </a>
          </span>
        );
      },
      error: (error) => {
        return error.message;
      },
    });
  }

  async function getCount() {
    const res = (await client.getObject({
      id: "0xd710735500fc1be7dc448b783ad1fb0b5fd209890a67e518cc47e7dc26856aa6",
      options: {
        showContent: true,
      },
    })) as any;

    setCounter(res.data.content.fields.count as number);

    setCountLoading(false);
  }

  /**
   * Increment the global counter. This transaction is sponsored by the app.
   */
  async function incrementCounter() {
    const promise = async () => {
      track("Increment Counter");

      setCounterLoading(true);

      // Get the keypair for the current user.
      const keypair = await enokiFlow.getKeypair({ network: "testnet" });

      // Create a new transaction block
      const txb = new Transaction();

      // Add some transactions to the block...
      txb.moveCall({
        arguments: [
          txb.object(
            "0xd710735500fc1be7dc448b783ad1fb0b5fd209890a67e518cc47e7dc26856aa6"
          ),
        ],
        target:
          "0x5794fff859ee70e28ec8a419f2a73830fb66bcaaaf76a68e41fcaf5e057d7bcc::global_counter::increment",
      });

      try {
        // Sponsor and execute the transaction block, using the Enoki keypair
        const res = await enokiFlow.sponsorAndExecuteTransaction({
          transaction: txb,
          network: "testnet",
          client,
        });
        setCounterLoading(false);

        return res;
      } catch (error) {
        setCounterLoading(false);
        throw error;
      }
    };

    toast.promise(promise, {
      loading: "Incrementing counter...",
      success: (data) => {
        getCount();
        return (
          <span className="flex flex-row items-center gap-2">
            Counter incremented!{" "}
            <a
              href={`https://suiscan.xyz/testnet/tx/${data.digest}`}
              target="_blank"
            >
              <ExternalLink width={12} />
            </a>
          </span>
        );
      },
      error: (error) => {
        return error.message;
      },
    });
  }

  useEffect(() => {
    if (oauthParams && oauthParams.id_token) {
      const decodedJwt = jwtDecode(oauthParams.id_token as string);
      setJwtString(oauthParams.id_token as string);
      setDecodedJwt(decodedJwt);
      // loginBySub(oauthParams.id_token as string, decodedJwt.sub as string)
      localStorage.setItem("oauth", oauthParams.id_token);
    }
  }, [oauthParams]);

  return (
    <div className="flex flex-col items-center justify-start">
      {suiAddress && (
        <>
          <div>
            {/* <button
            onClick={async () => {
              // const balance = await getBalance(suiAddress);
              // console.log(balance);

              await transfer(
                suiAddress,
                "0x1027627a30ceaa4e7ec3d21bda45e10b806e520f8958a3d656cb335705b5cc74",
                10
              );
            }}
          >
            Click me
          </button> */}
            <h1 className="text-4xl font-bold m-4">GoodDeed</h1>
            <Popover>
              <PopoverTrigger
                className="absolute top-4 right-4 max-w-sm"
                asChild
              >
                <div>
                  <Button className="hidden sm:block" variant={"secondary"}>
                    {accountLoading || tokenBalanceLoading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      `${suiAddress?.slice(0, 5)}...${suiAddress?.slice(
                        63
                      )} - ${tokenBalance ? tokenBalance : 0} tokens`
                    )}
                  </Button>
                  <Avatar className="block sm:hidden">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <Card className="border-none shadow-none">
                  {/* <Button variant={'ghost'} size='icon' className="relative top-0 right-0" onClick={getAccountInfo}><RefreshCw width={16} /></Button> */}
                  <CardHeader>
                    <CardTitle>Account Info</CardTitle>
                    
                  </CardHeader>
                  <CardContent>
                    {accountLoading ? (
                      <div className="w-full flex flex-col items-center">
                        <LoaderCircle className="animate-spin" />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-row gap-1 items-center">
                          <span>Address: </span>
                          {accountLoading ? (
                            <LoaderCircle className="animate-spin" />
                          ) : (
                            <div className="flex flex-row gap-1">
                              <span>{`${suiAddress?.slice(
                                0,
                                5
                              )}...${suiAddress?.slice(63)}`}</span>
                              <a
                                href={`https://suiscan.xyz/testnet/account/${suiAddress}`}
                                target="_blank"
                              >
                                <ExternalLink width={12} />
                              </a>
                            </div>
                          )}
                        </div>
                        <div>
                          <span>Balance: </span>
                          <span>{`${tokenBalance ? tokenBalance : 0} tokens`}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-row gap-2 items-center justify-between">
                    
                    <Button
                      variant={"destructive"}
                      size={"sm"}
                      className="w-full text-center"
                      onClick={async () => {
                        await enokiFlow.logout();
                        window.location.reload();
                      }}
                    >
                      Logout
                    </Button>
                  </CardFooter>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
          <Member address={suiAddress} />
        </>
      )}

      {!suiAddress && (
        <>
          <h1 className="text-4xl font-bold m-4">Enoki Demo App</h1>
          <Button className="absolute right-5 top-5" onClick={startLogin}>
            Sign in with Google
          </Button>
        </>
      )}
    </div>
  );
}
