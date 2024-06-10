import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useTargetsStore from '../Targets/hooks/useTargetsStore';
import { format } from 'date-fns';
import { Badge } from '~/components/ui/badge';
import { Crosshair, Loader, ServerCrash } from 'lucide-react';
import { useTargetQuery } from './hooks/useTargetQuery';

const TargetDetailSection = () => {
  const { id: teamId } = useParams();
  const { selectedTargetId } = useTargetsStore();

  const queryKey = useMemo(() => {
    return ['team-target-detail', teamId, selectedTargetId];
  }, [teamId, selectedTargetId]);

  const { data: target, status } = useTargetQuery({
    queryKey,
  });

  if (!selectedTargetId) {
    return <TargetDetailSection.Empty />;
  }

  if (status === 'pending') {
    return <TargetDetailSection.Skeleton />;
  }

  if (status === 'error') {
    return <TargetDetailSection.Error />;
  }

  return (
    <div className="pt-4 px-6 pb-0 space-y-1.5 relative">
      <h1 className="text-2xl font-bold">{target.title}</h1>
      <p className="text-gray-500">{target.description}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm">
          {target.due
            ? format(new Date(target.due), 'MM/dd/yyyy')
            : 'Not specified'}
        </p>
        <Badge>+ {target.exp} EXP</Badge>
      </div>
    </div>
  );
};

TargetDetailSection.Skeleton = () => {
  return (
    <div className="pt-4 px-6 pb-0 h-32 flex items-center justify-center relative">
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader className="w-7 h-7 animate-spin" />
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );
};

TargetDetailSection.Error = () => {
  return (
    <div className="pt-4 px-6 pb-0 h-32 flex items-center justify-center relative">
      <div className="flex flex-col items-center justify-center gap-2">
        <ServerCrash className="w-7 h-7" />
        <p className="text-sm">Something went wrong</p>
      </div>
    </div>
  );
};

TargetDetailSection.Empty = () => {
  return (
    <div className="pt-4 px-6 pb-0 h-32 flex items-center justify-center relative">
      <div className="flex flex-col items-center justify-center gap-2">
        <Crosshair className="w-7 h-7" />
        <p className="text-sm">No Target Selected</p>
      </div>
    </div>
  );
};

export default TargetDetailSection;
