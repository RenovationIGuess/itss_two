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
import { useRequestActions } from '../hooks/useRequestActions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestUpdateSchema } from '../schema/form/request';
import { Loader } from 'lucide-react';
import useRequestStore from '../hooks/useRequestStore';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

const UpdateRequestModal = ({ queryKey }) => {
  const { isOpen, type, onClose, data } = useRequestStore();
  const { requestId, evidence } = data || {};

  const isModalOpen = useMemo(() => {
    return isOpen && type === 'updateRequest';
  }, [isOpen, type]);

  const { updating, updateRequest } = useRequestActions({ queryKey });

  const form = useForm({
    resolver: zodResolver(requestUpdateSchema),
    defaultValues: {
      evidence: '',
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        evidence: evidence || '',
      });
    }
  }, [isModalOpen]);

  const handleClose = useCallback(() => {
    onClose();
    form.reset({
      evidence: evidence || '',
    });
  }, [form, evidence, onClose]);

  const onSubmit = useCallback(
    (values) => {
      updateRequest(requestId, values, 'evidence', handleClose);
    },
    [updateRequest, requestId, handleClose]
  );

  form.watch();

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Request</DialogTitle>
          <DialogDescription>Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="evidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Evidence
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={updating}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      type="text"
                      id="evidence"
                      {...field}
                      placeholder="Enter evidence..."
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

export default UpdateRequestModal;
