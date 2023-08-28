import { Review } from "@prisma/client";
import { getReviewRatingAverage } from "../../../utils/reviews";
import Stars from "../../../components/Stars";

export interface RestaurantRatingProps {
  reviews: Review[];
}

export default function RestaurantRating({ reviews }: RestaurantRatingProps) {
  const reviewsAmount = reviews.length === 1 ? `${reviews.length} Review` : `${reviews.length} Reviews`

  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <Stars reviews={reviews} />
        <p className="text-reg ml-3">{getReviewRatingAverage(reviews).toFixed(1)}</p>
      </div>
      <div>
        <p className="text-reg ml-4">{reviewsAmount}</p>
      </div>
    </div>
  );
}
