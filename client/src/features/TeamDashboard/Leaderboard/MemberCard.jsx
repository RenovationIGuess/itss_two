import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { M7_AVATAR } from '~/constants/images';
import { LEVELS } from './data/levels';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';

// Sort from highest exp to lowest
const sortedLevels = Object.entries(LEVELS).sort((a, b) => b[1].exp - a[1].exp);

const MemberCard = ({ userId, index, avatar, name, role, exp }) => {
  const currentLevel = useMemo(() => {
    const userExp = exp;
    const level = sortedLevels.find(([, { exp }]) => userExp >= exp);

    return LEVELS[level[0]];
  }, [sortedLevels, exp]);

  const nextLevel = useMemo(() => {
    const userExp = exp;
    const level = Object.entries(LEVELS).find(([, { exp }]) => userExp < exp);

    return LEVELS[level[0]];
  }, [LEVELS, exp]);

  const nextLevelProgress = useMemo(() => {
    return (exp / nextLevel.exp) * 100;
  }, [exp, nextLevel]);

  return (
    <Card className="relative">
      <div className="absolute top-3 right-3 text-2xl font-bold uppercase text-gray-400 leading-none w-fit">
        {index + 1}
      </div>
      <div className="space-y-2">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <img
              src={avatar || M7_AVATAR}
              className="w-7 h-7 object-cover rounded-full"
            />
            {name}
          </CardTitle>
          <CardDescription className="p-0 pl-9 uppercase">
            {role}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 px-3 space-y-2">
          <div className="flex items-center justify-between">
            <Badge>{currentLevel.label}</Badge>
            <Badge>{nextLevel.label}</Badge>
          </div>
          <Progress value={nextLevelProgress} className="h-2.5" />
          <p className="text-sm text-center">
            {exp}/{nextLevel.exp}
          </p>
        </CardContent>
        <CardFooter className="p-3 pt-0">{/* <p>Card Footer</p> */}</CardFooter>
      </div>
    </Card>
  );
};

export default MemberCard;
