import { toast } from 'sonner';
import { create } from 'zustand';
import axiosClient from '~/axios';

const useTeamStore = create((set) => ({
  authUserRole: null,
  fetchingAuthUserRole: false,
  fetchAuthUserRole: (teamId) => {
    set({ fetchingAuthUserRole: true });
    axiosClient
      .get(`/teams/${teamId}/role`)
      .then(({ data }) => {
        set({ authUserRole: data });
      })
      .catch(() => {
        set({ authUserRole: null });
        toast.error('Failed to fetch user role');
      })
      .finally(() => {
        set({ fetchingAuthUserRole: false });
      });
  },
}));

export default useTeamStore;
