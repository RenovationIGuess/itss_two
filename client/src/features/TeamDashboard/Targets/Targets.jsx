import { ArchiveX, Filter, Loader, ServerCrash, SortAsc } from 'lucide-react';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import useTargetsStore from './hooks/useTargetsStore';
import { useTargetsQuery } from './hooks/useTargetsQuery';

const Targets = () => {
  const { id: teamId } = useParams();
  const { searchQueries } = useTargetsStore();

  const queryKey = useMemo(() => {
    return ['team-targets', teamId, searchQueries];
  }, [teamId, searchQueries]);

  const { data: targets, status } = useTargetsQuery({ queryKey });

  if (status === 'pending') {
    return <Targets.Skeleton />;
  }

  if (status === 'error') {
    return <Targets.Error />;
  }

  if (status === 'success' && targets?.length === 0) {
    return <Targets.Empty />;
  }

  return (
    <div className="border-r border-secondary col-span-4">
      <div className="pt-4 px-6 pb-0 space-y-1.5">
        <h1 className="text-2xl font-bold">Targets</h1>
        <p className="text-gray-500">All team's targets</p>
      </div>
      <div className="flex items-center gap-2 px-6 mt-4">
        <Input />
        <Button variant="ghost" className="aspect-square p-0">
          <Filter className="w-5 h-5" />
        </Button>
        <Button variant="ghost" className="aspect-square p-0">
          <SortAsc className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

Targets.Skeleton = () => {
  return (
    <div className="border-r border-secondary col-span-4 flex flex-col p-6">
      <div className="pt-4 px-6 pb-0 space-y-1.5">
        <h1 className="text-2xl font-bold">Targets</h1>
        <p className="text-gray-500">All team's targets</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 p-6 flex-1">
        <Loader className="w-7 h-7 animate-spin" />
        <p className="text-sm italic">Loading...</p>
      </div>
    </div>
  );
};

Targets.Error = () => {
  return (
    <div className="border-r border-secondary col-span-4 flex flex-col">
      <div className="pt-4 px-6 pb-0 space-y-1.5">
        <h1 className="text-2xl font-bold">Targets</h1>
        <p className="text-gray-500">All team's targets</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 p-6 flex-1">
        <ServerCrash className="w-7 h-7" />
        <p className="text-sm italic">Something went wrong.</p>
      </div>
    </div>
  );
};

Targets.Empty = () => {
  return (
    <div className="border-r border-secondary col-span-4 flex flex-col">
      <div className="pt-4 px-6 pb-0 space-y-1.5">
        <h1 className="text-2xl font-bold">Targets</h1>
        <p className="text-gray-500">All team's targets</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 p-6 flex-1">
        <ArchiveX className="w-7 h-7" />
        <p className="text-sm italic">No targets found.</p>
        <Button>Create Target +</Button>
      </div>
    </div>
  );
};

export default Targets;
