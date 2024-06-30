"use client";

import { getBalance } from "@/actions/get_balance";
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import TaskModal from "./taskModal";

export default function Member({ address }: { address: string }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const user = useUserStore((state) => state.user);
  const [tasks, setTasks] = useState([]);

  const { data: tokenBalance, isLoading: tokenBalanceLoading } = useQuery({
    queryKey: ["tokenBalance", address],
    queryFn: () => getBalance(address),
  });

  const handleTaskModal = () => setShowTaskModal(!showTaskModal);
  const [userTasks, setUserTasks] = useState([]);

  const handleSaveTask = async (newTask: any) => {
    // setTasks([...tasks, newTask]);
    try {
      const tasksCollectionRef = collection(db, "tasks");
      await addDoc(tasksCollectionRef, newTask);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    setShowTaskModal(false); // Close the modal after saving the task
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollectionRef = collection(db, "tasks");
        const snapshot = await getDocs(tasksCollectionRef);
        const tasksList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksList);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();

    const fetchUserTasks = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const q = query(
          usersCollectionRef,
          where("address", "==", user.address)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserTasks(userDoc.data().tasks || []);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user tasks:", error);
      }
    };

    fetchTasks();
    if (user?.address) {
      fetchUserTasks();
    }
  }, [tasks]);

  const handleParticipate = async (task) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("address", "==", user.address));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(db, "users", userDoc.id);
        await updateDoc(userDocRef, {
          tasks: [...(userDoc.data().tasks || []), task],
        });
        console.log("Task added to user:", task);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error participating in task:", error);
    }
  };

  // Filter out tasks that are already assigned to the user
  const availableTasks = tasks.filter(
    (task) => !userTasks.some((userTask) => userTask.id === task.id)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-5 h-5" />
              <div className="flex items-center gap-2 text-lg font-medium">
                {tokenBalanceLoading ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <span>{tokenBalance}</span>
                )}
                <span>Tokens</span>
              </div>
            </div>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Exchange Tokens
            </Link>
          </div>
          <div className="bg-background rounded-lg p-4">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Past Activities</h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-medium">Beach Cleanup</h4>
                    <p className="text-muted-foreground text-sm">
                      Completed on June 15, 2023
                    </p>
                  </div>
                  <span className="text-base font-medium">+50 Tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-medium">Soup Kitchen</h4>
                    <p className="text-muted-foreground text-sm">
                      Completed on May 20, 2023
                    </p>
                  </div>
                  <span className="text-base font-medium">+75 Tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-medium">Tutoring</h4>
                    <p className="text-muted-foreground text-sm">
                      Completed on April 10, 2023
                    </p>
                  </div>
                  <span className="text-base font-medium">+100 Tokens</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg p-4">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">New Tasks</h3>
              {availableTasks.length > 0 ? (
                <div className="grid gap-2">
                  {availableTasks.map((task, index) => (
                    <div key={task.id} className="bg-background rounded-lg p-4">
                      <div className="flex gap-4 justify-start items-center">
                        <h4 className="text-lg font-bold">
                          {index + 1}. {task?.taskName}
                        </h4>
                      </div>
                      <p className="text-muted-foreground">
                        {task?.taskTaskDescription}. <br /> Earn{" "}
                        {task?.totalPoint} tokens for completing this task.
                      </p>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleParticipate(task)}
                        >
                          Participate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="my-5">No new tasks available right now.</p>
              )}
            </div>

            <div className="border-t border-black mb-2"></div>

            <div className="grid gap-2">
              {userTasks.length > 0 && (
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">Your Tasks</h3>
                  <div className="grid gap-2">
                    {userTasks.map((task, index) => (
                      <div key={index} className="bg-background rounded-lg p-4">
                        <div className="flex gap-4 justify-start items-center">
                          <h4 className="text-lg font-bold">
                            {index + 1}. {task?.taskName}
                          </h4>
                        </div>
                        <p className="text-muted-foreground">
                          {task?.description} Earn {task?.point} tokens for
                          completing this task.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <h2 className="text-5xl my-10 w-full flex justify-center">NPO</h2>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-5 h-5" />
              <div className="flex items-center gap-2 text-lg font-medium">
                {tokenBalanceLoading ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <span>{tokenBalance}</span>
                )}
                <span>Tokens</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Upload Description
              </Button>
              <Button size="sm" onClick={handleTaskModal}>
                Add New Task
              </Button>
              <Button variant="outline" size="sm">
                Donate Tokens
              </Button>
              <Button variant="outline" size="sm">
                Set Up Token Acceptance
              </Button>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="bg-background rounded-lg p-4">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">About Us</h3>
                <p className="text-muted-foreground">
                  We are a company committed to making a positive impact in our
                  community. Through our partnership with GoodDeed, we are able
                  to create volunteer opportunities and reward participants with
                  tokens.
                </p>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Volunteer Tasks</h3>
                <div className="grid gap-2">
                  <div className="bg-background rounded-lg p-4">
                    <h4 className="text-lg font-bold">Beach Cleanup</h4>
                    <p className="text-muted-foreground">
                      Help clean up the local beach and protect the environment.
                      Earn 50 tokens for completing this task.
                    </p>
                    <div className="flex justify-between items-end my-5">
                    <div>
            <label for="member" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">members</label>
            <input type="text" id="member" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
        </div>
                      <Button variant="outline" size="sm">
                        Confirm
                      </Button>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <h4 className="text-lg font-bold">Soup Kitchen</h4>
                    <p className="text-muted-foreground">
                      Volunteer at the local soup kitchen to provide meals for
                      those in need. Earn 75 tokens for completing this task.
                    </p>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Edit Task
                      </Button>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <h4 className="text-lg font-bold">Tutoring</h4>
                    <p className="text-muted-foreground">
                      Help tutor underprivileged students in your community.
                      Earn 100 tokens for completing this task.
                    </p>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Edit Task
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 GoodDeed. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function WalletIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}
