interface RestaurantImagesProps {
  images: string[];
}

export default function RestaurantImages({ images }: RestaurantImagesProps) {
  const amountPhotos = images.length === 1 ? `${images.length} photo` : `${images.length} photos`

  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">{amountPhotos}</h1>
      <div className="flex flex-wrap">
        {
          images.map(image => (
            <img
              className="w-56 h-44 mr-1 mb-1"
              loading="lazy"
              key={image}
              src={image}
            />
          ))
        }
      </div>
    </div>
  );
}
