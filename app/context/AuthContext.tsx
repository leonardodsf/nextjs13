'use client';

import { useState, createContext } from 'react';

interface AuthContextProps {
  children: React.ReactNode;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
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

  return (
    <AuthenticationContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
