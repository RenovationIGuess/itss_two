import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { userStateContext } from '~/contexts/ContextProvider';

const GuestLayout = () => {
  const { userToken } = userStateContext();
  const { pathname } = useLocation();

  if (userToken) {
    return <Navigate to="/auth/join-team" />;
  }

  if (!userToken && pathname === '/') {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default GuestLayout;
