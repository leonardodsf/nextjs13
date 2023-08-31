'use client';

import axios from 'axios';
import { useState, createContext, useEffect } from 'react';
import { getCookie } from 'cookies-next';

interface AuthContextProps {
  children: React.ReactNode;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface StateProps {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface AuthProps extends StateProps {
  setAuth: React.Dispatch<React.SetStateAction<StateProps>>;
}

export const AuthenticationContext = createContext<AuthProps>({
  loading: false,
  data: null,
  error: null,
  setAuth: () => {},
});

export default function AuthContext({ children }: AuthContextProps) {
  const [auth, setAuth] = useState<StateProps>({
    loading: false,
    data: null,
    error: null,
  });

  const getUser = async () => {
    setAuth({
      data: null,
      error: null,
      loading: true,
    });

    try {
      const jwt = getCookie('jwt')

      if (!jwt) {
        return setAuth({
          data: null,
          error: null,
          loading: false,
        });
      }

      const bearerToken = `Bearer ${jwt}`

      const response = await axios.get('http://localhost:3001/api/auth/me', {
        headers: {
          Authorization: bearerToken
        }
      })

      axios.defaults.headers.common.Authorization = bearerToken

      setAuth({
        data: response.data,
        error: null,
        loading: false,
      })
    } catch (error: any) {
      setAuth({
        data: null,
        error: error?.response?.data?.errorMessage || 'Has ocurred an error during login request',
        loading: false,
      })
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <AuthenticationContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
