import axios from 'axios';
import { useContext } from 'react';
import { AuthenticationContext } from '../app/context/AuthContext';
import { deleteCookie } from 'cookies-next';

interface SignInProps {
  email: string;
  password: string;
  handleModalClose?: () => void;
}

interface SignUpProps {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string,
  city: string,
  handleModalClose?: () => void;
}

export default function useAuth () {
  const { setAuth } = useContext(AuthenticationContext);

  const signIn = async ({ email, password, handleModalClose }: SignInProps) => {
    setAuth({
      data: null,
      error: null,
      loading: true,
    });

    try {
      const response = await axios.post('http://localhost:3002/api/auth/signin', {
        email,
        password,
      });

      setAuth({
        data: response.data,
        error: null,
        loading: false,
      });

      handleModalClose?.();
    } catch (error: any) {
      setAuth({
        data: null,
        error: error?.response?.data?.errorMessage || 'Has ocurred an error during login request',
        loading: false,
      });
    }
  };

  const signUp = async ({
    firstName,
    lastName,
    email,
    password,
    city,
    phone,
    handleModalClose
  }: SignUpProps) => {
    setAuth({
      data: null,
      error: null,
      loading: true,
    });

    try {
      const response = await axios.post('http://localhost:3002/api/auth/signup', {
        firstName,
        lastName,
        email,
        password,
        city,
        phone,
      });

      setAuth({
        data: response.data,
        error: null,
        loading: false,
      });

      handleModalClose?.();
    } catch (error: any) {
      setAuth({
        data: null,
        error: error?.response?.data?.errorMessage || 'Has ocurred an error during login request',
        loading: false,
      });
    }
  };

  const signOut = () => {
    deleteCookie('jwt')

    setAuth({
      data: null,
      error: null,
      loading: false,
    });
  }

  return {
    signIn,
    signUp,
    signOut,
  };
};
