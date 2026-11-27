"use client";
import React, { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import EditModal from "@/components/shared/EditModal";
import Link from "next/link";

const CustomerProfilePage = () => {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isPending) return <div>Loading...</div>;

  return (
    <div className='bg-slate-100 shadow-sm  p-20 m-40'>
      <div className="card bg-base-100 w-150 h-100 shadow-sm container mx-auto">
        <figure className="px-10 pt-10">
          {/* ইমেজ দেখাতে চাইলে আনকমেন্ট করুন */}
          {/* <Image src={user?.image} alt="author" width={150} height={150} /> */}
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title font-bold text-3xl">{user?.name}</h2>
          <p className='text-lg'>{user?.email}</p>
          <p className='text-lg'>{user?.phone}</p>
          <p className='text-lg'>{user?.address}</p>
          <div className="card-actions flex flex-col gap-4">
            {/* <Button as={Link} href="/" color="success">Home</Button> */}
            <Button type="submit"  className='w-full bg-amber-600' ><Link href ={"/"} >Home </Link> </Button>
            <Button 
              color="primary" 
              className='w-40 bg-[#142A5E] text-white mx-auto'
              onPress={() => setIsModalOpen(true)}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      {/* মডাল কম্পোনেন্টে refetch পাঠানো হচ্ছে */}
      <EditModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        profile={{ userId: user?.id, userName: user?.name, image: user?.image,
           phone: user?.phone, address: user?.address }}
        refetch={refetch}   // <-- এটা যোগ করুন
      />
    </div>
  );
};

export default CustomerProfilePage;
















