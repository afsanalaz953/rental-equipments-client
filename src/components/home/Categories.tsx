"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ changed
import { Button, Spinner, Chip } from "@heroui/react";
import { motion } from "framer-motion";

type CategoryItem = string | { name?: string; category?: string };

interface CategoriesProps {
  selectedCategory?: string;
}

const Categories: React.FC<CategoriesProps> = ({ selectedCategory }) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ added
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data: CategoryItem[] | { data?: CategoryItem[] } =
          await res.json();

        const list: CategoryItem[] = Array.isArray(data)
          ? data
          : Array.isArray((data as { data?: CategoryItem[] }).data)
          ? (data as { data: CategoryItem[] }).data
          : [];

        // const catNames = list
        //   .map((item) =>
        //     typeof item === "string" ? item : item.name ?? item.category ?? ""
        //   )
        //   .filter((n): n is string => typeof n === "string" && n.length > 0);

        // setCategories(catNames);
const catNames = [
      ...new Map(
         list
      .map((item) =>
        typeof item === "string"
          ? item.trim()
          : (item.name ?? item.category ?? "").trim()
      )
      .filter(Boolean)
      .map((name) => [name.toLowerCase(), name])
  ).values()
];

setCategories(catNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fixed: existing params preserve
  const handleCategoryClick = (cat: string): void => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) params.set("category", cat);
    else params.delete("category");
    params.set("page", "1");
    router.push(`/equipments?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="justify-center items-center m-20">
      <Chip className="bg-orange-100 block w-fit m-4 text-orange-600 mx-auto text-center">
        Browse by Category
      </Chip>
      <h2 className="text-3xl text-black text-center font-bold">
        Popular Categories
      </h2>

      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {/* All button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant={!selectedCategory ? "primary" : "outline"}
            onPress={() => handleCategoryClick("")}
            className="capitalize rounded-2xl shadow-lg"
          >
            {selectedCategory ? "Clear Filter" : "All Products"}
          </Button>
        </motion.div>

        {/* Dynamic categories */}
        {categories.map((cat) => (
          <motion.div
            key={cat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-40 bg-yellow-300 rounded-2xl shadow-lg overflow-hidden"
          >
            <Button
              variant={selectedCategory === cat ? "primary" : "outline"}
              onPress={() => handleCategoryClick(cat)}
              className="w-full capitalize text-sm justify-center"
            >
              <span className="block w-full truncate text-center">{cat}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Categories;











