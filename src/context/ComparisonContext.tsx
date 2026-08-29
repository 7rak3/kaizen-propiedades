'use client';

import React, { createContext, useContext, useState } from 'react';
import { Property } from '@/types';

interface ComparisonContextType {
  compareList: Property[];
  addToCompare: (property: Property) => boolean;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addToCompare = (property: Property): boolean => {
    if (compareList.some((p) => p.id === property.id)) {
      removeFromCompare(property.id);
      return false;
    }
    if (compareList.length >= 3) {
      alert('Puedes comparar un máximo de 3 propiedades simultáneamente.');
      return false;
    }
    setCompareList((prev) => [...prev, property]);
    setIsDrawerOpen(true);
    return true;
  };

  const removeFromCompare = (propertyId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsDrawerOpen(false);
  };

  const isInCompare = (propertyId: string): boolean => {
    return compareList.some((p) => p.id === propertyId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
