import React, { useEffect } from 'react';
import RequestItem from './RequestItem';
import { ScrollArea } from '~/components/ui/scroll-area';
import { ArchiveX, Loader, ServerCrash } from 'lucide-react';
import { Button } from '~/components/ui/button';
import useRequestStore from './hooks/useRequestStore';
import useTasksStore from '../TargetDetail/hooks/useTasksStore';
import { useRequestQuery } from './hooks/useRequestQuery';
import { userStateContext } from '~/contexts/ContextProvider';

const RequestList = ({ queryKey }) => {
  const { currentUser } = userStateContext();
  const { selectedTaskId } = useTasksStore();
  const { setAuthUserRequestCreated } = useRequestStore();
  const { data: requests, status } = useRequestQuery({ queryKey });

  useEffect(() => {
    if (!requests) return;

    const authUserCreatedRequest = requests.some(
      (request) => request.user.id === currentUser.id
    );

    setAuthUserRequestCreated(authUserCreatedRequest);
  }, [requests]);

  if (!selectedTaskId) {
    return null;
  }

  if (status === 'pending') {
    return <RequestList.Skeleton />;
  }

  if (status === 'error') {
    return <RequestList.Error />;
  }

  if (requests.length === 0) {
    return <RequestList.Empty />;
  }

  return (
    <ScrollArea className="flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto px-6 pt-4 pb-6">
      <div className="flex flex-col gap-4">
        {requests.map((request) => (
          <RequestItem
            key={request.id}
            requestId={request.id}
            evidence={request.evidence}
            creatorName={request.user.name}
            creatorId={request.user.id}
            status={request.status}
            creatorAvatar={request.user.avatar}
            queryKey={queryKey}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

RequestList.Skeleton = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
      <Loader className="w-7 h-7 animate-spin" />
      <p className="text-sm italic">Loading...</p>
    </div>
  );
};

RequestList.Error = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
      <ServerCrash className="w-7 h-7" />
      <p className="text-sm italic">Something went wrong.</p>
    </div>
  );
};

RequestList.Empty = ({ queryKey }) => {
  const { onOpen } = useRequestStore();

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6 flex-1">
      <ArchiveX className="w-7 h-7" />
      <p className="text-sm italic">No requests found.</p>
      <Button onClick={() => onOpen('createRequest')}>Create Request +</Button>
    </div>
  );
};

export default RequestList;
