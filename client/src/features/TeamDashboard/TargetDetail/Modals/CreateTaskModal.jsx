import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { useCallback, useMemo } from 'react';
import { useTaskActions } from '../hooks/useTaskActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskCreationSchema } from '../schema/form/task';
import { Loader } from 'lucide-react';
import DatePicker from '~/components/DatePicker';
import useTasksStore from '../hooks/useTasksStore';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import useTeamStore from '../../hooks/useTeamStore';

const CreateTaskModal = ({ queryKey }) => {
  const { authUserRole } = useTeamStore();
  const { isOpen, type, onClose } = useTasksStore();

  const isModalOpen = useMemo(() => {
    return isOpen && type === 'createTask';
  }, [isOpen, type]);

  const { creating, createTask } = useTaskActions({ queryKey });

  const form = useForm({
    resolver: zodResolver(taskCreationSchema),
    defaultValues: {
      title: '',
      due: '',
      description: '',
      exp: 10,
    },
  });

  const handleClose = useCallback(() => {
    onClose();
    form.reset({
      title: '',
      due: '',
      description: '',
      exp: 10,
    });
  }, [form]);

  const onSubmit = useCallback(
    (values) => {
      values.due = values.due ? values.due.toISOString() : null;
      createTask(values, handleClose);
    },
    [createTask, handleClose]
  );

  form.watch();

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={creating}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      type="text"
                      id="title"
                      {...field}
                      placeholder="Enter title..."
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={creating}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      type="text"
                      id="description"
                      {...field}
                      placeholder="Enter description..."
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="due"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Due Date
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      initDate={field.value}
                      callback={(date) => {
                        form.setValue('due', date);
                      }}
                      className="flex w-full bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      disabled={creating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {authUserRole === 'admin' && (
              <FormField
                control={form.control}
                name="exp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Exp
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={creating}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        type="number"
                        min={1}
                        max={100}
                        id="exp"
                        {...field}
                        onChange={(e) => {
                          let updateValue = parseInt(e.target.value);

                          if (updateValue > 100) updateValue = 100;
                          else if (updateValue < 0) updateValue = 10;

                          form.setValue('exp', updateValue);
                        }}
                        placeholder="Enter a number..."
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className={''}>
              <Button type="submit" disabled={creating} variant="default">
                {creating ? (
                  <>
                    <Loader className="w-5 h-5 mr-1 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
