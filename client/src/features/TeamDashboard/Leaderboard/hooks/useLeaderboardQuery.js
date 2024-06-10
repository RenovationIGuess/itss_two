import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useLeaderboardQuery = ({ queryKey }) => {
  const { id: teamId } = useParams();

  const fetchLeaderboard = useCallback(async () => {
    if (!teamId) {
      return;
    }

    const apiUrl = qs.stringifyUrl({
      url: `/api/teams/${teamId}/leaderboard`,
    });

    try {
      // Call API
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
        },
      });

      if (!response.ok) {
        toast.error('Failed to fetch leaderboard', {
          position: 'bottom-right',
        });
        throw new Error('Failed to fetch leaderboard');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
    }
  }, [teamId]);

  const { data, status } = useQuery({
    queryKey,
    queryFn: fetchLeaderboard,
    refetchInterval: false,
    retry: false,
  });

  return { data, status };
};
