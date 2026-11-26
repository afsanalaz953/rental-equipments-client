"use client";

import { motion, type Variants } from "framer-motion";
import { CalendarRange, Lock, ShieldCheck, Tag } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const benefits = [
  {
    icon: Tag,
    title: "Affordable Rental Prices",
    description:
      "Transparent daily, weekly and monthly rates with no hidden fees — compare nearby listings and keep more of your budget.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Equipment Owners",
    description:
      "Every owner passes ID verification and a listing review, so you always know exactly who you are renting from.",
  },
  {
    icon: CalendarRange,
    title: "Flexible Rental Periods",
    description:
      "Rent for a day, a week or several months, then extend your booking with a single tap if the job runs long.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description:
      "Encrypted checkout protects every transaction, and your payment is only released to the owner after pickup.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 dark:bg-[#0b1530] sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Everything you need to rent with confidence"
          description="We built RC Rental Equipment around the four things renters ask us for most: fair prices, people you can trust, flexible dates and payments that stay safe."
        />

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map(({ icon: Icon, title, description }) => (
            <motion.li
              key={title}
              variants={item}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <span className="inline-flex size-14 items-center justify-center rounded-xl bg-[#142A5E] text-[#FFC000] transition-colors duration-300 group-hover:bg-[#FFC000] group-hover:text-[#142A5E] dark:bg-[#FFC000]/15 dark:text-[#FFC000] dark:group-hover:bg-[#FFC000] dark:group-hover:text-[#142A5E]">
                <Icon className="size-6" aria-hidden />
              </span>

              <h3 className="mt-5 text-lg font-semibold text-[#142A5E] dark:text-white">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {description}
              </p>

              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#FFC000] transition-transform duration-300 group-hover:scale-x-100"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
