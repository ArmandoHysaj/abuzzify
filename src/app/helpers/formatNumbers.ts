const formatNumber = (num: number | string): string => {
  // Convert string to number if needed
  const numericValue = typeof num === 'string' ? parseFloat(num) : num;
  
  // Handle invalid numbers
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return '0';
  }
  
  // Handle negative numbers
  const isNegative = numericValue < 0;
  const absValue = Math.abs(numericValue);
  
  let formatted: string;
  
  if (absValue >= 1e12) {
    formatted = (absValue / 1e12).toFixed(2) + "T";
  } else if (absValue >= 1e9) {
    formatted = (absValue / 1e9).toFixed(2) + "B";
  } else if (absValue >= 1e6) {
    formatted = (absValue / 1e6).toFixed(2) + "M";
  } else if (absValue >= 1e3) {
    formatted = (absValue / 1e3).toFixed(2) + "K";
  } else {
    // For smaller numbers, show appropriate decimal places
    if (absValue >= 1) {
      formatted = absValue.toFixed(2);
    } else {
      formatted = absValue.toFixed(4);
    }
  }
  
  return isNegative ? `-${formatted}` : formatted;
};

export default formatNumber;
