import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '~/layout/DashboardLayout';
import TeamDashboard from '~/features/TeamDashboard/TeamDashboard';

const router = createBrowserRouter([
  {
    path: '',
    element: <DashboardLayout />,
    children: [
      {
        path: 'teams/:id/dashboard',
        element: <TeamDashboard />,
      },
    ],
  },
]);

export default router;
