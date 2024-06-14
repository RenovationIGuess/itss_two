import {
  // Ban,
  CheckIcon,
  X,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
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
import FilterByDate from './FilterByDate';
import { useLeaderboardQuery } from '../../Leaderboard/hooks/useLeaderboardQuery';
import useTasksStore from '../hooks/useTasksStore';
import { M7_AVATAR } from '~/constants/images';

const FilterOptions = ({
  children,
  side = 'bottom',
  sideOffset = 5,
  align = 'start',
}) => {
  const { searchQueries, setSearchQueries } = useTasksStore();
  const [open, setOpen] = useState(false);

  const { data: members, status } = useLeaderboardQuery({
    queryKey: ['members'],
  });

  const handleSelectFilterByCreator = useCallback(
    (value, isSelected) => {
      const filteredSearchQueries = Object.fromEntries(
        Object.entries(searchQueries).filter(([key]) => {
          if (isSelected) return key !== 'created_by';
          return true;
        })
      );

      if (!isSelected) {
        setSearchQueries({
          ...filteredSearchQueries,
          ['created_by']: value,
        });
      } else {
        setSearchQueries({
          ...filteredSearchQueries,
        });
      }
    },
    [searchQueries]
  );

  const handleClearFilter = useCallback(() => {
    // Only keep the sorting params
    const filteredSearchQueries = Object.fromEntries(
      Object.entries(searchQueries).filter(
        ([key]) => key === 'sort_by' || key === 'sort_type'
      )
    );
    setSearchQueries({
      ...filteredSearchQueries,
    });
  }, [searchQueries]);

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
          <FilterByDate />
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-bold text-zinc-400 uppercase">
            Filter by Creator
          </DropdownMenuLabel>
          <Command>
            <CommandInput placeholder={'Sort options...'} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <div className="space-y-1">
                  {members?.map(({ id, name, avatar }) => {
                    const isSelected =
                      searchQueries.created_by &&
                      searchQueries.created_by === id;

                    return (
                      <CommandItem
                        key={id}
                        onSelect={() => {
                          handleSelectFilterByCreator(id, isSelected);
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
                        <img
                          className="object-cover rounded-full w-6 h-6 mr-2"
                          src={avatar || M7_AVATAR}
                        />
                        <span>{name}</span>
                      </CommandItem>
                    );
                  })}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterOptions;
