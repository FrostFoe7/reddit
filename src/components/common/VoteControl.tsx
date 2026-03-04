import React, { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoteControlProps {
  initialScore: number;
  initialVoteStatus?: "up" | "down" | null;
  onVote?: (type: "up" | "down" | null) => void;
  className?: string;
}

const formatNumber = (num: number) =>
  num > 999 ? (num / 1000).toFixed(1) + "k" : num;

export const VoteControl: React.FC<VoteControlProps> = ({
  initialScore,
  initialVoteStatus = null,
  onVote,
  className,
}) => {
  const [voteStatus, setVoteStatus] = useState<"up" | "down" | null>(
    initialVoteStatus,
  );

  const handleVote = (type: "up" | "down", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = voteStatus === type ? null : type;
    setVoteStatus(newStatus);
    if (onVote) onVote(newStatus);
  };

  const score =
    initialScore + (voteStatus === "up" ? 1 : voteStatus === "down" ? -1 : 0);

  return (
    <div
      className={cn(
        "flex items-center bg-secondary-background rounded-full h-8 overflow-hidden border border-transparent hover:border-border transition-colors",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-none hover:text-vote-up hover:bg-muted",
          voteStatus === "up" && "text-vote-up bg-muted",
        )}
        onClick={(e) => handleVote("up", e)}
      >
        <ArrowBigUp
          size={20}
          className={cn(voteStatus === "up" && "fill-current")}
        />
      </Button>
      <span
        className={cn(
          "px-1 font-bold text-[12px] min-w-[20px] text-center",
          voteStatus === "up"
            ? "text-vote-up"
            : voteStatus === "down"
              ? "text-vote-down"
              : "text-foreground",
        )}
      >
        {formatNumber(score)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-none hover:text-vote-down hover:bg-muted",
          voteStatus === "down" && "text-vote-down bg-muted",
        )}
        onClick={(e) => handleVote("down", e)}
      >
        <ArrowBigDown
          size={20}
          className={cn(voteStatus === "down" && "fill-current")}
        />
      </Button>
    </div>
  );
};
