'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENT_UF_CLP } from '@/data/mockData';
import { formatCLP, formatUF, ufToCLP } from '@/lib/utils';

type CurrencyMode = 'UF' | 'CLP';

interface CurrencyContextType {
  currency: CurrencyMode;
  setCurrency: (c: CurrencyMode) => void;
  toggleCurrency: () => void;
  ufValue: number;
  formatPrice: (priceUF: number) => string;
  convertPrice: (priceUF: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyMode>('UF');
  const ufValue = CURRENT_UF_CLP;

  useEffect(() => {
    const saved = localStorage.getItem('kaizen_currency');
    if (saved === 'UF' || saved === 'CLP') {
      setCurrency(saved);
    }
  }, []);

  const handleSetCurrency = (c: CurrencyMode) => {
    setCurrency(c);
    localStorage.setItem('kaizen_currency', c);
  };

  const toggleCurrency = () => {
    const next = currency === 'UF' ? 'CLP' : 'UF';
    handleSetCurrency(next);
  };

  const formatPrice = (priceUF: number): string => {
    if (currency === 'CLP') {
      return formatCLP(ufToCLP(priceUF, ufValue));
    }
    return formatUF(priceUF);
  };

  const convertPrice = (priceUF: number): number => {
    if (currency === 'CLP') {
      return ufToCLP(priceUF, ufValue);
    }
    return priceUF;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        toggleCurrency,
        ufValue,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
