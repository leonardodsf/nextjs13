import { PrismaClient } from '@prisma/client';

import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantTitle from './components/RestaurantTitle';
import RestaurantRating from './components/RestaurantRating';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantImages from './components/RestaurantImages';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantReservationCard from './components/RestaurantReservationCard';


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
  slug: string;
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
    }
  })

  if (!restaurant) {
    throw new Error('This restaurant slug not exists')
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
        <RestaurantRating />
        <RestaurantDescription description={restaurant.description} />
        <RestaurantImages images={restaurant.images} />
        <RestaurantReviews />
      </div>
      <div className="w-[25%] relative text-reg">
        <RestaurantReservationCard />
      </div>
    </>
  );
}
