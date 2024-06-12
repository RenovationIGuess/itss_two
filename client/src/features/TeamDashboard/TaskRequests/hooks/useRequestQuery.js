import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useRequestStore from './useRequestStore';
import useTargetsStore from '../../Targets/hooks/useTargetsStore';
import useTasksStore from '../../TargetDetail/hooks/useTasksStore';

export const useRequestQuery = ({ queryKey }) => {
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();
  const { selectedTaskId } = useTasksStore();
  const { searchQueries } = useRequestStore();

  const fetchRequests = useCallback(async () => {
    if (!teamId || !selectedTargetId || !selectedTaskId) {
      return;
    }

    const apiUrl = qs.stringifyUrl({
      url: `/api/teams/targets/tasks/approve-requests`,
      query: {
        ...searchQueries,
        team_id: teamId,
        target_id: selectedTargetId,
        task_id: selectedTaskId,
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
        toast.error('Failed to fetch tasks', {
          position: 'bottom-right',
        });
        throw new Error('Failed to fetch tasks');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
    }
  }, [searchQueries, teamId]);

  const { data, status } = useQuery({
    queryKey,
    queryFn: fetchRequests,
    refetchInterval: false,
    retry: false,
    enabled: !!selectedTargetId && !!selectedTaskId,
  });

  return { data, status };
};
