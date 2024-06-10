import { useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axiosClient from '~/axios';

export const useTargetActions = ({ queryKey }) => {
  const queryClient = useQueryClient();
  const { id: teamId } = useParams();

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const baseUrl = useCallback(
    (append) => {
      return queryString.stringifyUrl({
        url: `/teams/targets${append || ''}`,
        query: { team_id: teamId },
      });
    },
    [teamId]
  );

  const createTarget = useCallback(
    (payload, resolvedCallback = () => {}) => {
      setCreating(true);
      axiosClient
        .post(baseUrl(), payload)
        .then(({ data }) => {
          const createdTarget = data;

          queryClient.setQueryData(queryKey, (oldData) => {
            return [createdTarget, ...oldData];
          });

          toast.success('Target created successfully');
          resolvedCallback(data);
        })
        .catch(() => {
          toast.error('Failed to create target');
        })
        .finally(() => {
          setCreating(false);
        });
    },
    [baseUrl]
  );

  const updateTarget = useCallback(
    (targetId, payload, resolvedCallback = () => {}) => {
      setUpdating(true);

      const apiUrl = baseUrl(`/${targetId}`);

      axiosClient
        .patch(apiUrl, payload)
        .then(({ data }) => {
          const updatedTarget = data;

          queryClient.setQueryData(queryKey, (oldData) => {
            return oldData.map((e) =>
              e.id === updatedTarget.id ? updatedTarget : e
            );
          });

          toast.success('Target updated successfully');
          resolvedCallback(data);
        })
        .catch(() => {
          toast.error('Failed to update target');
        })
        .finally(() => {
          setUpdating(false);
        });
    },
    [baseUrl]
  );

  const deleteTarget = useCallback(
    (targetId, resolvedCallback = () => {}) => {
      setDeleting(true);
      const apiUrl = baseUrl(`/${targetId}`);
      axiosClient
        .delete(apiUrl)
        .then(() => {
          queryClient.setQueryData(queryKey, (oldData) => {
            return oldData.filter((e) => e.id !== targetId);
          });
          toast.success('Target deleted successfully');
          resolvedCallback();
        })
        .catch(() => {
          toast.error('Failed to delete target');
        })
        .finally(() => {
          setDeleting(false);
        });
    },
    [baseUrl]
  );

  return useMemo(
    () => ({
      creating,
      updating,
      deleting,
      createTarget,
      updateTarget,
      deleteTarget,
    }),
    [creating, updating, deleting, createTarget, updateTarget, deleteTarget]
  );
};
