'use client';

import { useState, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import CircularProgress from '@mui/material/CircularProgress';

import { partySize as partySizes, times } from '../../../../data';
import useAvailabilities from '../../../../hooks/useAvailabilities';
import Link from 'next/link';
import { Time, convertToDisplayTime } from '../../../utils/convertToDisplayTime';

interface RestaurantReservationCardProps {
  slug: string;
  openTime: string;
  closeTime: string;
}

type DateType = Date | null;

const currentFormattedDay = new Date().toISOString().split('T')[0];

export default function RestaurantReservationCard({
  slug,
  openTime,
  closeTime,
}: RestaurantReservationCardProps) {
  const { data, error, loading, getAvailabilities } = useAvailabilities();

  const [selectedDate, setSelectedDate] = useState<DateType>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState('2');
  const [day, setDay] = useState(currentFormattedDay);

  const handleChangeDatePicker = (date: DateType) => {
    if (date) {
      const formattedDay = date.toISOString().split('T')[0];
      setDay(formattedDay);

      return setSelectedDate(date);
    }

    return setSelectedDate(null);
  };

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];

    let isWithinWindow = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isWithinWindow = true;
      }

      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }

      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };

  const handleChangeSelectTime = (event: ChangeEvent<HTMLSelectElement>) => {
    setTime(event.target.value);
  };

  const handleChangeSelectPartySize = (event: ChangeEvent<HTMLSelectElement>) => {
    setPartySize(event.target.value);
  };

  const handleFindTimeClick = () => {
    getAvailabilities({
      slug,
      day,
      time,
      partySize,
    });
  };

  return (
    <div className="fixed w-[20%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name="party-size"
          className="py-3 border-b font-light"
          value={partySize}
          onChange={handleChangeSelectPartySize}
        >
          {partySizes.map((size) => (
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
          <select
            name="availabilities-time"
            className="py-3 border-b font-light"
            value={time}
            onChange={handleChangeSelectTime}
          >
            {filterTimeByRestaurantOpenWindow().map(({ time, displayTime }) => (
              <option key={time} value={time}>
                {displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="flex items-center justify-center bg-red-600 rounded w-full px-4 text-white font-bold h-16 disabled:bg-gray-400"
          onClick={handleFindTimeClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" size={24} /> : 'Find a Time'}
        </button>
      </div>

      {data?.length && (
        <div className="mt-4">
          <p className="text-reg">Select a time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time) => {
              const key = `${time.time}_${new Date().getTime()}`

              if (time.available) {
                const date = `${day}T${time.time}`;

                return (
                  <Link
                    key={key}
                    className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                    href={`/reserve/${slug}?date=${date}&partySize=${partySize}`}
                  >
                    <p className="text-sm font-bold">{convertToDisplayTime(time.time as Time)}</p>
                  </Link>
                );
              }

              return (
                <p key={key} className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
