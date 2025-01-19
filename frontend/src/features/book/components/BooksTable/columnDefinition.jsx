import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Group, Pill, PillGroup, Text, ThemeIcon } from "@mantine/core";
import { IconArchiveFilled, IconCircleCheckFilled } from "@tabler/icons-react";
import StatsBar from "../StatsBar/StatsBar";
import { getBookStatsQuery } from "../../api/query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const columnDefinition = (languageChoices, tagChoices) => [
  {
    header: "TITLE",
    accessorKey: "title",
    minSize: 600,
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    Cell: ({ row }) => {
      const currentPage = row.original.currentPage;
      const pageCount = row.original.pageCount;
      const title = row.original.title;
      const isCompleted = row.original.isCompleted;
      const isArchived = row.original.isArchived;
      return (
        <Group gap={5} align="center" wrap="nowrap">
          <ThemeIcon
            size="sm"
            color={isCompleted ? "green.6" : "dark.1"}
            variant="transparent">
            <IconCircleCheckFilled />
          </ThemeIcon>
          <Link
            to={`/books/${row.original.id}/pages/${currentPage}`}
            style={{ color: "inherit", textDecoration: "none" }}>
            <Text size="sm" lineClamp={1}>
              {title}
            </Text>
          </Link>
          {currentPage > 1 && (
            <Text component="span" size="xs" c="dimmed">
              ({currentPage}/{pageCount})
            </Text>
          )}
          {isArchived && (
            <ThemeIcon
              size="xs"
              variant="transparent"
              color="dimmed"
              opacity="0.4">
              <IconArchiveFilled />
            </ThemeIcon>
          )}
        </Group>
      );
    },
  },
  {
    header: "LANGUAGE",
    accessorKey: "language",
    filterVariant: "select",
    columnFilterModeOptions: false,
    mantineFilterSelectProps: {
      data: languageChoices.map((lang) => lang.name),
    },
  },
  {
    header: "WORD COUNT",
    accessorKey: "wordCount",
    columnFilterModeOptions: ["equals", "greaterThan", "lessThan", "notEquals"],
  },
  {
    header: "STATUS",
    id: "status",
    accessorKey: "unknownPercent",
    Cell: ({ row }) => {
      const { data } = useQuery(getBookStatsQuery(row.original.id));
      return <StatsBar data={data} />;
    },
    columnFilterModeOptions: ["equals", "greaterThan", "lessThan", "notEquals"],
    mantineFilterTextInputProps: {
      placeholder: "Filter by Unknown %",
    },
  },
  {
    header: "TAGS",
    id: "tags",
    mantineFilterSelectProps: {
      data: tagChoices,
    },
    filterVariant: "select",
    columnFilterModeOptions: false,
    accessorFn: (row) => (row.tags.length > 0 ? row.tags.join() : ""),
    Cell: ({ row }) => (
      <PillGroup gap={4}>
        {row.original.tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </PillGroup>
    ),
  },
  {
    header: "LAST READ",
    id: "lastRead",
    accessorKey: "lastRead",
    columnFilterModeOptions: false,
    enableColumnFilter: false,
    Cell: ({ row }) =>
      row.original.lastRead && (
        <span>{dayjs(row.original.lastRead).fromNow()}</span>
      ),
  },
];

export default columnDefinition;
