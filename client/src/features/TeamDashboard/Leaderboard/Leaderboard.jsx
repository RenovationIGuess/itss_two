import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useLeaderboardQuery } from './hooks/useLeaderboardQuery';
import { Loader, SearchX, ServerCrash, Users } from 'lucide-react';
import { ScrollArea } from '~/components/ui/scroll-area';
import MemberCard from './MemberCard';
import { useTeamDetailQuery } from './hooks/useTeamDetailQuery';

const Leaderboard = () => {
  const { id: teamId } = useParams();

  const queryKey = useMemo(() => {
    return ['team-leaderboard', teamId];
  }, [teamId]);

  const teamDetailQueryKey = useMemo(() => {
    return ['team-detail', teamId];
  }, [teamId]);

  const { data: leaderboard, status: fetchLeaderboardStatus } =
    useLeaderboardQuery({
      queryKey,
    });

  const { data: teamDetail, status: fetchTeamDetailStatus } =
    useTeamDetailQuery({
      teamDetailQueryKey,
    });

  if (
    fetchLeaderboardStatus === 'pending' ||
    fetchTeamDetailStatus === 'pending'
  ) {
    return <Leaderboard.Skeleton />;
  }

  if (fetchLeaderboardStatus === 'error' || fetchTeamDetailStatus === 'error') {
    return <Leaderboard.Error />;
  }

  // if (leaderboard.length === 0) {
  //   return <Leaderboard.Empty />;
  // }

  return (
    <div className="border-r border-secondary col-span-3 flex flex-col overflow-hidden">
      <div className="pt-4 px-6 pb-0 relative">
        <div className="w-full bg-zinc-200/50 rounded-md p-4">
          <h1 className="text-2xl font-bold">Team: {teamDetail?.name}</h1>
          <div className="grid grid-cols-2 gap-2 text-zinc-500 mt-1.5">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <p>{teamDetail?.members_count} members</p>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <p>{teamDetail?.targets_count} targets</p>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <p>{teamDetail?.tasks_count} tasks</p>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <p>{teamDetail?.requests_count} requests</p>
            </div>
          </div>
        </div>
      </div>
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
    <div className="border-r border-secondary col-span-3 flex flex-col">
      <div className="pt-4 px-6 pb-0 relative">
        <div className="w-full h-40 bg-zinc-200/50 rounded-md flex items-center justify-center p-4">
          <div className="flex flex-col gap-2 items-center justify-center flex-1">
            <Loader className="w-7 h-7 animate-spin" />
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      </div>
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
    <div className="border-r border-secondary col-span-3 flex flex-col">
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
    <div className="border-r border-secondary col-span-3 flex flex-col">
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
