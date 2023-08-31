import Image from 'next/image'

import fullStar from '../../public/icons/full-star.png'
import halfStar from '../../public/icons/half-star.png'
import emptyStar from '../../public/icons/empty-star.png'
import { Review } from '@prisma/client'
import { getReviewRatingAverage } from '../utils/reviews'

export interface StarsProps {
  reviews: Review[];
  rating?: number;
}

export default function Stars({ reviews, rating }: StarsProps) {
  const maxRating = 5
  const reviewRating = rating || getReviewRatingAverage(reviews)

  const renderStars = () => {
    const stars = []

    for (let i = 0; i < maxRating; i++) {
      const difference = parseFloat((reviewRating - i).toFixed(1))

      if (difference >= 1) {
        stars.push(fullStar)
      } else if (difference < 1 && difference > 0) {
        if (difference <= 0.2) {
          stars.push(emptyStar)
        } else if (difference > 0.2 && difference <= 0.6) {
          stars.push(halfStar)
        } else {
          stars.push(fullStar)
        }
      } else {
        stars.push(emptyStar)
      }
    }

    return stars.map((star, index) => {
      const key = `${index}_${new Date().getTime()}`

      return (
        <Image className="w-4 h-4 mr-1" key={key} src={star} alt="" />
      )
    })
  }

  return (
    <div className="flex items-center">
      {renderStars()}
    </div>
  )
}
