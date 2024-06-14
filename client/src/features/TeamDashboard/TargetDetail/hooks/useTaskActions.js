import { useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import useTargetsStore from '../../Targets/hooks/useTargetsStore';

export const useTaskActions = ({ queryKey }) => {
  const queryClient = useQueryClient();
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const teamDetailQueryKey = useMemo(() => {
    return ['team-detail', teamId];
  }, [teamId]);

  const baseUrl = useCallback(
    (append) => {
      return queryString.stringifyUrl({
        url: `/teams/targets/tasks${append || ''}`,
        query: { team_id: teamId, target_id: selectedTargetId },
      });
    },
    [teamId, selectedTargetId]
  );

  const createTask = useCallback(
    (payload, resolvedCallback = () => {}) => {
      setCreating(true);
      axiosClient
        .post(baseUrl(), payload)
        .then(({ data }) => {
          const createdTask = data;

          queryClient.setQueryData(queryKey, (oldData) => {
            return [createdTask, ...oldData];
          });

          queryClient.invalidateQueries({ queryKey: teamDetailQueryKey });

          toast.success('Task created successfully');
          resolvedCallback(data);
        })
        .catch(() => {
          toast.error('Failed to create task');
        })
        .finally(() => {
          setCreating(false);
        });
    },
    [baseUrl, teamDetailQueryKey]
  );

  const updateTask = useCallback(
    (taskId, payload, resolvedCallback = () => {}) => {
      setUpdating(true);

      const apiUrl = baseUrl(`/${taskId}`);

      axiosClient
        .patch(apiUrl, payload)
        .then(({ data }) => {
          const updatedTask = data;

          queryClient.setQueryData(queryKey, (oldData) => {
            return oldData.map((e) =>
              e.id === updatedTask.id ? updatedTask : e
            );
          });

          toast.success('Task updated successfully');
          resolvedCallback(data);
        })
        .catch(() => {
          toast.error('Failed to update task');
        })
        .finally(() => {
          setUpdating(false);
        });
    },
    [baseUrl]
  );

  const deleteTask = useCallback(
    (taskId, resolvedCallback = () => {}) => {
      setDeleting(true);
      const apiUrl = baseUrl(`/${taskId}`);
      axiosClient
        .delete(apiUrl)
        .then(() => {
          queryClient.setQueryData(queryKey, (oldData) => {
            return oldData.filter((e) => e.id !== taskId);
          });

          queryClient.invalidateQueries({ queryKey: teamDetailQueryKey });

          toast.success('Task deleted successfully');

          resolvedCallback();
        })
        .catch(() => {
          toast.error('Failed to delete task');
        })
        .finally(() => {
          setDeleting(false);
        });
    },
    [baseUrl, teamDetailQueryKey]
  );

  return useMemo(
    () => ({
      creating,
      updating,
      deleting,
      createTask,
      updateTask,
      deleteTask,
    }),
    [creating, updating, deleting, createTask, updateTask, deleteTask]
  );
};
