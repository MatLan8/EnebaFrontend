export const sellerRatingLabel = (rating: number) => {
  if (rating > 9.75) return "Superb";
  if (rating > 9.5) return "Excellent";
  if (rating > 9) return "Very good";
  return "Good";
};
