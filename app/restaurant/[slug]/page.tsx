import { PrismaClient, Review } from '@prisma/client';

import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantTitle from './components/RestaurantTitle';
import RestaurantRating from './components/RestaurantRating';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantImages from './components/RestaurantImages';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantReservationCard from './components/RestaurantReservationCard';
import { notFound } from 'next/navigation';


interface RestaurantDetailsPageProps {
  params: {
    slug: string;
  },
  searchParams: unknown
}

interface RestaurantBySlugType {
  id: number;
  name: string;
  images: string[];
  description: string;
  open_time: string,
  close_time: string,
  slug: string;
  reviews: Review[];
}

const prisma = new PrismaClient()

const fetchRestaurantBySlug = async (slug: string): Promise<RestaurantBySlugType> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    }
  })

  if (!restaurant) {
    notFound()
  }

  return restaurant
}

export default async function RestaurantDetailsPage({ params }: RestaurantDetailsPageProps) {
  const restaurant = await fetchRestaurantBySlug(params.slug)

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <RestaurantTitle name={restaurant.name} />
        <RestaurantRating reviews={restaurant.reviews} />
        <RestaurantDescription description={restaurant.description} />
        <RestaurantImages images={restaurant.images} />
        <RestaurantReviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[25%] relative text-reg">
        <RestaurantReservationCard slug={restaurant.slug} openTime={restaurant.open_time} closeTime={restaurant.close_time} />
      </div>
    </>
  );
}
