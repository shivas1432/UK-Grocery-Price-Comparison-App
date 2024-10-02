// UK Grocery Price Comparison Utilities
export const findBestPrice = (prices) => {
  const validPrices = prices.filter(p => p.price !== null && p.availability);
  
  if (validPrices.length === 0) {
    return null;
  }

  return validPrices.reduce((min, current) => {
    return current.price < min.price ? current : min;
  });
};

export const calculateSavings = (prices) => {
  const validPrices = prices.filter(p => p.price !== null);
  
  if (validPrices.length < 2) {
    return 0;
  }

  const sorted = validPrices.sort((a, b) => a.price - b.price);
  const cheapest = sorted[0].price;
  const mostExpensive = sorted[sorted.length - 1].price;
  
  return {
    amount: mostExpensive - cheapest,
    percentage: ((mostExpensive - cheapest) / mostExpensive * 100).toFixed(1)
  };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(price);
};

export const calculatePricePerUnit = (price, quantity, unit) => {
  const pricePerUnit = price / quantity;
  return {
    value: pricePerUnit,
    display: `${formatPrice(pricePerUnit)} per ${unit}`
  };
};
