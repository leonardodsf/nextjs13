import SearchHeader from './components/SearchHeader'
import SearchSidebar from './components/SearchSidebar'
import SearchRestaurantCard from './components/SearchRestaurantCard'

export default function SearchPage() {
  return (
    <>
      <SearchHeader />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar />
        <div className="w-5/6">
          <SearchRestaurantCard />
        </div>
      </div>
    </>
  );
}
