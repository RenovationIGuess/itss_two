import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useLeaderboardQuery } from './hooks/useLeaderboardQuery';
import { Loader, SearchX, ServerCrash } from 'lucide-react';
import { ScrollArea } from '~/components/ui/scroll-area';
import MemberCard from './MemberCard';

const Leaderboard = () => {
  const { id: teamId } = useParams();

  const queryKey = useMemo(() => {
    return ['team-leaderboard', teamId];
  }, [teamId]);

  const { data: leaderboard, status } = useLeaderboardQuery({
    queryKey,
  });

  if (status === 'pending') {
    return <Leaderboard.Skeleton />;
  }

  if (status === 'error') {
    return <Leaderboard.Error />;
  }

  if (leaderboard.length === 0) {
    return <Leaderboard.Empty />;
  }

  return (
    <div className="border-r border-secondary col-span-3 flex flex-col">
      <div className="pt-4 px-6 pb-0 space-y-1.5 relative">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-gray-500">All team's members</p>
      </div>
      <ScrollArea className="flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto px-6 pb-6 pt-4">
        <div className="flex flex-col gap-4">
          {leaderboard.map((member, index) => (
            <MemberCard
              key={member.id}
              index={index}
              userId={member.id}
              name={member.name}
              avatar={member.avatar}
              role={member.pivot.role}
              exp={member.pivot.exp}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

Leaderboard.Skeleton = () => {
  return (
    <div className="border-r border-secondary col-span-2 flex flex-col">
      <div className="pt-4 px-6 pb-0 space-y-1.5 relative">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-gray-500">All team's members</p>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center flex-1">
        <Loader className="w-7 h-7 animate-spin" />
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );
};

Leaderboard.Error = () => {
  return (
    <div className="border-r border-secondary col-span-2 flex flex-col">
      <div className="pt-4 px-6 pb-0 space-y-1.5 relative">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-gray-500">All team's members</p>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center flex-1">
        <ServerCrash className="w-7 h-7" />
        <p className="text-sm">Something went wrong</p>
      </div>
    </div>
  );
};

Leaderboard.Empty = () => {
  return (
    <div className="border-r border-secondary col-span-2 flex flex-col">
      <div className="pt-4 px-6 pb-0 space-y-1.5 relative">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-gray-500">All team's members</p>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center flex-1">
        <SearchX className="w-7 h-7" />
        <p className="text-sm">No members found</p>
      </div>
    </div>
  );
};

export default Leaderboard;
