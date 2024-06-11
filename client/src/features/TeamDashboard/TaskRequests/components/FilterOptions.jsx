import {
  // Ban,
  CheckIcon,
  MoveDown,
  MoveRight,
  MoveUp,
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
import useRequestStore from '../hooks/useRequestStore';

const statusOptions = [
  {
    icon: MoveDown,
    value: 'pending',
    label: 'Pending',
  },
  {
    icon: MoveRight,
    value: 'rejected',
    label: 'Rejected',
  },
  {
    icon: MoveUp,
    value: 'approved',
    label: 'Approved',
  },
];

const FilterOptions = ({
  children,
  side = 'bottom',
  sideOffset = 5,
  align = 'start',
}) => {
  const { searchQueries, setSearchQueries } = useRequestStore();
  const [open, setOpen] = useState(false);

  const handleSelectFilterByStatus = useCallback(
    (value, isSelected) => {
      const filteredSearchQueries = Object.fromEntries(
        Object.entries(searchQueries).filter(([key]) => {
          if (isSelected) return key !== 'status';
          return true;
        })
      );

      if (!isSelected) {
        setSearchQueries({
          ...filteredSearchQueries,
          ['status']: value,
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
      filteredSearchQueries.filter(
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
        className="w-60"
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
            Filter by Priority
          </DropdownMenuLabel>
          <Command>
            <CommandInput placeholder={'Sort options...'} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statusOptions.map((option) => {
                  const isSelected =
                    searchQueries.status &&
                    searchQueries.status === option.value;

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        handleSelectFilterByStatus(option.value, isSelected);
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
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterOptions;
