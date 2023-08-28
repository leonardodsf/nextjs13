import Header from "./components/Header";

export default function Loading() {
  return (
    <main>
      <Header />

      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse bg-slate-200 w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
          </div>
        ))}
      </div>
    </main>
  )
}
