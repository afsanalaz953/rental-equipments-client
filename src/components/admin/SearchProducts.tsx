"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, type ChangeEvent } from "react";

const SearchProducts = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ শুধু search প্যারামিটারের মান নেওয়া
  const searchParamValue: string = searchParams.get("search") ?? "";
  const [searchTerm, setSearchTerm] = useState<string>(searchParamValue);

  // ✅ URL বদলালে ইনপুট আপডেট হবে (ব্যাক/ফরওয়ার্ড)
  useEffect(() => {
    setSearchTerm(searchParamValue);
  }, [searchParamValue]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setSearchTerm(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-5xl m-10 relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:ring-4 focus-within:ring-blue-600/10 focus-within:border-blue-600 transition-all overflow-hidden">
      <div className="pl-5 text-slate-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        value={searchTerm}
        onChange={handleSearch}
        type="text"
        placeholder="Search"
        className="flex-1 h-14 px-4 outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
      />
    </div>
  );
};

export default SearchProducts;