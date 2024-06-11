import { createBrowserRouter } from 'react-router-dom';
import TeamDashboard from '~/features/TeamDashboard/TeamDashboard';
import GuestLayout from './layout/GuestLayout';
import SignIn from './features/Auth/SignIn';
import SignUp from './features/Auth/SignUp';
import JoinTeam from './features/JoinTeam/JoinTeam';
import AuthLayout from './layout/AuthLayout';

const router = createBrowserRouter([
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'teams/:id',
        element: <TeamDashboard />,
      },
      {
        path: 'join-team',
        element: <JoinTeam />,
      },
    ],
  },
  {
    path: '',
    element: <GuestLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },    
    ],
  },
]);

export default router;
