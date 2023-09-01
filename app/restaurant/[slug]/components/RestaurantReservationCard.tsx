'use client';

import DatePicker from 'react-datepicker';

import { partySize, times } from '../../../../data';
import { useState } from 'react';

interface RestaurantReservationCardProps {
  openTime: string;
  closeTime: string;
}

type DateType = Date | null;

export default function RestaurantReservationCard({ openTime, closeTime }: RestaurantReservationCardProps) {
  const [selectedDate, setSelectedDate] = useState<DateType>(new Date());

  const handleChangeDatePicker = (date: DateType) => {
    if (date) {
      return setSelectedDate(date);
    }

    return setSelectedDate(null);
  };

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = []

    let isWithinWindow = false
    
    times.forEach(time => {
      if (time.time === openTime) {
        isWithinWindow = true
      }

      if (isWithinWindow) {
        timesWithinWindow.push(time)
      }

      if (time.time === closeTime) {
        isWithinWindow = false
      }
    })

    return timesWithinWindow
  }

  return (
    <div className="fixed w-[20%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select name="" className="py-3 border-b font-light" id="">
          {partySize.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            wrapperClassName="w-[48%]"
            className="py-3 border-b font-light text-reg w-28"
            dateFormat="MMMM d"
            selected={selectedDate}
            onChange={handleChangeDatePicker}
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select name="" id="" className="py-3 border-b font-light">
            <option value="">7:30 AM</option>
            <option value="">9:30 AM</option>
            {filterTimeByRestaurantOpenWindow().map(({ time, displayTime }) => (
              <option key={time} value={time}>
                {displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button className="bg-red-600 rounded w-full px-4 text-white font-bold h-16">
          Find a Time
        </button>
      </div>
    </div>
  );
}
