// Utility functions for safe number formatting
export const safeToFixed = (value: any, decimals: number = 2): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0.00';
  }
  return Number(value).toFixed(decimals);
};

export const safeCurrency = (value: any, decimals: number = 2): string => {
  return `$${safeToFixed(value, decimals)}`;
};

export const safeNumber = (value: any): number => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0;
  }
  return Number(value);
};
