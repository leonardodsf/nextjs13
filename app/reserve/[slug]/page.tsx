import ReserveHeader from './components/ReserveHeader';
import ReserveForm from './components/ReserveForm';

export default function RestaurantReservePage() {
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <ReserveHeader />
        <ReserveForm />
      </div>
    </div>
  );
}
