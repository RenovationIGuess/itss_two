import { Edit2, Trash } from 'lucide-react';
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
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
import { M7_AVATAR } from '~/constants/images';
import useTeamStore from '../hooks/useTeamStore';
import { Badge } from '~/components/ui/badge';
import { userStateContext } from '~/contexts/ContextProvider';
import useRequestStore from './hooks/useRequestStore';
import { useRequestActions } from './hooks/useRequestActions';

const RequestItem = ({
  evidence,
  status,
  requestId,
  creatorId,
  creatorName,
  creatorAvatar,
  queryKey,
}) => {
  const { currentUser } = userStateContext();
  const { authUserRole } = useTeamStore();

  const { updateRequest } = useRequestActions({
    queryKey,
  });

  const { onOpen } = useRequestStore();

  const statusVariant = useMemo(() => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  }, [status]);

  return (
    <ContextMenu>
      <ContextMenuTrigger
        disabled={currentUser.id !== creatorId && authUserRole !== 'admin'}
      >
        <Card className="relative">
          <div className="space-y-2">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <img
                  src={creatorAvatar || M7_AVATAR}
                  className="w-7 h-7 object-cover rounded-full"
                />
                {creatorName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 px-3 space-y-2">{evidence}</CardContent>
            <CardFooter className="p-3 pt-0">
              {authUserRole === 'admin' && (
                <div className="flex items-center gap-2 ml-auto">
                  {status === 'pending' && (
                    <>
                      <Badge
                        className={'cursor-pointer'}
                        variant={'destructive'}
                        onClick={() =>
                          updateRequest(
                            requestId,
                            {
                              status: 'rejected',
                            },
                            'approve'
                          )
                        }
                      >
                        {'reject'}
                      </Badge>
                      <Badge
                        onClick={() =>
                          updateRequest(
                            requestId,
                            {
                              status: 'approved',
                            },
                            'approve'
                          )
                        }
                        className={'cursor-pointer'}
                        variant={'default'}
                      >
                        {'approve'}
                      </Badge>
                    </>
                  )}
                  {(status === 'approved' || status === 'rejected') && (
                    <Badge className={'cursor-pointer'} variant={statusVariant}>
                      {status}
                    </Badge>
                  )}
                </div>
              )}
              {authUserRole !== 'admin' && (
                <div className="flex items-center gap-2 ml-auto">
                  <Badge variant={statusVariant} className={'cursor-pointer'}>
                    {status}
                  </Badge>
                </div>
              )}
            </CardFooter>
          </div>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() =>
            onOpen('updateRequest', {
              requestId,
              evidence,
            })
          }
          className="cursor-pointer"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Update
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onOpen('deleteRequest', { requestId })}
          className="cursor-pointer"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default RequestItem;
