import React, { useCallback } from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { userStateContext } from '~/contexts/ContextProvider';
import axiosClient from '~/axios';

const LogoutButton = () => {
  const { setCurrentUser, setUserToken } = userStateContext();

  const handleLogOut = useCallback(() => {
    axiosClient.post('/auth/signout').then(() => {
      setCurrentUser({});
      setUserToken(null);
    });
  }, []);

  return (
    <Button
      onClick={handleLogOut}
      className="shadow-sm bg-white text-black/80 border-2 rounded-full p-0 w-10 h-10 fixed bottom-2 right-2 hover:shadow-md hover:bg-white hover:text-black/80"
    >
      <LogOut className="w-5 h-5" />
    </Button>
  );
};

export default LogoutButton;
