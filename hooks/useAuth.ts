import axios from 'axios';

interface SignInProps {
  email: string;
  password: string;
}

const useAuth = () => {
  const signIn = async ({ email, password }: SignInProps) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signin', {
        email,
        password,
      });

      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  };

  const signUp = async () => {};

  return {
    signIn,
    signUp,
  };
};

export default useAuth;
