"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ShieldCheck, Star, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const stats = [
  { value: "12,500+", label: "Equipment items" },
  { value: "3,200+", label: "Verified owners" },
  { value: "48,000+", label: "Completed rentals" },
  { value: "120+", label: "Cities covered" },
];

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-[#142A5E]">
      {/* High-quality background image + brand-tinted overlays for legibility */}
      <Image
        src="/assets/home/hero.jpg"
        alt="A camera body and three lenses arranged on a dark surface"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#142A5E] via-[#142A5E]/95 to-[#142A5E]/45"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#142A5E] via-transparent to-[#142A5E]/70"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* ---------------- Copy ---------------- */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-[#FFC000]/40 bg-[#FFC000]/10 px-4 py-1.5 text-sm font-medium text-[#FFC000]"
            >
              <Star className="size-4 fill-current" />
              Trusted by 48,000+ renters
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-6 text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Rent the gear you need,{" "}
              <span className="text-[#FFC000]">
                exactly when you need it.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 max-w-lg text-lg leading-relaxed text-white/75"
            >
              RC Rental Equipment connects you with verified local owners —
              cameras, power tools, garden kit and heavy site machinery. Browse,
              book in minutes, pay securely and simply return when you are done.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/equipments"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full bg-[#FFC000] px-7 text-base font-semibold text-[#142A5E] hover:bg-[#FFC000]/90 hover:text-[#142A5E]",
                )}
              >
                Browse Equipment
                <ArrowRight className="ml-2 size-5" />
              </Link>

              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-full border-white/40 bg-transparent px-7 text-base font-semibold text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Become an Owner
              </Link>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75"
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#FFC000]" />
                ID-verified owners
              </span>
              <span className="inline-flex items-center gap-2">
                <Wallet className="size-5 text-[#FFC000]" />
                Secure payments
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="size-5 fill-[#FFC000] text-[#FFC000]" />
                4.9 average rating
              </span>
            </motion.div>
          </motion.div>

          {/* ---------------- Featured listing card ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            className="hidden w-full max-w-sm justify-self-end lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src="/assets/home/equip-mirrorless.jpg"
                  alt="Fujifilm mirrorless camera with a prime lens"
                  fill
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#FFC000] px-3 py-1 text-xs font-semibold text-[#142A5E]">
                  <ShieldCheck className="size-3.5" />
                  Verified
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">
                    Fujifilm X-T30 + 18-55mm
                  </p>
                  <p className="text-sm text-white/60">Cameras · Bristol</p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="text-xl font-bold text-[#FFC000]">$18</span>
                  <span className="text-sm text-white/60">/day</span>
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-sm text-white/70">
                <Star className="size-4 fill-[#FFC000] text-[#FFC000]" />
                <span>
                  <b className="text-white">4.9</b> · 128 rentals
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ---------------- Stats ---------------- */}
        <motion.dl
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-16 grid grid-cols-2 gap-8 border-t border-white/15 pt-10 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={item}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-bold text-[#FFC000]">
                {stat.value}
              </dd>
              <dd className="mt-1 text-sm text-white/65">{stat.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
