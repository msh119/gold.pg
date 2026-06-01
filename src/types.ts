export interface GoldPrices {
  g24: number;
  g21: number;
  g18: number;
}

export interface CalculatorState {
  weight: string;
  purity: string; // Shishangi / Sehm (generally between 500 and 1000)
}

export interface CalibrationResult {
  equivalentWeight21K: number;
  totalValue: number;
}

export type ActiveTab = 'home' | 'calculator' | 'settings' | 'info';
export type Language = 'ar' | 'en';

export interface HistoryItem {
  id: string;
  timestamp: string;
  weight: number;
  purity: number;
  cleanWeight21k: number;
  pricePerGram21k: number;
  totalValue: number;
}
