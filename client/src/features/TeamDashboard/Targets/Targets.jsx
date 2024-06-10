import { Filter, SortAsc } from 'lucide-react';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import useTargetsStore from './hooks/useTargetsStore';
import CreateTargetModal from './Modals/CreateTargetModal';
import UpdateTargetModal from './Modals/UpdateTargetModal';
import ConfirmDeleteTargetModal from './Modals/ConfirmDeleteTargetModal';
import { useDebounceCallback } from 'usehooks-ts';
import SortOptions from './components/SortOptions';
import TargetList from './TargetList';

const Targets = () => {
  const { id: teamId } = useParams();
  const { searchQueries, setSearchQueries } = useTargetsStore();

  const queryKey = useMemo(() => {
    return ['team-targets', teamId, searchQueries];
  }, [teamId, searchQueries]);

  const { onOpen } = useTargetsStore();

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

  return (
    <div className="border-r border-secondary col-span-4 flex flex-col">
      <div className="pt-4 px-6 pb-0 space-y-1.5 relative">
        <h1 className="text-2xl font-bold">Targets</h1>
        <p className="text-gray-500">All team's targets</p>

        <Button
          onClick={() => onOpen('createTarget')}
          className="absolute top-[10px] right-6"
        >
          Create +
        </Button>
      </div>
      <div className="flex items-center gap-2 px-6 mt-4">
        <Input
          placeholder="Search..."
          onChange={(e) => debounceSearch(e.target.value)}
        />
        <Button variant="ghost" className="aspect-square p-0">
          <Filter className="w-5 h-5" />
        </Button>
        <SortOptions>
          <Button variant="ghost" className="aspect-square p-0">
            <SortAsc className="w-5 h-5" />
          </Button>
        </SortOptions>
      </div>
      <TargetList queryKey={queryKey} />

      {/* Modals */}
      <CreateTargetModal queryKey={queryKey} />
      <UpdateTargetModal queryKey={queryKey} />
      <ConfirmDeleteTargetModal queryKey={queryKey} />
    </div>
  );
};

export default Targets;
