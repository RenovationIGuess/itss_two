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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { requestCreationSchema } from '../schema/form/request';
import { useRequestActions } from '../hooks/useRequestActions';
import useRequestStore from '../hooks/useRequestStore';

const CreateRequestModal = ({ queryKey }) => {
  const { isOpen, type, onClose } = useRequestStore();

  const isModalOpen = useMemo(() => {
    return isOpen && type === 'createRequest';
  }, [isOpen, type]);

  const { creating, createRequest } = useRequestActions({ queryKey });

  const form = useForm({
    resolver: zodResolver(requestCreationSchema),
    defaultValues: {
      evidence: '',
    },
  });

  const handleClose = useCallback(() => {
    onClose();
    form.reset({
      evidence: '',
    });
  }, [form]);

  const onSubmit = useCallback(
    (values) => {
      createRequest(values, handleClose);
    },
    [createRequest, handleClose]
  );

  form.watch();

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Approve Request</DialogTitle>
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
                      disabled={creating}
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

export default CreateRequestModal;
