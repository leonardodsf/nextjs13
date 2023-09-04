import { useState } from 'react';
import axios from 'axios';

interface GetAvailabilitiesProps {
  slug: string;
  day: string;
  time: string;
  partySize: string;
}

interface DataStateProps {
  time: string;
  available: boolean;
}

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<DataStateProps[] | null>(null);

  const getAvailabilities = async ({ slug, day, time, partySize }: GetAvailabilitiesProps) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3002/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );

      setData(response.data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.errorMessage || 'Has ocurred an error during get availabilities';

      setData(null);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    getAvailabilities,
    loading,
    error,
    data,
  };
}
