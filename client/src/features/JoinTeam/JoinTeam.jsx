import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useJoinTeamActions } from './useJoinTeamActions';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Team name is required.',
  }),
});

const JoinTeam = () => {
  const { joining, joinTeam } = useJoinTeamActions();
  const { creating, createTeam } = useJoinTeamActions();

  const [mode, setMode] = React.useState('create');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = React.useCallback(
    (values) => {
      if (mode === 'create') {
        createTeam(values);
      } else {
        joinTeam(values);
      }
    },
    [form, mode]
  );

  form.watch();

  return (
    <div className="flex items-center justify-center w-full h-full bg-zinc-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Join a Team</CardTitle>
          <CardDescription>Enter team name to join or create.</CardDescription>
        </CardHeader>
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value)}
          className="w-full px-6 pb-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>
        </Tabs>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Team Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={creating || joining}
                          type="text"
                          id="name"
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Team Name"
                          {...field}
                          autoComplete="off"
                          autoFocus={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CardFooter className="flex justify-end p-0">
                  <Button disabled={creating || joining} type="submit">
                    {mode === 'create' ? 'Create Team' : 'Join Team'}
                  </Button>
                </CardFooter>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinTeam;
