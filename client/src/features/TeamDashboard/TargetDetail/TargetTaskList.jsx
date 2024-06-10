import { ArchiveX, Loader, ServerCrash } from 'lucide-react';
import React from 'react';
import useTasksStore from './hooks/useTasksStore';
import { useTasksQuery } from './hooks/useTasksQuery';
import { ScrollArea } from '~/components/ui/scroll-area';
import TargetTaskItem from './TargetTaskItem';
import useTargetsStore from '../Targets/hooks/useTargetsStore';
import { Button } from '~/components/ui/button';

const TargetTaskList = ({ queryKey }) => {
  const { selectedTargetId } = useTargetsStore();
  const { data: tasks, status } = useTasksQuery({ queryKey });

  if (!selectedTargetId) {
    return null;
  }

  if (status === 'pending') {
    return <TargetTaskList.Skeleton />;
  }

  if (status === 'error') {
    return <TargetTaskList.Error />;
  }

  if (tasks.length === 0) {
    return <TargetTaskList.Empty />;
  }

  return (
    <ScrollArea className="flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto px-6 pt-4 pb-6">
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <TargetTaskItem
            key={task.id}
            taskId={task.id}
            title={task.title}
            description={task.description}
            due={task.due}
            exp={task.exp}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

TargetTaskList.Skeleton = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
      <Loader className="w-7 h-7 animate-spin" />
      <p className="text-sm italic">Loading...</p>
    </div>
  );
};

TargetTaskList.Error = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
      <ServerCrash className="w-7 h-7" />
      <p className="text-sm italic">Something went wrong.</p>
    </div>
  );
};

TargetTaskList.Empty = ({ queryKey }) => {
  const { onOpen } = useTasksStore();

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6 flex-1">
      <ArchiveX className="w-7 h-7" />
      <p className="text-sm italic">No tasks found.</p>
      <Button onClick={() => onOpen('createTask')}>Create Task +</Button>
    </div>
  );
};

export default TargetTaskList;
