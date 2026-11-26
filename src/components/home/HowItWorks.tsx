"use client";

import { motion, type Variants } from "framer-motion";
import {
  CalendarCheck,
  CreditCard,
  PackageCheck,
  Search,
} from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const steps = [
  {
    icon: Search,
    title: "Browse & Compare",
    description:
      "Search thousands of listings by category, location, price and availability to find the right item near you.",
  },
  {
    icon: CalendarCheck,
    title: "Book Your Dates",
    description:
      "Pick your pickup and return dates, review the total cost and reserve the item instantly — no phone calls needed.",
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    description:
      "Complete an encrypted checkout. Your card is only charged once the owner confirms the booking.",
  },
  {
    icon: PackageCheck,
    title: "Collect & Return",
    description:
      "Meet the verified owner, collect your gear, use it for as long as you booked and return it when you are finished.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-zinc-50 py-20 dark:bg-[#081226] sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Renting equipment in four simple steps"
          description="From your first search to the final return, every step is designed to be quick, transparent and fully protected."
        />

        <div className="relative mt-16">
          {/* Timeline connecting the steps on large screens */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-10 hidden border-t-2 border-dashed border-[#142A5E]/20 lg:block dark:border-white/15"
          />

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {steps.map(({ icon: Icon, title, description }, index) => (
              <motion.li
                key={title}
                variants={item}
                className="relative text-center lg:px-2"
              >
                {/* Ring matches the section background so it masks the line */}
                <div className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-[#142A5E] text-[#FFC000] ring-8 ring-zinc-50 dark:bg-[#FFC000] dark:text-[#142A5E] dark:ring-[#081226]">
                  <Icon className="size-8" aria-hidden />
                  <span className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-[#FFC000] text-xs font-bold text-[#142A5E] ring-2 ring-zinc-50 dark:bg-[#142A5E] dark:text-[#FFC000] dark:ring-[#081226]">
                    {index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#142A5E] dark:text-white">
                  {title}
                </h3>

                <p className="mx-auto mt-2 max-w-[26ch] text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
