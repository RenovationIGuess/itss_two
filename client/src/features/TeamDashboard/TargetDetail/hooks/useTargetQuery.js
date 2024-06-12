import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useTargetsStore from '~/features/TeamDashboard/Targets/hooks/useTargetsStore';
import axiosClient from '~/axios';

export const useTargetQuery = ({ queryKey }) => {
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();

  const fetchTarget = useCallback(async () => {
    if (!teamId || !selectedTargetId) {
      return;
    }

    const apiUrl = qs.stringifyUrl({
      url: `/teams/targets/${selectedTargetId}`,
      query: {
        team_id: teamId,
      },
    });

    try {
      const responseData = await axiosClient.get(apiUrl);
      return responseData.data;
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
