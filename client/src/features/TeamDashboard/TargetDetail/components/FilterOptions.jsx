import {
  // Ban,
  CheckIcon,
  Clock12,
  Clock3,
  Clock6,
  MoveDown,
  MoveRight,
  MoveUp,
  X,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { cn } from '~/utils';
import { ScrollArea } from '~/components/ui/scroll-area';
import FilterByTags from './FilterByTags';
import FilterByColors from './FilterByColors';
import FilterByDate from './FilterByDate';

const timeOptions = [
  {
    icon: Clock12,
    value: 'not_started',
    label: 'Not Started',
  },
  {
    icon: Clock3,
    value: 'started',
    label: 'Already Started',
  },
  {
    icon: Clock6,
    value: 'past_due',
    label: 'Past Due',
  },
];

const priorityOptions = [
  // {
  //   icon: Ban,
  //   value: 'none',
  //   label: 'None',
  // },
  {
    icon: MoveDown,
    value: 'low',
    label: 'Low',
  },
  {
    icon: MoveRight,
    value: 'medium',
    label: 'Medium',
  },
  {
    icon: MoveUp,
    value: 'high',
    label: 'High',
  },
];

const FilterOptions = ({
  children,
  side = 'bottom',
  sideOffset = 5,
  align = 'start',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const handleSelectFilterByPriority = useCallback(
    (value, isSelected) => {
      const filteredSearchParams = Object.fromEntries(
        [...searchParams].filter(([key]) => {
          if (isSelected) return key !== 'filter_by_priority';
          return true;
        })
      );

      if (!isSelected) {
        setSearchParams({
          ...filteredSearchParams,
          ['filter_by_priority']: value,
        });
      } else {
        setSearchParams({
          ...filteredSearchParams,
        });
      }
    },
    [searchParams]
  );

  const handleSelectFilterByTime = useCallback(
    (value, isSelected) => {
      const filteredSearchParams = Object.fromEntries(
        [...searchParams].filter(([key]) => {
          if (isSelected)
            return key !== 'filter_by_time' && key !== 'filter_date';
          return key !== 'filter_date';
        })
      );

      if (!isSelected) {
        setSearchParams({
          ...filteredSearchParams,
          ['filter_by_time']: value,
        });
      } else {
        setSearchParams({
          ...filteredSearchParams,
        });
      }
    },
    [searchParams]
  );

  const handleClearFilter = useCallback(() => {
    // Only keep the sorting params
    const filteredSearchParams = Object.fromEntries(
      [...searchParams].filter(
        ([key]) => key === 'sort_by' || key === 'sort_type'
      )
    );
    setSearchParams({
      ...filteredSearchParams,
    });
  }, [searchParams]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="w-80"
      >
        <ScrollArea className="max-h-[512px] overflow-y-auto pr-2">
          <DropdownMenuItem
            onClick={handleClearFilter}
            className="flex items-center justify-center cursor-pointer"
          >
            <X className="h-4 w-4 mr-1.5" />
            Clear Filters
          </DropdownMenuItem>
          <DropdownMenuLabel className="text-xs font-bold text-zinc-400 uppercase">
            Filter by Time
          </DropdownMenuLabel>
          <Command>
            <CommandInput placeholder={'Sort options...'} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {timeOptions.map((option) => {
                  const isSelected =
                    searchParams.has('filter_by_time') &&
                    searchParams.get('filter_by_time') === option.value;

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        handleSelectFilterByTime(option.value, isSelected);
                      }}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className={cn('h-4 w-4')} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          {/* <DropdownMenuSeparator /> */}
          <FilterByDate />
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-bold text-zinc-400 uppercase">
            Filter by Priority
          </DropdownMenuLabel>
          <Command>
            <CommandInput placeholder={'Sort options...'} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {priorityOptions.map((option) => {
                  const isSelected =
                    searchParams.has('filter_by_priority') &&
                    searchParams.get('filter_by_priority') === option.value;

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        handleSelectFilterByPriority(option.value, isSelected);
                      }}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className={cn('h-4 w-4')} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          <DropdownMenuSeparator />
          <FilterByTags />
          <DropdownMenuSeparator />
          <FilterByColors />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterOptions;
