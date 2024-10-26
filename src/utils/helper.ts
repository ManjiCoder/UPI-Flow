export const formattedAmount = (amount: any, currency?: boolean) => {
  if (currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    currency: 'INR',
  }).format(amount);
};
