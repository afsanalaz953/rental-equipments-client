import React from 'react';


//  import UpdateModal from "@/components/shared/UpdateModal";


import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const AdminAllequipmentsPage = async() => {
// const tokenObj = await auth.api.getToken({
//        headers: await headers()
//      })
//       console.log(tokenObj, "adminProductToken")


// const AllProducts = async() => {
const res = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/products/all`,
 { cache: 'no-store',
// headers:{
//       authorization: `Bearer ${tokenObj.token}`
//    }

  }
)
const adminProductsData = await res.json();

console.log(adminProductsData, "adminproducts");




    return (
        <div>
            Admin allequipments
        </div>
    );
};

export default AdminAllequipmentsPage;