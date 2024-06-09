import useTargetsStore from './useTargetsStore';
import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useTargetsQuery = ({ queryKey }) => {
  const { id: teamId } = useParams();
  const { searchQueries } = useTargetsStore();

  const fetchTargets = useCallback(async () => {
    const apiUrl = qs.stringifyUrl({
      url: `/api/teams/targets`,
      query: {
        ...searchQueries,
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
        toast.error('Failed to fetch targets', {
          position: 'bottom-right',
        });
        throw new Error('Failed to fetch targets');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
    }
  }, [searchQueries, teamId]);

  const { data, status } = useQuery({
    queryKey,
    queryFn: fetchTargets,
    refetchInterval: false,
    retry: false,
    // enabled: !!searchQueries,
  });

  return { data, status };
};
