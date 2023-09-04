import { useState, Dispatch, SetStateAction} from 'react';
import axios from 'axios';

interface GetAvailabilitiesProps {
  slug: string;
  day: string;
  time: string;
  partySize: string;
  bookerFirstName: string;
  bookerLastName: string;
  bookerPhone: string;
  bookerEmail: string;
  bookerOccasion: string;
  bookerRequest: string;
  setDidBook:  Dispatch<SetStateAction<boolean>>;
}

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    day,
    time,
    partySize,
    bookerFirstName,
    bookerLastName,
    bookerPhone,
    bookerEmail,
    bookerOccasion,
    bookerRequest,
    setDidBook,
  }: GetAvailabilitiesProps) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3002/api/restaurant/${slug}/reserve`,
        {
          bookerFirstName,
          bookerLastName,
          bookerPhone,
          bookerEmail,
          bookerOccasion,
          bookerRequest,
        },
        {
          params: {
            day,
            time,
            partySize,
          }
        }
      );

      setDidBook(true)
      return response.data
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.errorMessage || 'Has ocurred an error during get availabilities';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createReservation,
    loading,
    error,
  };
}
