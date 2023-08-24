import { Item } from '@prisma/client'
import RestaurantMenuCard from '../components/RestaurantMenuCard'

interface RestaurantMenuProps {
  menu: Item[]
}

export default function RestaurantMenu({ menu }: RestaurantMenuProps) {
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Menu</h1>
        </div>
        <div className="flex flex-wrap justify-between">
          {menu.length ? (
            menu.map(item => (
              <RestaurantMenuCard key={item.id} item={item} />
            ))
          ) : (
            <p className="font-light mt-1 text-sm">This restaurant does not have a menu</p>
          )}
        </div>
      </div>
    </main>
  );
}
