import SearchHeader from './components/SearchHeader';
import SearchSidebar from './components/SearchSidebar';
import SearchRestaurantCard from './components/SearchRestaurantCard';
import { PRICE, PrismaClient } from '@prisma/client';

interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

interface SearchPageProps {
  params: unknown;
  searchParams: SearchParams;
}

interface WhereProps {
  location?: {
    name: {
      equals: string;
    }
  };
  cuisine?: {
    name: {
      equals: string;
    }
  };
  price?: {
    equals: PRICE;
  };
}

const prisma = new PrismaClient();

const fetchRestaurantByCity = (searchParams: SearchParams) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  const where: WhereProps = {}

  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLowerCase()
      }
    }

    where.location = location
  }

  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase()
      }
    }

    where.cuisine = cuisine
  }

  if (searchParams.price) {
    const price = {
      equals: searchParams.price
    }

    where.price = price
  }

  return prisma.restaurant.findMany({
    where,
    select,
  });
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};

const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const restaurants = await fetchRestaurantByCity(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <>
      <SearchHeader />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar locations={locations} cuisines={cuisines} searchParams={searchParams} />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <SearchRestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p className="font-regular mt-1 text-md text-zinc-500">
              Sorry, we found no restaurants in this area
            </p>
          )}
        </div>
      </div>
    </>
  );
}
