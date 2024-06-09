import { create } from 'zustand';

const useTargetsStore = create((set) => ({
  searchQueries: {},
  setSearchQueries: (searchQueries) => set({ searchQueries }),
}));

export default useTargetsStore;
