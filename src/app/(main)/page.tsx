import MotionProvider from "@/components/home/MotionProvider";
import Banner from "@/components/home/Banner";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import HowItWorks from "@/components/home/HowItWorks";
import TrustedOwners from "@/components/home/TrustedOwners";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import { Suspense } from "react";

export default function Home() {
  return (
    <MotionProvider>
      <div className="flex flex-1 flex-col">
        {/* 1. Banner */}
        <Banner />
      <Suspense fallback={<div className="h-40" />}>
        <Categories />
      </Suspense>
        <Featured />
        {/* 2. Why Choose Us */}
        <WhyChooseUs />
        {/* 3. Customer Reviews */}
        <CustomerReviews />
        {/* 4. How It Works */}
        <HowItWorks />
        {/* 5. Trusted Equipment Owners */}
        <TrustedOwners />
      </div>
    </MotionProvider>
  );
}
