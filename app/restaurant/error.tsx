'use client'

import Image from 'next/image'
import errorImage from '../../public/icons/error.png'

export interface ErrorProps {
  error: Error
}

export default function Error({
  error
}: ErrorProps) {
  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <Image className="w-56 mb-8" src={errorImage} alt="Mascot error" />

      <div className="bg-white px-9 py-14 shadow rounded">
        <h3 className="text-3xl font-bold">Well, this is embarrassing</h3>
        <p className="text-reg mt-2 font-bold">{error.message}</p>
        <p className="mt-6 text-sm font-light">Error Code: 400</p>
      </div>
    </div>
  )
}
