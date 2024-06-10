import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import useTargetsStore from '../../Targets/hooks/useTargetsStore';
import useTasksStore from '../../TargetDetail/hooks/useTasksStore';
import { useCallback, useMemo, useState } from 'react';
import queryString from 'query-string';
import axiosClient from '~/axios';
import { toast } from 'sonner';

export const useRequestActions = ({ queryKey }) => {
  const queryClient = useQueryClient();
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();
  const { selectedTaskId } = useTasksStore();

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const baseUrl = useCallback(
    (append) => {
      return queryString.stringifyUrl({
        url: `/teams/targets/tasks/approve-requests${append || ''}`,
        query: {
          team_id: teamId,
          target_id: selectedTargetId,
          task_id: selectedTaskId,
        },
      });
    },
    [teamId, selectedTargetId, selectedTaskId]
  );

  const createRequest = useCallback(
    (payload, resolvedCallback = () => {}) => {
      setCreating(true);
      axiosClient
        .post(baseUrl(), payload)
        .then(({ data }) => {
          const createdRequest = data;

          queryClient.setQueryData(queryKey, (oldData) => {
            return [createdRequest, ...oldData];
          });

          toast.success('Request created successfully');
          resolvedCallback(data);
        })
        .catch(() => {
          toast.error('Failed to create request');
        })
        .finally(() => {
          setCreating(false);
        });
    },
    [baseUrl]
  );

  const updateRequest = useCallback(
    (requestId, payload, type, resolvedCallback = () => {}) => {
      setUpdating(true);
      const apiUrl = baseUrl(`/${requestId}/${type}`);
      axiosClient
        .patch(apiUrl, payload)
        .then(({ data }) => {
          const updatedRequest = data;

          queryClient.setQueryData(queryKey, (oldData) => {
            return oldData.map((e) =>
              e.id === updatedRequest.id ? updatedRequest : e
            );
          });

          toast.success('Request updated successfully');
          resolvedCallback(data);
        })
        .catch(() => {
          toast.error('Failed to update request');
        })
        .finally(() => {
          setUpdating(false);
        });
    },
    [baseUrl]
  );

  const deleteRequest = useCallback(
    (requestId, resolvedCallback = () => {}) => {
      setDeleting(true);
      const apiUrl = baseUrl(`/${requestId}`);
      axiosClient
        .delete(apiUrl)
        .then(() => {
          queryClient.setQueryData(queryKey, (oldData) => {
            return oldData.filter((e) => e.id !== requestId);
          });
          toast.success('Request deleted successfully');
          resolvedCallback();
        })
        .catch(() => {
          toast.error('Failed to delete request');
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
      createRequest,
      updateRequest,
      deleteRequest,
    }),
    [creating, updating, deleting, createRequest, updateRequest, deleteRequest]
  );
};
