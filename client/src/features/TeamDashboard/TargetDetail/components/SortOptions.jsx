import { ArrowDown, ArrowUp, CheckIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/utils';
import useTasksStore from '../hooks/useTasksStore';

const typeOptions = [
  {
    icon: ArrowUp,
    value: 'asc',
    label: 'Ascending',
  },
  {
    icon: ArrowDown,
    value: 'desc',
    label: 'Descending',
  },
];

const SortOptions = ({
  children,
  side = 'bottom',
  sideOffset = 5,
  align = 'start',
  alignOffset = 0,
}) => {
  const { searchQueries, setSearchQueries } = useTasksStore();
  const [open, setOpen] = useState(false);

  const handleSelectSortType = useCallback(
    (value) => {
      setSearchQueries({
        ...searchQueries,
        ['sort_type']: value,
      });
    },
    [searchQueries]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="w-48"
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {typeOptions.map((option) => {
                const isSelected =
                  searchQueries.sort_type &&
                  searchQueries.sort_type === option.value;

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleSelectSortType(option.value);
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortOptions;
