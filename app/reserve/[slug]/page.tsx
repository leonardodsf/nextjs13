import ReserveHeader from './components/ReserveHeader';
import ReserveForm from './components/ReserveForm';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

interface RestaurantReservePageProps {
  params: {
    slug: string;
  };
  searchParams: {
    date: string;
    partySize: string;
  };
}

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      main_image: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function RestaurantReservePage({
  params,
  searchParams,
}: RestaurantReservePageProps) {
  const restaurant = await fetchRestaurantBySlug(params.slug);

  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <ReserveHeader
          image={restaurant.main_image}
          name={restaurant.name}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
        <ReserveForm
          slug={params.slug}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
      </div>
    </div>
  );
}
