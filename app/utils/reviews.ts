import { Review } from '@prisma/client';

export const getReviewRatingAverage = (reviews: Review[]): number => {
  if (!reviews.length) return 0;

  const sumReviews = reviews.reduce((sum, review) => sum + review.rating, 0);
  const reviewsAverage = sumReviews / reviews.length;

  return reviewsAverage;
};
