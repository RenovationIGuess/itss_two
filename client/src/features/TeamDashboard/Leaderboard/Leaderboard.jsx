import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useLeaderboardQuery } from './hooks/useLeaderboardQuery';

const Leaderboard = () => {
  const { id: teamId } = useParams();

  const queryKey = useMemo(() => {
    return ['team-leaderboard', teamId];
  }, [teamId]);

  const { data: leaderboard, status } = useLeaderboardQuery({
    queryKey,
  });

  return <div>Leaderboard</div>;
};

export default Leaderboard;
