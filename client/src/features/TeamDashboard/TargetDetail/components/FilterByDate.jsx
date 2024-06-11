import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '~/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { useEffect, useState } from 'react';
import useTasksStore from '../hooks/useTasksStore';

const FilterByDate = () => {
  const { searchQueries, setSearchQueries } = useTasksStore();
  const [date, setDate] = useState();

  useEffect(() => {
    if (date) {
      setSearchQueries({
        ...searchQueries,
        ['date']: format(date, 'yyyy-MM-dd'),
      });
    } else {
      const filteredSearchQueries = Object.fromEntries(
        Object.entries(searchQueries).filter(([key]) => key !== 'date')
      );
      setSearchQueries({
        ...filteredSearchQueries,
      });
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default FilterByDate;
