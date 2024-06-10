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
import { useCallback, useEffect, useMemo } from 'react';
import { useTargetActions } from '../hooks/useTargetActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { targetUpdateSchema } from '../schema/form/target';
import { Loader } from 'lucide-react';
import DatePicker from '~/components/DatePicker';
import useTargetsStore from '../hooks/useTargetsStore';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

const UpdateTargetModal = ({ queryKey }) => {
  const { isOpen, type, onClose, data } = useTargetsStore();
  const { targetId, title, due, description, exp } = data || {};

  const isModalOpen = useMemo(() => {
    return isOpen && type === 'updateTarget';
  }, [isOpen, type]);

  const { updating, updateTarget } = useTargetActions({ queryKey });

  const form = useForm({
    resolver: zodResolver(targetUpdateSchema),
    defaultValues: {
      title: '',
      due: '',
      description: '',
      exp: 10,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        title: title || '',
        due: due ? new Date(due) : '',
        description: description || '',
        exp: exp || 10,
      });
    }
  }, [isModalOpen]);

  const handleClose = useCallback(() => {
    onClose();
    form.reset({
      title: title || '',
      due: due ? new Date(due) : '',
      description: description || '',
      exp: exp || 10,
    });
  }, [form, title, due, exp, description, onClose]);

  const onSubmit = useCallback(
    (values) => {
      values.due = values.due ? values.due.toISOString() : null;
      updateTarget(targetId, values, handleClose);
    },
    [updateTarget, targetId, handleClose]
  );

  form.watch();

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Target</DialogTitle>
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
                      disabled={updating}
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
                      disabled={updating}
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
                      disabled={updating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      disabled={updating}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      type="number"
                      min={1}
                      max={100}
                      id="exp"
                      {...field}
                      onChange={(e) =>
                        form.setValue('exp', parseInt(e.target.value))
                      }
                      placeholder="Enter a number..."
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className={''}>
              <Button type="submit" disabled={updating} variant="default">
                {updating ? (
                  <>
                    <Loader className="w-5 h-5 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTargetModal;
