
import React from 'react';
import { FaRegHeart } from "react-icons/fa";
import { TbPrism } from "react-icons/tb";

// import BuyerOverviewWishcard from '@/components/dashboard/BuyerOverviewWishcard'
import CustomerOverviewOrderscard from '@/components/customer/CustomerOverviewOrderscard'
// import BuyerOverviewPaycard from '@/components/dashboard/BuyerOverviewPaycard'
// import RecentPurchase from '@/components/dashboard/RecentPurchase'
// import OverviewWishData  from'@/components/dashboard/OverviewWishData'
// import { motion } from "framer-motion";
import CustomerOverviewWishcard from '@/components/customer/CustomerOverviewWishcard';


const CustomerOverviewPage = () => {
    return (
         <div className='container text-orange-700 text-2xl m-30 w-full bg-[#EFF6FF]'>
                 Overview
                  <div className='grid md:grid-cols-2 lg:grid-cols-2  gap-4 mt-4 px-20 py-10'> 
                   {/* card1 */}
        {/* <div className="card bg-slate-100 w-70 h-70 shadow-md border-0 rounded-2xl justify-start items-left" /> */}
                               
        <div className="card bg-linear-to-br text-black from-yellow-400 via-blue-900 to-teal-600  w-70 h-80 shadow-md border-0 rounded-2xl justify-start items-left "> 
          
          <figure className="px-10 pt-10 flex justify-center items-center">
            <TbPrism className='w-16 h-16'   />
           
          </figure>
         
         
          <div className="card-body items-center text-center ">
            {/* <h2 className="card-title ">Total Orders </h2>
            // <p className='line-clamp-3'>100 </p> */}
            <CustomerOverviewOrderscard />
           </div>
         
          
        </div>
                  {/* card2 */}
                <div className="card text-black text-left bg-linear-to-br from-yellow-400 via-blue-800 to-teal-600  w-70 h-80 shadow-md border-0 rounded-2xl">
        <figure className="px-10 pt-10  flex justify-center items-center ">
         <FaRegHeart className='w-16 h-16 bg-yellow-600 '  />
           </figure>  
           <div className="card-body items-center text-center">
            
             <CustomerOverviewWishcard/>
           
           </div>
         </div>
                   {/* card3 */}
         
</div>
         </div>
    );
};

export default CustomerOverviewPage;