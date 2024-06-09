import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';

export const useAuthActions = () => {
  const { setUserToken } = userStateContext();
  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const signIn = useCallback((payload) => {
    setSigningIn(true);
    axiosClient
      .post('auth/signin', payload)
      .then(({ data }) => {
        setUserToken(data.token);
      })
      .catch(() => {
        toast.error('Sign In Failed');
      })
      .finally(() => setSigningIn(false));
  }, []);

  const signUp = useCallback((payload) => {
    setSigningUp(true);
    axiosClient
      .post('auth/signup', payload)
      .then(({ data }) => {
        setUserToken(data.token);
      })
      .catch(() => {
        toast.error('Sign Up Failed');
      })
      .finally(() => setSigningUp(false));
  }, []);

  return { signIn, signingIn, signUp, signingUp };
};
