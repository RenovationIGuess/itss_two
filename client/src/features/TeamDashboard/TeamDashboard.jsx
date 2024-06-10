import React, { useEffect } from 'react';
import Targets from './Targets/Targets';
import TargetDetail from './TargetDetail/TargetDetail';
import { useParams } from 'react-router-dom';
import useTeamStore from './hooks/useTeamStore';
import Leaderboard from './Leaderboard/Leaderboard';
import TaskRequests from './TaskRequests/TaskRequests';

const TeamDashboard = () => {
  const { id: teamId } = useParams();

  const { fetchAuthUserRole } = useTeamStore();

  useEffect(() => {
    fetchAuthUserRole(teamId);
  }, [teamId]);

  return (
    <div className="w-full h-full overflow-hidden grid grid-cols-12 last:border-r-0">
      <Leaderboard />
      <Targets />
      <TargetDetail />
      <TaskRequests />
    </div>
  );
};

export default TeamDashboard;
