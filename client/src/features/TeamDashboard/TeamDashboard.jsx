import React, { useEffect } from 'react';
import Targets from './Targets/Targets';
import TargetDetail from './TargetDetail/TargetDetail';
import { useParams } from 'react-router-dom';
import useTeamStore from './hooks/useTeamStore';

const TeamDashboard = () => {
  const { id: teamId } = useParams();

  const { fetchAuthUserRole } = useTeamStore();

  useEffect(() => {
    fetchAuthUserRole(teamId);
  }, [teamId]);

  return (
    <div className="w-full h-full overflow-hidden grid grid-cols-12 last:border-r-0">
      <div className="border-r border-secondary col-span-2">Sidebar</div>
      <Targets />
      <TargetDetail />
      <div className="col-span-2"></div>
    </div>
  );
};

export default TeamDashboard;
