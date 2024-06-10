import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useTargetsStore from '~/features/TeamDashboard/Targets/hooks/useTargetsStore';

export const useTargetQuery = ({ queryKey }) => {
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();

  const fetchTarget = useCallback(async () => {
    if (!teamId || !selectedTargetId) {
      return;
    }

    const apiUrl = qs.stringifyUrl({
      url: `/api/teams/targets/${selectedTargetId}`,
      query: {
        team_id: teamId,
      },
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
        toast.error('Failed to fetch target', {
          position: 'bottom-right',
        });
        throw new Error('Failed to fetch target');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
    }
  }, [teamId, selectedTargetId]);

  const { data, status } = useQuery({
    queryKey,
    queryFn: fetchTarget,
    refetchInterval: false,
    retry: false,
    enabled: !!selectedTargetId,
  });

  return { data, status };
};
