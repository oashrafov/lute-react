import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Badge, Button, Image, TagsInput, Text, Textarea } from "@mantine/core";
import {
  IconCheck,
  IconMinus,
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
} from "@tabler/icons-react";
import StatusRadio from "../StatusRadio/StatusRadio";
import TagsGroup from "@common/TagsGroup/TagsGroup";
import TermImage from "../TermImage/TermImage";
import LanguageCell from "@common/LanguageCell/LanguageCell";
import { buildSuggestionsList } from "@actions/utils";
import { getTermSuggestionsQuery } from "@term/api/query";
import { MAX_PARENT_TAG_SUGGESTION_COUNT } from "@resources/constants";
import EditButtonsCell from "@common/EditButtonsCell/EditButtonsCell";

const status = {
  0: { icon: IconNumber0, label: "Unknown" },
  1: { icon: IconNumber1, label: "New" },
  2: { icon: IconNumber2, label: "New" },
  3: { icon: IconNumber3, label: "Learning" },
  4: { icon: IconNumber4, label: "Learning" },
  5: { icon: IconNumber5, label: "Learned" },

  6: { icon: IconCheck, label: "Well Known" },
  7: { icon: IconMinus, label: "Ignored" },

  98: { icon: IconMinus, label: "Ignored" },
  99: { icon: IconCheck, label: "Well Known" },
};

const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const columnDefinition = (languageChoices, tagChoices, setColumnFilters) => [
  {
    header: "TERM",
    accessorKey: "text",
    minSize: 300,
    enableEditing: false,
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    Cell: ({ row }) => (
      <Button
        maw={290}
        variant="subtle"
        size="compact-sm"
        component={Link}
        to={`/terms/term?termId=${row.original.id}&langId=${row.original.languageId}`}
        style={{ color: "inherit", textDecoration: "none" }}>
        <Text size="sm" lineClamp={1} truncate>
          {row.original.text}
        </Text>
      </Button>
    ),
  },
  {
    header: "PARENT",
    accessorKey: "parentsString",
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    minSize: 200,
    enableEditing: true,
    Cell: ({ row }) => {
      const parentsList = row.original.parentsString
        ? row.original.parentsString.split(",")
        : [];
      return <TagsGroup tags={parentsList} />;
    },
    Edit: ({ row, cell }) => {
      const parentsList = row.original.parentsString
        ? row.original.parentsString.split(",")
        : [];

      const [search, setSearch] = useState("");
      const [value, setValue] = useState(parentsList);
      const { data } = useQuery(
        getTermSuggestionsQuery(search, row.original.languageId)
      );

      const suggestions = data
        ? buildSuggestionsList(row.original.text, data).map(
            (item) => item.suggestion
          )
        : [];

      return (
        <TagsInput
          size="xs"
          w={160}
          searchValue={search}
          onSearchChange={setSearch}
          data={suggestions}
          limit={MAX_PARENT_TAG_SUGGESTION_COUNT}
          value={value}
          onChange={(parents) => {
            cell.row._valuesCache[cell.column.id] = parents.join(",");
            setValue(parents);
          }}
        />
      );
    },
  },
  {
    header: "TRANSLATION",
    accessorKey: "translation",
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    minSize: 300,
    size: 400,
    enableEditing: true,
    Cell: ({ row }) => {
      const img = row.original.image;
      return (
        <>
          <Text size="sm" component="span">
            {row.original.translation}
          </Text>
          {img && (
            <TermImage position="right" src={`http://localhost:5001${img}`} />
          )}
        </>
      );
    },
    Edit: ({ row, cell }) => {
      const [value, setValue] = useState(cell.getValue() ?? "");
      const img = row.original.image;
      return (
        <>
          <Textarea
            wrapperProps={{ dir: row.original.languageRtl ? "rtl" : "ltr" }}
            rows={1}
            size="xs"
            autosize
            spellCheck={false}
            autoCapitalize="off"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              cell.row._valuesCache[cell.column.id] = e.target.value;
            }}
          />
          {img && (
            <Image
              mt={5}
              src={`http://localhost:5001${img}`}
              radius={5}
              h={50}
              w={50}
            />
          )}
        </>
      );
    },
  },
  {
    header: "TAGS",
    id: "tagsString",
    accessorKey: "tagsString",
    mantineFilterSelectProps: {
      data: tagChoices,
    },
    enableEditing: true,
    filterVariant: "select",
    columnFilterModeOptions: false,
    Cell: ({ row }) => {
      const tagsList = row.original.tagsString
        ? row.original.tagsString.split(",")
        : [];
      return <TagsGroup tags={tagsList} />;
    },
    Edit: ({ cell }) => {
      const tagsList = cell.getValue() ? cell.getValue().split(",") : [];
      const [value, setValue] = useState(tagsList);

      return (
        <TagsInput
          size="xs"
          w={160}
          data={tagChoices}
          value={value}
          onChange={(tags) => {
            cell.row._valuesCache[cell.column.id] = tags.join(",");
            setValue(tags);
          }}
        />
      );
    },
  },
  {
    header: "STATUS",
    id: "status",
    filterVariant: "range-slider",
    enableColumnFilterModes: false,
    size: 210,
    enableEditing: true,
    accessorFn: (row) => {
      const statusId = row.statusId;
      return statusId === 98 ? 7 : statusId === 99 ? 6 : statusId;
    },
    Cell: ({ row }) => {
      const statusId = row.original.statusId;
      const label =
        statusId === 98 ? (
          <IconMinus size={16} />
        ) : statusId === 99 ? (
          <IconCheck size={16} />
        ) : (
          String(statusId)
        );
      const id = statusId === 98 ? 7 : statusId === 99 ? 6 : statusId;
      const statusFilter = {
        id: "status",
        value: [id, id],
      };
      const defaultFilter = { id: "status", value: [0, 6] };

      function handleSetFilter() {
        setColumnFilters((filters) => {
          const otherFilters = filters.filter(
            (filter) => filter.id !== "status"
          );
          const statusFilters = filters.filter(
            (filter) => filter.id === "status"
          );
          const sameFilter =
            statusFilters[0]?.value[0] === id &&
            statusFilters[0]?.value[1] === id;

          if (sameFilter) {
            return [...otherFilters, defaultFilter];
          } else {
            return [...otherFilters, statusFilter];
          }
        });
      }

      return (
        <Badge
          fw={600}
          fullWidth
          size="md"
          onClick={handleSetFilter}
          leftSection={label}
          style={{ cursor: "pointer" }}
          c={`var(--lute-text-color-status${statusId})`}
          bg={`var(--lute-color-highlight-status${statusId}`}>
          {status[statusId].label}
        </Badge>
      );
    },
    mantineFilterRangeSliderProps: {
      min: 0,
      max: 7,
      step: 1,
      minRange: 0,
      marks: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
      ],
      label: (value) => status[value].label,
    },
    Edit: ({ row, cell }) => {
      const [value, setValue] = useState(String(row.original.statusId));
      return (
        <StatusRadio
          size="sm"
          value={value}
          onChange={(v) => {
            cell.row._valuesCache[cell.column.id] = v;
            setValue(v);
          }}
        />
      );
    },
  },
  {
    header: "LANGUAGE",
    accessorKey: "language",
    filterVariant: "select",
    columnFilterModeOptions: false,
    enableEditing: false,
    mantineFilterSelectProps: {
      data: languageChoices.map((lang) => lang.name),
    },
    Cell: ({ row }) => (
      <LanguageCell
        language={row.original.language}
        onSetColumnFilters={setColumnFilters}
      />
    ),
  },
  {
    header: "ADDED ON",
    id: "createdOn",
    filterVariant: "date-range",
    accessorFn: (originalRow) => new Date(originalRow.createdOn),
    columnFilterModeOptions: false,
    enableEditing: false,
    Cell: ({ cell }) => <span>{dateFormatter.format(cell.getValue())}</span>,
  },
  {
    id: "actions",
    header: "",
    columnDefType: "display",
    size: "min-content",
    Cell: ({ row, table }) => {
      const isEditing = table.getState().editingRow?.id === row.id;
      return <EditButtonsCell row={row} table={table} isEditing={isEditing} />;
    },
  },
];

export default columnDefinition;
