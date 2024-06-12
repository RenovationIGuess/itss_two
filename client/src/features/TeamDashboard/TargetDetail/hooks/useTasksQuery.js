import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useTasksStore from './useTasksStore';
import useTargetsStore from '../../Targets/hooks/useTargetsStore';

export const useTasksQuery = ({ queryKey }) => {
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();
  const { searchQueries } = useTasksStore();

  const fetchTargetTasks = useCallback(async () => {
    if (!teamId || !selectedTargetId) {
      return;
    }

    const apiUrl = qs.stringifyUrl({
      url: `/api/teams/targets/tasks`,
      query: {
        ...searchQueries,
        team_id: teamId,
        target_id: selectedTargetId,
      },
    });

    try {
      const responseData = await axiosClient.get(apiUrl);
      return responseData.data;
    } catch (error) {
      console.error(error);
    }
  }, [searchQueries, teamId, selectedTargetId]);

  const { data, status } = useQuery({
    queryKey,
    queryFn: fetchTargetTasks,
    refetchInterval: false,
    retry: false,
    enabled: !!selectedTargetId,
  });

  return { data, status };
};
