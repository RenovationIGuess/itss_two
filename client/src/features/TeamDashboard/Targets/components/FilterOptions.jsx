import { Clock6, MoveUp, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { ScrollArea } from '~/components/ui/scroll-area';
import FilterByDate from './FilterByDate';
import useTargetsStore from '../hooks/useTargetsStore';

const FilterOptions = ({
  children,
  side = 'bottom',
  sideOffset = 5,
  align = 'start',
}) => {
  const { searchQueries, setSearchQueries } = useTargetsStore();
  const [open, setOpen] = useState(false);

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
          <FilterByDate />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterOptions;
