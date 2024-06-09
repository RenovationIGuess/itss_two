import { Loader } from 'lucide-react';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';

const AuthLayout = () => {
  const navigate = useNavigate();

  const { currentUser, userToken } = userStateContext();
  const { setUserToken, setCurrentUser } = userStateContext();

  const { fetchingUser, setFetchingUser } = userStateContext();

  useEffect(() => {
    if (userToken) {
      setFetchingUser(true);
      axiosClient
        .get('/auth/me')
        .then(({ data }) => {
          // console.log(data);
          if (data.message === 'Unauthorized') {
            navigate('/nfc/signin');
          } else {
            const currentUser = data.data;

            setCurrentUser(currentUser);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            console.log('Unauthorized');
            localStorage.removeItem('TOKEN');
            setUserToken(null);
          }
          console.error(err);
        })
        .finally(() => setFetchingUser(false));
    } else {
      console.log('Navigated');
      navigate('/nfc/signin');
    }
  }, [userToken]);

  if (!userToken) {
    return <Navigate to="/sign-in" />;
  }

  if (fetchingUser) {
    return <AuthLayout.Skeleton />;
  }

  return (
    <div className="w-full h-full">
      <Outlet />

      <Toaster
        duration={3000}
        position="bottom-right"
        theme="light"
        closeButton={true}
      />
    </div>
  );
};

AuthLayout.Skeleton = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader className="w-7 h-7 animate-spin" />
        <p className="text-sm italic">Loading...</p>
      </div>
    </div>
  );
};

export default AuthLayout;
