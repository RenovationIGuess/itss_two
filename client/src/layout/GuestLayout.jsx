import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userStateContext } from '~/contexts/ContextProvider';

const GuestLayout = () => {
  const { userToken } = userStateContext();

  if (userToken) {
    return <Navigate to="/auth/join-team" />;
  }

  return (
    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default GuestLayout;
