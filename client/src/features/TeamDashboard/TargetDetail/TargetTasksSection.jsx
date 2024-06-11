import { Filter, Plus, SortAsc } from 'lucide-react';
import React, { useMemo } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import useTargetsStore from '../Targets/hooks/useTargetsStore';
import useTasksStore from './hooks/useTasksStore';
import { useDebounceCallback } from 'usehooks-ts';
import { useParams } from 'react-router-dom';
import SortOptions from './components/SortOptions';
import TargetTaskList from './TargetTaskList';
import CreateTaskModal from './Modals/CreateTaskModal';
import UpdateTaskModal from './Modals/UpdateTaskModal';
import ConfirmDeleteTaskModal from './Modals/ConfirmDeleteTaskModal';
import FilterOptions from './components/FilterOptions';

const TargetTasksSection = () => {
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();
  const { searchQueries, setSearchQueries } = useTasksStore();

  const queryKey = useMemo(() => {
    return ['target-tasks', teamId, selectedTargetId, searchQueries];
  }, [teamId, searchQueries, selectedTargetId]);

  const { onOpen } = useTasksStore();

  const debounceSearch = useDebounceCallback((searchValue) => {
    if (searchValue !== '') {
      setSearchQueries({
        ...searchQueries,
        search: searchValue,
      });
    } else {
      const filteredSearchQueries = Object.fromEntries(
        Object.entries(searchQueries).filter(([key]) => key !== 'search')
      );

      setSearchQueries({
        ...filteredSearchQueries,
      });
    }
  }, 500);

  if (!selectedTargetId) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
      <div className="flex items-center gap-2 px-6 mt-4">
        <Input
          placeholder="Search..."
          onChange={(e) => debounceSearch(e.target.value)}
        />
        <FilterOptions align="end" side="bottom">
          <Button variant="ghost" className="aspect-square p-0">
            <Filter className="w-5 h-5" />
          </Button>
        </FilterOptions>
        <SortOptions>
          <Button variant="ghost" className="aspect-square p-0">
            <SortAsc className="w-5 h-5" />
          </Button>
        </SortOptions>
        <Button
          onClick={() => onOpen('createTask')}
          variant="ghost"
          className="aspect-square p-0"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <TargetTaskList queryKey={queryKey} />

      {/* Modals */}
      <CreateTaskModal queryKey={queryKey} />
      <UpdateTaskModal queryKey={queryKey} />
      <ConfirmDeleteTaskModal queryKey={queryKey} />
    </div>
  );
};

export default TargetTasksSection;
