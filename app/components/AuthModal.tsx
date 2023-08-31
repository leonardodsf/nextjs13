'use client';

import { useState, ChangeEvent, useEffect, useContext } from 'react';

import useAuth from '../../hooks/useAuth';
import { AuthenticationContext } from '../context/AuthContext';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AuthModalInputs from './AuthModalInputs';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export interface AuthModalProps {
  isSignIn?: boolean;
}

export default function AuthModal({ isSignIn }: AuthModalProps) {
  const { loading, error } = useContext(AuthenticationContext);
  const { signIn, signUp } = useAuth();

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  });

  const renderContent = (signInContent: string, signUpContent: string) => {
    return isSignIn ? signInContent : signUpContent;
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputs((oldValue) => ({
      ...oldValue,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (isSignIn) {
      return signIn({
        email: inputs.email,
        password: inputs.password,
        handleModalClose,
      });
    }

    signUp({
      ...inputs,
      handleModalClose,
    })
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (isSignIn && inputs.email && inputs.password) {
      return setDisabled(false);
    }

    if (
      inputs.firstName &&
      inputs.lastName &&
      inputs.email &&
      inputs.phone &&
      inputs.city &&
      inputs.password
    ) {
      return setDisabled(false);
    }

    setDisabled(true);
  }, [isSignIn, inputs]);

  return (
    <div>
      <button
        className={`${renderContent('bg-cyan-800 text-white mr-3', '')} border p-1 px-4 rounded`}
        onClick={handleModalOpen}
      >
        {renderContent('Sign in', 'Sign up')}
      </button>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2 h-[600px]">
            <div className="uppercase font-bold text-center pb-2 border-b mb-2">
              <p className="text-sm">{renderContent('Sign In', 'Create Account')}</p>
            </div>

            <div className="m-auto">
              <h2 className="text-2xl font-light text-center">
                {renderContent('Log Into Your Account', 'Create Your OpenTable Account')}
              </h2>

              <AuthModalInputs
                isSignIn={isSignIn}
                inputs={inputs}
                handleChangeInput={handleChangeInput}
              />

              <button
                className="flex items-center justify-center uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                disabled={disabled || loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  renderContent('Sign In', 'Create Account')
                )}
              </button>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
