'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'omnitools-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载收藏
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, []);

  // 添加收藏
  const addFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => {
      if (prev.includes(toolId)) return prev;
      const newFavorites = [...prev, toolId];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  // 移除收藏
  const removeFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== toolId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  // 切换收藏状态
  const toggleFavorite = useCallback((toolId: string) => {
    if (favorites.includes(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  // 检查是否已收藏
  const isFavorite = useCallback((toolId: string) => {
    return favorites.includes(toolId);
  }, [favorites]);

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
