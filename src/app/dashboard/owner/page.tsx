import OwnerOverviewProductsCard from '@/components/owner/OwnerOverviewProductsCard';
import React from 'react';
import { FaRegHeart } from "react-icons/fa";
import { TbPrism } from "react-icons/tb";





const OwnerOverviewPage = (): React.JSX.Element => {
  return (
    <div className='container text-orange-700 text-2xl m-30 w-full bg-[#EFF6FF]'>
      Overview

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-20 py-10'>

        {/* card1 — Rentals / Orders */}
        {/* <div className="card bg-linear-to-br text-black from-yellow-400 via-blue-900 to-teal-600 w-70 h-80 shadow-md border-0 rounded-2xl justify-start items-left">
          <figure className="px-10 pt-10 flex justify-center items-center">
            <TbPrism className='w-16 h-16  bg-yellow-600' />
          </figure>

          <div className="card-body items-center text-center">
            <OwnerOverviewRentalsCard />
          </div>
        </div> */}

        {/* card2 — Products */}
        <div className="card text-black text-left bg-linear-to-br from-yellow-400 via-blue-800 to-teal-600 w-70 h-80 shadow-md border-0 rounded-2xl">
          <figure className="px-10 pt-10 flex justify-center items-center">
            <FaRegHeart className='w-16 h-16 bg-yellow-600' />
          </figure>

          <div className="card-body items-center text-center">
            <OwnerOverviewProductsCard />
          </div>
        </div>

        {/* card3 — Users */}
        {/* <div className="card text-black text-left bg-linear-to-br from-yellow-400 via-blue-800 to-teal-600 w-70 h-80 shadow-md border-0 rounded-2xl">
          <figure className="px-10 pt-10 flex justify-center items-center">
            <FaRegHeart className='w-16 h-16 bg-yellow-600' />
          </figure>

          <div className="card-body items-center text-center">
            <AdminOverviewUsersCard />
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default OwnerOverviewPage;




