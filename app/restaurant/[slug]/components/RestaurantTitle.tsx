interface RestaurantTitleProps {
  name: string;
}

export default function RestaurantTitle({ name }: RestaurantTitleProps) {
  return (
    <div className="mt-4 border-b pb-6">
    <h1 className="font-bold text-6xl">{name}</h1>
  </div>
  )
}
