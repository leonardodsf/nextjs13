'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import useReservation from '../../../../hooks/useReservation';
import { Alert, CircularProgress } from '@mui/material';

interface ReserveFormProps {
  slug: string;
  date: string;
  partySize: string;
}

export default function ReserveForm({ slug, date, partySize }: ReserveFormProps) {
  const [inputs, setInputs] = useState({
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhone: '',
    bookerEmail: '',
    bookerOccasion: '',
    bookerRequest: '',
  });

  const [disabled, setDisabled] = useState(true);

  const { createReservation, loading, error } = useReservation();

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputs((oldValue) => ({
      ...oldValue,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    const [day, time] = date.split('T');

    const booking = await createReservation({
      ...inputs,
      slug,
      day,
      time,
      partySize,
    });

    console.log({ booking })
  };

  useEffect(() => {
    if (
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerEmail &&
      inputs.bookerPhone
    ) {
      return setDisabled(false);
    }

    return setDisabled(true);
  }, [inputs]);

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="First name"
        name="bookerFirstName"
        onChange={handleChangeInput}
        value={inputs.bookerFirstName}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Last name"
        name="bookerLastName"
        onChange={handleChangeInput}
        value={inputs.bookerLastName}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Phone number"
        name="bookerPhone"
        onChange={handleChangeInput}
        value={inputs.bookerPhone}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Email"
        name="bookerEmail"
        onChange={handleChangeInput}
        value={inputs.bookerEmail}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Occasion (optional)"
        name="bookerOccasion"
        onChange={handleChangeInput}
        value={inputs.bookerOccasion}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Requests (optional)"
        name="bookerRequest"
        onChange={handleChangeInput}
        value={inputs.bookerRequest}
      />
      <button
        className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
        disabled={disabled || loading}
        onClick={handleSubmit}
      >
        {loading ? <CircularProgress color="inherit" size={24} /> : 'Complete reservation'}
      </button>

      <p className="mt-4 text-sm">
        By clicking “Complete reservation” you agree to the OpenTable Terms of Use and Privacy
        Policy. Standard text message rates may apply. You may opt out of receiving text messages at
        any time.
      </p>

      {error && (
        <div className="w-full mt-4">
          <Alert severity="error">{error}</Alert>
        </div>
      )}
    </div>
  );
}
