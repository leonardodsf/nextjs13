import { Review } from '@prisma/client';

import RestaurantReviewsCard from './RestaurantReviewsCard';

export interface RestaurantReviewsProps {
  reviews: Review[];
}

export default function RestaurantReviews({ reviews }: RestaurantReviewsProps) {
  const reviewsTitle = `${reviews.length} ${reviews.length === 1 ? 'person' : 'people'}`;

  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">
        What {reviewsTitle} are saying
      </h1>
      <div>
        {reviews.map((review) => (
          <RestaurantReviewsCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
