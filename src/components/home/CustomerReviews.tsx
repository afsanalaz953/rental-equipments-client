"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { BadgeCheck, Quote, Star } from "lucide-react";
import SectionHeading from "@/components/home/SectionHeading";
import { cn } from "cn";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface Review {
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    name: "Ayesha Rahman",
    role: "Photographer · Manchester",
    rating: 5,
    comment:
      "Booked a DSLR and two lenses for a weekend shoot. The owner was ID-verified, the gear was spotless and the whole thing took about four minutes.",
    avatar: "/assets/home/review-2.jpg",
  },
  {
    name: "Daniel Cooper",
    role: "Equipment Owner · Leeds",
    rating: 5,
    comment:
      "I list my power tools here and the steady side income is brilliant. Payouts only release after pickup, so I never have to chase anyone for money.",
    avatar: "/assets/home/review-1.jpg",
  },
  {
    name: "Marcus Feld",
    role: "Contractor · Sheffield",
    rating: 4,
    comment:
      "Verification is genuinely thorough, which is exactly why I trust it. I rent site gear weekly and have never turned up to a bad listing.",
    avatar: "/assets/home/review-3.jpg",
  },
  {
    name: "Sofia Lindqvist",
    role: "Event Planner · Bristol",
    rating: 5,
    comment:
      "I extended my rental twice with a single tap and the price updated instantly. Flexible periods are the reason I stopped buying equipment outright.",
    avatar: "/assets/home/review-4.jpg",
  },
  {
    name: "Robert Hayes",
    role: "Homeowner · Nottingham",
    rating: 5,
    comment:
      "Needed a tiller for one afternoon instead of buying one for a fortune. Secure checkout and an easy return — exactly what a rental should be.",
    avatar: "/assets/home/review-5.jpg",
  },
  {
    name: "Elena Voss",
    role: "Videographer · Cardiff",
    rating: 5,
    comment:
      "Payment confirmation was instant and the owner responded within ten minutes. Support answered my one question straight away. Would rent again.",
    avatar: "/assets/home/review-6.jpg",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            "size-4",
            index < rating
              ? "fill-[#FFC000] text-[#FFC000]"
              : "fill-white/20 text-white/20",
          )}
        />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  return (
    <section className="bg-[#142A5E] py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Customer Reviews"
          title="What renters and owners say about us"
          description="4.9 out of 5 across 2,400+ verified reviews — here is a sample of recent feedback from both sides of the marketplace."
        />

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reviews.map((review) => (
            <motion.li
              key={review.name}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-[#FFC000]/60"
            >
              <Quote
                aria-hidden
                className="size-7 fill-[#FFC000]/25 text-[#FFC000]/25"
              />

              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/80">
                “{review.comment}”
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <Stars rating={review.rating} />
                <span className="text-sm font-semibold text-[#FFC000]">
                  {review.rating.toFixed(1)}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover ring-2 ring-[#FFC000]/70"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {review.name}
                  </p>
                  <p className="truncate text-xs text-white/55">
                    {review.role}
                  </p>
                </div>
                <BadgeCheck
                  aria-label="Verified customer"
                  className="size-5 shrink-0 text-[#FFC000]"
                />
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
