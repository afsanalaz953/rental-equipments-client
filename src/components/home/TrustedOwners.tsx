"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import SectionHeading from "@/components/home/SectionHeading";
import { cn } from "cn";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface Owner {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  items: number;
  avatar: string;
  equipment: { src: string; alt: string };
}

const owners: Owner[] = [
  {
    name: "David Whitmore",
    specialty: "Photography & Film",
    location: "Manchester",
    rating: 4.9,
    reviews: 214,
    items: 18,
    avatar: "/assets/home/owner-1.jpg",
    equipment: {
      src: "/assets/home/equip-camera.jpg",
      alt: "Canon DSLR camera body with a kit lens",
    },
  },
  {
    name: "Priya Nair",
    specialty: "Garden & Outdoor",
    location: "Bristol",
    rating: 4.8,
    reviews: 167,
    items: 24,
    avatar: "/assets/home/owner-2.jpg",
    equipment: {
      src: "/assets/home/equip-garden.jpg",
      alt: "Garden trowel and pots on a potting bench",
    },
  },
  {
    name: "Jonathan Reyes",
    specialty: "Construction & Site",
    location: "Leeds",
    rating: 5.0,
    reviews: 302,
    items: 31,
    avatar: "/assets/home/owner-3.jpg",
    equipment: {
      src: "/assets/home/equip-site.jpg",
      alt: "Construction crew inspecting a site foundation",
    },
  },
  {
    name: "Elena Duarte",
    specialty: "Power Tools & Machinery",
    location: "Lisbon",
    rating: 4.9,
    reviews: 189,
    items: 27,
    avatar: "/assets/home/owner-4.jpg",
    equipment: {
      src: "/assets/home/equip-drill.jpg",
      alt: "Yellow and black cordless drill on a white background",
    },
  },
];

export default function TrustedOwners() {
  return (
    <section className="bg-[#142A5E] py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Trusted Equipment Owners"
          title="Meet the people behind the listings"
          description="Every owner on RC Rental Equipment is identity-checked and continuously rated by renters, so you always know your gear is in good hands."
        />

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {owners.map((owner) => (
            <motion.li
              key={owner.name}
              variants={item}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              {/* Equipment the owner has listed */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={owner.equipment.src}
                  alt={owner.equipment.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#FFC000] px-3 py-1 text-xs font-semibold text-[#142A5E]">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  Verified Owner
                </span>
                <span className="absolute top-3 right-3 rounded-full bg-[#142A5E]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {owner.items} items
                </span>
              </div>

              <div className="relative px-5 pb-5">
                <Image
                  src={owner.avatar}
                  alt={owner.name}
                  width={64}
                  height={64}
                  className="absolute -top-8 left-5 size-16 rounded-full object-cover ring-4 ring-[#142A5E]"
                />

                <div className="pt-10">
                  <h3 className="text-base font-semibold text-white">
                    {owner.name}
                  </h3>
                  <p className="text-sm font-medium text-[#FFC000]">
                    {owner.specialty}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-white/55">
                    <MapPin className="size-3.5" aria-hidden />
                    {owner.location}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-white/70">
                      <Star
                        className="size-4 fill-[#FFC000] text-[#FFC000]"
                        aria-hidden
                      />
                      <b className="text-white">{owner.rating.toFixed(1)}</b>
                      <span className="text-white/45">({owner.reviews})</span>
                    </span>

                    <Link
                      href="/equipments"
                      className="inline-flex items-center gap-1 font-medium text-[#FFC000] hover:underline"
                    >
                      View
                      <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Owner recruitment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#FFC000]/40 bg-white/5 px-6 py-8 sm:flex-row sm:px-8"
        >
          <div>
            <h3 className="text-xl font-semibold text-white">
              Own equipment you rarely use?
            </h3>
            <p className="mt-1 text-sm text-white/70">
              List it once and start earning from verified renters in your area.
            </p>
          </div>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 shrink-0 rounded-full bg-[#FFC000] px-7 text-base font-semibold text-[#142A5E] hover:bg-[#FFC000]/90 hover:text-[#142A5E]",
            )}
          >
            Become an Owner
            <ArrowUpRight className="ml-2 size-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
