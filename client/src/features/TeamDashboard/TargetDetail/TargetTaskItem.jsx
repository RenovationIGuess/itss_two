import { format } from 'date-fns';
import { Check, CheckIcon, Edit2, Square, Trash } from 'lucide-react';
import React from 'react';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import useTasksStore from './hooks/useTasksStore';
import { cn } from '~/utils';
import { userStateContext } from '~/contexts/ContextProvider';
import { M7_AVATAR } from '~/constants/images';
import { useTaskActions } from './hooks/useTaskActions';
import useTeamStore from '../hooks/useTeamStore';

const TargetTaskItem = ({
  taskId,
  title,
  due,
  description,
  exp,
  completed,
  createdByAdmin,
  creatorId,
  creatorName,
  creatorAvatar,
  queryKey,
}) => {
  const { currentUser } = userStateContext();
  const { authUserRole } = useTeamStore();
  const { onOpen, selectedTaskId, setSelectedTaskId } = useTasksStore();

  const { updating, updateTask } = useTaskActions({
    queryKey,
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger
        disabled={authUserRole !== 'admin' && currentUser.id !== creatorId}
      >
        <Card
          onClick={() => createdByAdmin && setSelectedTaskId(taskId)}
          className={cn(
            'cursor-pointer hover:shadow-md relative',
            selectedTaskId === taskId && 'border-black'
          )}
        >
          {createdByAdmin && completed && (
            <div className="absolute top-5 right-6 w-8 h-8 bg-black/80 rounded-full text-white flex items-center justify-center">
              <Check className="w-5 h-5" strokeWidth={3} />
            </div>
          )}
          {!createdByAdmin && currentUser.id === creatorId && (
            <>
              {completed && (
                <div className="absolute top-5 right-6 w-8 h-8 bg-black/80 rounded-full text-white flex items-center justify-center">
                  <CheckIcon className="w-5 h-5" strokeWidth={3} />
                </div>
              )}
              {!completed && (
                <div
                  onClick={() =>
                    updateTask(taskId, {
                      completed: true,
                    })
                  }
                  className="absolute top-5 right-6 w-8 h-8 bg-black/80 rounded-full text-white flex items-center justify-center"
                >
                  <Square className="w-5 h-5" strokeWidth={3} />
                </div>
              )}
            </>
          )}
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description || 'No description'}</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="flex items-center gap-2">
              <span>Created By:</span>
              <img
                src={creatorAvatar || M7_AVATAR}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="font-bold">{creatorName}</span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p className="text-sm">
              {due ? format(new Date(due), 'MM/dd/yyyy') : 'Not specified'}
            </p>
            {createdByAdmin && <Badge>+ {exp} EXP</Badge>}
          </CardFooter>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() =>
            onOpen('updateTask', {
              taskId,
              title,
              due,
              description,
              exp,
            })
          }
          className="cursor-pointer"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Update
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onOpen('deleteTask', { taskId })}
          className="cursor-pointer"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TargetTaskItem;
