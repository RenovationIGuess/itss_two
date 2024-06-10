import { create } from 'zustand';

const useRequestStore = create((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),

  searchQueries: {},
  setSearchQueries: (searchQueries) => set({ searchQueries }),
}));

export default useRequestStore;
