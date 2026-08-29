import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENT_UF_CLP } from "@/data/mockData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUF(amount: number): string {
  return `${new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 1,
  }).format(amount)} UF`;
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('es-CL').format(amount);
}

export function ufToCLP(ufAmount: number, ufValue: number = CURRENT_UF_CLP): number {
  return Math.round(ufAmount * ufValue);
}

export function clpToUF(clpAmount: number, ufValue: number = CURRENT_UF_CLP): number {
  return +(clpAmount / ufValue).toFixed(2);
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export interface MortgageCalculation {
  propertyPriceUF: number;
  propertyPriceCLP: number;
  downPaymentPercent: number;
  downPaymentUF: number;
  downPaymentCLP: number;
  loanAmountUF: number;
  loanAmountCLP: number;
  years: number;
  annualInterestRate: number;
  monthlyDividendUF: number;
  monthlyDividendCLP: number;
  requiredMonthlyIncomeCLP: number;
  // Chilean operational expenses
  operationalExpenses: {
    appraisalCLP: number; // Tasación (~ 2.5 - 3.5 UF)
    titleStudyCLP: number; // Estudio de títulos (~ 5 - 8 UF)
    stampTaxCLP: number; // Impuesto de timbres y estampillas (~ 0.8% del crédito)
    notaryCLP: number; // Gastos notariales y conservador CBR (~ 0.2% - 0.4%)
    totalOperationalCLP: number;
  };
}

export function calculateMortgage(
  propertyPriceUF: number,
  downPaymentPercent: number = 20,
  years: number = 25,
  annualInterestRate: number = 4.8,
  ufValue: number = CURRENT_UF_CLP
): MortgageCalculation {
  const propertyPriceCLP = ufToCLP(propertyPriceUF, ufValue);
  const downPaymentUF = (propertyPriceUF * downPaymentPercent) / 100;
  const downPaymentCLP = ufToCLP(downPaymentUF, ufValue);
  const loanAmountUF = propertyPriceUF - downPaymentUF;
  const loanAmountCLP = ufToCLP(loanAmountUF, ufValue);

  // Monthly interest rate
  const monthlyRate = annualInterestRate / 100 / 12;
  const totalMonths = years * 12;

  // Standard French amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyDividendUF = loanAmountUF * ((monthlyRate * factor) / (factor - 1));
  const monthlyDividendCLP = ufToCLP(monthlyDividendUF, ufValue);

  // In Chile, banks typically require that the dividend does not exceed 25% of household income
  const requiredMonthlyIncomeCLP = monthlyDividendCLP * 4;

  // Operational expenses calculation in Chile
  const appraisalCLP = ufToCLP(3, ufValue);
  const titleStudyCLP = ufToCLP(7, ufValue);
  const stampTaxCLP = Math.round(loanAmountCLP * 0.008); // 0.8% for standard residential
  const notaryCLP = Math.round(propertyPriceCLP * 0.0035); // Notaría y CBR (~0.35%)
  const totalOperationalCLP = appraisalCLP + titleStudyCLP + stampTaxCLP + notaryCLP;

  return {
    propertyPriceUF,
    propertyPriceCLP,
    downPaymentPercent,
    downPaymentUF,
    downPaymentCLP,
    loanAmountUF,
    loanAmountCLP,
    years,
    annualInterestRate,
    monthlyDividendUF: +monthlyDividendUF.toFixed(2),
    monthlyDividendCLP,
    requiredMonthlyIncomeCLP,
    operationalExpenses: {
      appraisalCLP,
      titleStudyCLP,
      stampTaxCLP,
      notaryCLP,
      totalOperationalCLP,
    },
  };
}

export function calculateCapRate(
  priceUF: number,
  monthlyRentCLP: number,
  ufValue: number = CURRENT_UF_CLP
): {
  capRatePercent: number;
  annualRentCLP: number;
  annualRentUF: number;
  rating: 'Excelente' | 'Muy Bueno' | 'Promedio' | 'Bajo';
} {
  const annualRentCLP = monthlyRentCLP * 12;
  const annualRentUF = clpToUF(annualRentCLP, ufValue);
  const priceCLP = ufToCLP(priceUF, ufValue);

  const capRatePercent = priceCLP > 0 ? +((annualRentCLP / priceCLP) * 100).toFixed(2) : 0;

  let rating: 'Excelente' | 'Muy Bueno' | 'Promedio' | 'Bajo' = 'Promedio';
  if (capRatePercent >= 7.0) rating = 'Excelente';
  else if (capRatePercent >= 5.5) rating = 'Muy Bueno';
  else if (capRatePercent >= 4.0) rating = 'Promedio';
  else rating = 'Bajo';

  return {
    capRatePercent,
    annualRentCLP,
    annualRentUF,
    rating,
  };
}
