'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '@/types';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kaizen_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(propertyId)) {
        updated = prev.filter((id) => id !== propertyId);
      } else {
        updated = [...prev, propertyId];
      }
      localStorage.setItem('kaizen_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (propertyId: string): boolean => {
    return favorites.includes(propertyId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: isLoaded ? favorites.length : 0,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
