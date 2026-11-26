"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner, Chip } from "@heroui/react";
import { motion } from "framer-motion";

type CategoryItem =
  | string
  | { name?: string; category?: string };

interface CategoriesProps {
  selectedCategory?: string;
}

const Categories: React.FC<CategoriesProps> = ({ selectedCategory }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`,
          {}
        );
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data: CategoryItem[] | { data?: CategoryItem[] } = await res.json();

        let catNames: string[];

        const list: CategoryItem[] = Array.isArray(data)
          ? data
          : Array.isArray((data as { data?: CategoryItem[] }).data)
          ? ((data as { data: CategoryItem[] }).data)
          : [];

        if (list.length > 0 && typeof list[0] === "object") {
          catNames = list
            .map((item) => {
              if (typeof item === "string") return item;
              return item.name ?? item.category ?? "";
            })
            .filter((n): n is string => typeof n === "string" && n.length > 0);
        } else {
          catNames = (list as string[]).filter(
            (n): n is string => typeof n === "string"
          );
        }

        setCategories(catNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (cat: string): void => {
    const params = new URLSearchParams();
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-40">
      <Chip className="bg-orange-100 block w-fit m-4 text-orange-600 mx-auto items-center text-center">
        Browse by Category
      </Chip>
      <h2 className="text-3xl text-black text-center font-bold">
        Popular Categories
      </h2>
      <div className="top-4 flex flex-wrap gap-2">
        {/* "All" বাটন */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            color={!selectedCategory ? "primary" : "default"}
            variant={!selectedCategory ? "solid" : "bordered"}
            onPress={() => handleCategoryClick("")}
            className="capitalize ml-20"
          >
            {selectedCategory ? "Clear Filter" : "All Products"}
          </Button>
        </motion.div>

        {/* বাকি ক্যাটাগরি */}
        {categories.map((cat) => (
          <motion.div
            key={cat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className=""
          >
            <Button
              color={selectedCategory === cat ? "primary" : "default"}
              variant={selectedCategory === cat ? "solid" : "bordered"}
              onPress={() => handleCategoryClick(cat)}
              className="capitalize ml-4 text-center w-full justify-center"
            >
              {cat}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Categories;






