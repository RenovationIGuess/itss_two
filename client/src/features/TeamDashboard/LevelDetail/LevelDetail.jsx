import React, { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useTeamProfileQuery } from './hooks/useTeamProfileQuery';
import { useParams } from 'react-router-dom';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { LEVELS } from '../Leaderboard/data/levels';
import TaskRequests from '../TaskRequests/TaskRequests';

const LevelDetail = ({ disableViewRequests = false }) => {
  const { id: teamId } = useParams();

  // ['requests', 'levels']
  const [view, setView] = useState('levels');

  const queryKey = useMemo(() => {
    return ['team-profile', teamId];
  }, [teamId]);

  const { data: profile, status } = useTeamProfileQuery({
    queryKey,
  });

  if (view === 'requests') {
    return <TaskRequests />;
  }

  return (
    <div className="col-span-3 flex flex-col overflow-hidden">
      <Tabs
        className="px-6 pt-4"
        value={view}
        onValueChange={(value) => setView(value)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger disabled={disableViewRequests} value="requests">
            Requests
          </TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="pt-4 px-6 pb-0 space-y-1.5 relative">
        <h1 className="text-2xl font-bold">Levels</h1>
        <p className="text-gray-500">Every levels in the system ~</p>
      </div>
      <ScrollArea className="flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto px-6 pt-4 pb-6">
        {/* <div className="rounded-md bg-zinc-200/50 p-4 pt-3 mb-4">
          <h2 className="text-base font-bold">Exp increase history</h2>
        </div> */}
        <div className="flex flex-col gap-8">
          {Object.entries(LEVELS).map(([key, value]) => (
            <LevelDetail.LevelItem
              key={key}
              userExp={profile?.exp}
              label={value.label}
              requiredExp={value.exp}
              icon={value.icon}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

LevelDetail.LevelItem = ({ userExp, label, requiredExp, icon }) => {
  const progress = useMemo(() => {
    const value = Math.round((userExp / requiredExp) * 100);
    return value > 100 ? 100 : value;
  }, [userExp]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Badge>
          {label} {icon}
        </Badge>
        <p className="text-sm">
          <span>{userExp}</span>/<span>{requiredExp}</span>
        </p>
      </div>
      <Progress value={progress} className="h-2.5" />
    </div>
  );
};

export default LevelDetail;
