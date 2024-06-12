import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import axiosClient from '~/axios';

export const useTeamProfileQuery = ({ queryKey }) => {
  const { id: teamId } = useParams();

  const fetchTeamProfile = useCallback(async () => {
    if (!teamId) {
      return;
    }

    const apiUrl = qs.stringifyUrl({
      url: `/teams/${teamId}/profile`,
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
    queryFn: fetchTeamProfile,
    refetchInterval: false,
    retry: false,
  });

  return { data, status };
};
