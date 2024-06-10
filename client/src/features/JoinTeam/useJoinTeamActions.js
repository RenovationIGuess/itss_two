import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosClient from '~/axios';

export const useJoinTeamActions = () => {
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const createTeam = useCallback((payload) => {
    setCreating(true);
    axiosClient
      .post('teams', payload)
      .then(({ data }) => {
        const team = data;

        toast.success('Team Created');
        navigate(`/auth/teams/${team.id}`);
      })
      .catch(() => {
        toast.error('Team Creation Failed');
      })
      .finally(() => setCreating(false));
  }, []);

  const joinTeam = useCallback((payload) => {
    setJoining(true);
    axiosClient
      .post('/teams/join', payload)
      .then(({ data }) => {
        const team = data;

        toast.success('Team Joined');
        navigate(`/auth/teams/${team.id}`);
      })
      .catch(() => {
        toast.error('Team Join Failed');
      })
      .finally(() => setJoining(false));
  }, []);

  return { createTeam, joinTeam, creating, joining };
};
