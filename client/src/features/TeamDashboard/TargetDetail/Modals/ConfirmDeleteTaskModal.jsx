import { useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Loader } from 'lucide-react';
import useTasksStore from '../hooks/useTasksStore';
import { useTaskActions } from '../hooks/useTaskActions';

const ConfirmDeleteTaskModal = ({ queryKey }) => {
  const { isOpen, onClose, type, data } = useTasksStore();
  const { taskId } = data;

  const { deleting, deleteTask } = useTaskActions({
    queryKey,
  });

  const isModalOpen = useMemo(() => {
    return isOpen && type === 'deleteTask';
  }, [isOpen, type]);

  const onDelete = useCallback(() => {
    deleteTask(taskId, onClose);
  }, [taskId, onClose, deleteTask]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className={'pt-8 px-6'}>
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Task
          </DialogTitle>
          <DialogDescription className="text-center texgt-zinc-500">
            Once delete it cannot be undone. Are you sure you want to delete?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={'bg-gray-100 px-6 py-4'}>
          <Button disabled={deleting} variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={deleting} variant="destructive" onClick={onDelete}>
            {deleting ? (
              <>
                <Loader className="w-5 h-5 mr-1 text-white animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteTaskModal;
