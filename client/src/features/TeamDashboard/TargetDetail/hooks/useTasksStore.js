import { create } from 'zustand';

const useTasksStore = create((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),

  searchQueries: {},
  setSearchQueries: (searchQueries) => set({ searchQueries }),

  selectedTaskId: null,
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
}));

export default useTasksStore;
