import RestaurantNavBar from '../components/RestaurantNavBar';
import RestaurantMenu from '../components/RestaurantMenu';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

interface RestaurantMenuPageProps {
  params: {
    slug: string;
  }
}

const prisma = new PrismaClient()

const fetchRestaurantMenuBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug
    },
    select: {
      items: true
    }
  })

  if (!restaurant) {
    notFound()
  }

  return restaurant.items
}

export default async function RestaurantMenuPage({ params }: RestaurantMenuPageProps) {
  const restaurantMenu = await fetchRestaurantMenuBySlug(params.slug)

  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={params.slug} />
        <RestaurantMenu menu={restaurantMenu} />
      </div>
    </>
  );
}
