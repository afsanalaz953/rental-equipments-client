"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = { categories: string[] };

const CategoryFilter = ({ categories }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "all";

  const handleClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    params.set("page", "1"); // reset pagination if any
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {["all", ...categories].map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => handleClick(cat)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium capitalize transition",
            active === cat
              ? "bg-[#EB7036] text-white border-[#EB7036]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          )}
        >
          {cat === "all" ? "All" : cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;