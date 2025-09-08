import { useQuery } from "@tanstack/react-query";
import { Progress, Tooltip } from "@mantine/core";
import { queries } from "../../api/queries";
import classes from "./StatsBar.module.css";

const labels: Record<string, string> = {
  0: "Unknown",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  99: "Well Known or Ignored",
};

export function StatsBar({ bookId }: { bookId: number }) {
  const { data } = useQuery(queries.stats(bookId));

  if (!data) {
    return (
      <Tooltip label="Please open the book to calculate stats">
        <Progress.Root>
          <Progress.Section value={0} />
        </Progress.Root>
      </Tooltip>
    );
  }

  return (
    <Progress.Root size={16} radius={10} className={classes.bar}>
      {Object.entries(data).map(
        ([status, { wordCount, percentage }], index) => {
          const msg = `${labels[status]}: ${percentage.toFixed(0)}% (${wordCount} words)`;
          return (
            percentage >= 1 && (
              <Tooltip key={index} label={msg}>
                <Progress.Section
                  value={percentage}
                  color={`var(--lute-color-highlight-status${status}`}
                />
              </Tooltip>
            )
          );
        }
      )}
    </Progress.Root>
  );
}
