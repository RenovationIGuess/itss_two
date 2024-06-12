import { ArchiveX, Loader, ServerCrash } from 'lucide-react';
import { useTargetsQuery } from './hooks/useTargetsQuery';
import { Button } from '~/components/ui/button';
import useTargetsStore from './hooks/useTargetsStore';
import { ScrollArea } from '~/components/ui/scroll-area';
import TargetItem from './TargetItem';

const TargetList = ({ queryKey }) => {
  const { data: targets, status } = useTargetsQuery({ queryKey });

  if (status === 'pending') {
    return <TargetList.Skeleton />;
  }

  if (status === 'error') {
    return <TargetList.Error />;
  }

  if (targets.length === 0) {
    return <TargetList.Empty />;
  }

  return (
    <ScrollArea className="flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto px-6 pt-4 pb-6">
      <div className="flex flex-col gap-4">
        {targets.map((target) => (
          <TargetItem
            key={target.id}
            targetId={target.id}
            title={target.title}
            description={target.description}
            due={target.due}
            exp={target.exp}
            completed={target.is_completed}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

TargetList.Skeleton = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
      <Loader className="w-7 h-7 animate-spin" />
      <p className="text-sm italic">Loading...</p>
    </div>
  );
};

TargetList.Error = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
      <ServerCrash className="w-7 h-7" />
      <p className="text-sm italic">Something went wrong.</p>
    </div>
  );
};

TargetList.Empty = ({ queryKey }) => {
  const { onOpen } = useTargetsStore();

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6 flex-1">
      <ArchiveX className="w-7 h-7" />
      <p className="text-sm italic">No targets found.</p>
      <Button onClick={() => onOpen('createTarget')}>Create Target +</Button>
    </div>
  );
};

export default TargetList;
