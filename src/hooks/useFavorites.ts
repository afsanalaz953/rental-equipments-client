"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "favorite-equipments";

const readStorage = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
};

/**
 * Keeps a list of favorited equipment ids in localStorage so the
 * heart state survives page reloads and navigation.
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (avoids SSR / client mismatch).
  useEffect(() => {
    setFavorites(readStorage());
    setHydrated(true);
  }, []);

  // Persist changes after the initial hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // storage full or unavailable — ignore, favorites just won't persist
    }
  }, [favorites, hydrated]);

  const toggleFavorite = useCallback((id: string) => {
    if (!id) return;
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  return { favorites, isFavorite, toggleFavorite };
};

export default useFavorites;
