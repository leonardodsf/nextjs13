import { PRICE } from "@prisma/client"

interface PriceProps {
  price: PRICE
}

interface PricesDictionary {
  [key: string]: React.ReactNode
} 

export default function Price({ price }: PriceProps) {
  const renderPrice = () => {
    const prices: PricesDictionary = {
      CHEAP: (
        <>
          <span>$$</span>
          <span className="text-gray-400">$$</span>
        </>
      ),
      REGULAR: (
        <>
          <span>$$$</span>
          <span className="text-gray-400">$</span>
        </>
      ),
      EXPENSIVE: (
        <>
          <span>$$$$</span>
        </>
      ),
    }

    return prices[String(price)]
  }

  return (
    <p className="flex mr-3">
      {renderPrice()}
    </p>
  )
}
