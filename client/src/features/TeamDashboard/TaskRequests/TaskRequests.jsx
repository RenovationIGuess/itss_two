import React, { useMemo } from 'react';
import useTargetsStore from '../Targets/hooks/useTargetsStore';
import useTasksStore from '../TargetDetail/hooks/useTasksStore';
import useRequestStore from './hooks/useRequestStore';
import { useParams } from 'react-router-dom';
import { useDebounceCallback } from 'usehooks-ts';
import { Input } from '~/components/ui/input';
import SortOptions from './components/SortOptions';
import { Button } from '~/components/ui/button';
import { Filter, ListTodo, Plus, SortAsc } from 'lucide-react';
import RequestList from './RequestList';
import ConfirmDeleteRequestModal from './Modals/ConfirmDeleteRequestModal';
import CreateRequestModal from './Modals/CreateRequestModal';
import UpdateRequestModal from './Modals/UpdateRequestModal';
import FilterOptions from './components/FilterOptions';

const TaskRequests = () => {
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();
  const { selectedTaskId } = useTasksStore();
  const { searchQueries, setSearchQueries } = useRequestStore();

  const queryKey = useMemo(() => {
    return [
      'task-requests',
      teamId,
      selectedTargetId,
      selectedTaskId,
      searchQueries,
    ];
  }, [teamId, selectedTargetId, selectedTaskId, searchQueries]);

  const { onOpen } = useRequestStore();

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

  if (!selectedTaskId || !selectedTargetId) {
    return <TaskRequests.NoTaskSelected />;
  }

  return (
    <div className="col-span-3 flex flex-col">
      <div className="pt-4 px-6 pb-0 space-y-1.5 relative">
        <h1 className="text-2xl font-bold">Requests</h1>
        <p className="text-gray-500">All task's approve requests</p>
      </div>
      <div className="flex items-center gap-2 px-6 mt-4">
        <Input
          placeholder="Search..."
          onChange={(e) => debounceSearch(e.target.value)}
        />
        <FilterOptions side="bottom" align="end">
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
          onClick={() => onOpen('createRequest')}
          variant="ghost"
          className="aspect-square p-0"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <RequestList queryKey={queryKey} />

      {/* Modals */}
      <ConfirmDeleteRequestModal queryKey={queryKey} />
      <CreateRequestModal queryKey={queryKey} />
      <UpdateRequestModal queryKey={queryKey} />
    </div>
  );
};

TaskRequests.NoTaskSelected = () => {
  return (
    <div className="col-span-3 flex flex-col">
      <div className="pt-4 px-6 pb-0 h-32 flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-center gap-2">
          <ListTodo className="w-7 h-7" />
          <p className="text-sm">No Task Selected</p>
        </div>
      </div>
    </div>
  );
};

export default TaskRequests;
