import RestaurantHeader from './components/RestaurantHeader';

interface RestaurantLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  }
}

export default function RestaurantLayout({ children, params }: RestaurantLayoutProps) {
  return (
    <main>
      <RestaurantHeader slug={params.slug} />
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">{children}</div>
    </main>
  );
}
