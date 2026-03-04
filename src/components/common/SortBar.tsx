import React from "react";
import { Flame, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortBarProps {
  className?: string;
  activeSort?: string;
  onSortChange?: (sort: string) => void;
}

export const SortBar: React.FC<SortBarProps> = ({
  className,
  activeSort = "hot",
  onSortChange,
}) => {
  const handleSort = (sort: "hot" | "new" | "top") => {
    if (onSortChange) onSortChange(sort);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 sm:px-0 text-sm font-semibold text-muted-foreground overflow-x-auto no-scrollbar",
        className,
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-colors",
          activeSort === "hot" ? "bg-muted text-foreground" : "hover:bg-muted",
        )}
        onClick={() => handleSort("hot")}
      >
        <Flame
          size={20}
          className={cn(activeSort === "hot" && "text-primary fill-primary")}
        />{" "}
        Hot
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-colors",
          activeSort === "new" ? "bg-muted text-foreground" : "hover:bg-muted",
        )}
        onClick={() => handleSort("new")}
      >
        <Star
          size={20}
          className={cn(activeSort === "new" && "text-primary fill-primary")}
        />{" "}
        New
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-colors",
          activeSort === "top" ? "bg-muted text-foreground" : "hover:bg-muted",
        )}
        onClick={() => handleSort("top")}
      >
        <TrendingUp
          size={20}
          className={cn(activeSort === "top" && "text-primary fill-primary")}
        />{" "}
        Top
      </Button>
    </div>
  );
};
