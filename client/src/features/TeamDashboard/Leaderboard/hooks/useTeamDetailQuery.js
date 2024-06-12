import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import axiosClient from '~/axios';

export const useTeamDetailQuery = ({ queryKey }) => {
  const { id: teamId } = useParams();

  const fetchTeamDetail = useCallback(async () => {
    if (!teamId) {
      return;
    }

    const apiUrl = qs.stringifyUrl({
      url: `/teams/${teamId}`,
    });

    try {
      const responseData = await axiosClient.get(apiUrl);
      return responseData.data;
    } catch (error) {
      console.error(error);
    }
  }, [teamId]);

  const { data, status } = useQuery({
    queryKey,
    queryFn: fetchTeamDetail,
    refetchInterval: false,
    retry: false,
  });

  return { data, status };
};
