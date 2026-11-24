"use client";

import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const DEFAULT_AVATAR = "/default-avatar.png"; // public folder এ একটা রাখুন

const DropDownHover = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userRole = session?.user?.role;
  console.log(userRole, 'users role')
  console.log(session, 'session')
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/signin");
  };

  return (
    <DropdownMenu>
      {/* 👇 Trigger এ Avatar বসানো হলো */}
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="rounded-full flex flex-col gap-2 justify-center items-center  w-20 h-20 border-transparent hover: transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Image
              src={user?.image || DEFAULT_AVATAR}
              alt={user?.name || "User"}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-[#FFC000] ">{user?.role}</span>
          </button>
        }
      />

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Link href='/profile' className="flex gap-2 items-center">
           <UserIcon />
           <span>Profile</span> 
           </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
        <Link href='/manage' className="flex gap-2 items-center ">
          <SettingsIcon /> 
          <span>Manage </span> 
        </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem>
      <Link href='/dashboard/${user.role}' className="flex gap-2 items-center ">
         <CreditCardIcon />
          <span> Dashboard</span>
          </Link>
        </DropdownMenuItem>
         {/* <DropdownMenuItem>
      <Link href='/profile' className="flex gap-2 items-center ">
        <UserIcon />
          <span> Profile</span>
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOutIcon /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownHover;





