import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CommentControlsProps {
  className?: string;
  onSortChange?: (sort: string) => void;
  onSearchClick?: () => void;
}

export const CommentControls: React.FC<CommentControlsProps> = ({
  className,
  onSortChange,
  onSearchClick,
}) => {
  const [activeSort, setActiveSort] = useState("Best");

  const handleSort = (sort: string) => {
    setActiveSort(sort);
    if (onSortChange) onSortChange(sort);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 sm:px-0 overflow-x-auto no-scrollbar",
        className,
      )}
    >
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[12px] text-muted-foreground whitespace-nowrap">
          Sort by:
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 font-bold text-[12px] text-muted-foreground hover:text-foreground"
            >
              {activeSort} <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 rounded-[12px]">
            {["Best", "Top", "New", "Controversial", "Old", "Q&A"].map(
              (sort) => (
                <DropdownMenuItem
                  key={sort}
                  className={cn(
                    "cursor-pointer",
                    activeSort === sort && "font-bold",
                  )}
                  onClick={() => handleSort(sort)}
                >
                  {sort}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative flex-1 min-w-[150px]" onClick={onSearchClick}>
        <div className="flex items-center h-9 px-3 rounded-full border border-border bg-muted/20 hover:border-muted-foreground transition-colors cursor-pointer group">
          <Search
            size={16}
            className="text-muted-foreground mr-2 shrink-0 group-hover:text-foreground"
          />
          <span className="text-[14px] text-muted-foreground truncate group-hover:text-foreground">
            Search Comments
          </span>
        </div>
      </div>
    </div>
  );
};
