import axios from 'axios';
import { useContext } from 'react';
import { AuthenticationContext } from '../app/context/AuthContext';

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

const useAuth = () => {
  const { setAuth } = useContext(AuthenticationContext);

  const signIn = async ({ email, password, handleModalClose }: SignInProps) => {
    setAuth({
      data: null,
      error: null,
      loading: true,
    });

    try {
      const response = await axios.post('http://localhost:3001/api/auth/signin', {
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
      const response = await axios.post('http://localhost:3001/api/auth/signup', {
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

  return {
    signIn,
    signUp,
  };
};

export default useAuth;
