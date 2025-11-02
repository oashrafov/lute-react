import { useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Image, TagsInput, Text, Textarea } from "@mantine/core";
import type {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
} from "mantine-react-table";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import { StatusRadio } from "../StatusRadio/StatusRadio";
import { TagsGroup } from "../../../../components/common/TagsGroup/TagsGroup";
import { TermImage } from "../TermImage/TermImage";
import { LanguageCell } from "../../../../components/common/LanguageCell/LanguageCell";
import { EditButtonsCell } from "../../../../components/common/EditButtonsCell/EditButtonsCell";
import {
  BACKEND_URL,
  MAX_TERM_SUGGESTIONS,
  STATUS_LABEL,
} from "../../../../resources/constants";
import { queries } from "../../api/queries";
import type { TermsListItem } from "../../api/types";
import type { LanguageChoice } from "../../../settings/api/types";
import type { Status } from "../../../../resources/types";
import { buildSuggestionsList } from "../../../../helpers/term";

const statusLabel = {
  ...STATUS_LABEL,
  6: STATUS_LABEL[99],
  7: STATUS_LABEL[98],
};

const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

export const columnDefinition = (
  languageChoices: LanguageChoice[],
  tagChoices: string[],
  setColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>>
): MRT_ColumnDef<TermsListItem>[] => [
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
        renderRoot={(props) => (
          <Link
            to="/terms/$termId"
            params={{ termId: row.original.id }}
            search={(prev) => ({ ...prev, langId: row.original.languageId })}
            {...props}
          />
        )}
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
        queries.termSuggestions(search, row.original.languageId)
      );

      const suggestions = data
        ? buildSuggestionsList(
            data.filter((d) => d.text !== row.original.text)
          ).map((item) => item.suggestion)
        : [];

      return (
        <TagsInput
          size="xs"
          w={160}
          searchValue={search}
          onSearchChange={setSearch}
          data={suggestions}
          limit={MAX_TERM_SUGGESTIONS}
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
          <Text size="sm" component="span" style={{ whiteSpace: "pre" }}>
            {row.original.translation}
          </Text>
          {img && <TermImage position="right" src={`${BACKEND_URL}${img}`} />}
        </>
      );
    },
    Edit: ({ row, cell }) => {
      const cellValue = cell.getValue();
      const [value, setValue] = useState(
        typeof cellValue === "string" ? cellValue : ""
      );
      const img = row.original.image;
      return (
        <>
          <Textarea
            wrapperProps={{ dir: row.original.textDirection }}
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
              src={`${BACKEND_URL}${img}`}
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
    columnFilterModeOptions: null,
    Cell: ({ row }) => {
      const tagsList = row.original.tagsString
        ? row.original.tagsString.split(",")
        : [];
      return <TagsGroup tags={tagsList} />;
    },
    Edit: ({ cell }) => {
      const cellValue = cell.getValue();
      const tagsList =
        typeof cellValue === "string" ? cellValue.split(",") : [];
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
      const statusId = row.original.statusId as Status | 6 | 7;
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

      const defaultFilter = {
        id: "status",
        value: [0, 6],
      };

      function handleSetFilter() {
        setColumnFilters((filters) => {
          const otherFilters = filters.filter(
            (filter) => filter.id !== "status"
          );
          const statusFilters = filters.filter(
            (filter) => filter.id === "status"
          );
          const filter = statusFilters[0].value as number[];

          return filter[0] === id && filter[1] === id
            ? [...otherFilters, defaultFilter]
            : [...otherFilters, statusFilter];
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
          {statusLabel[statusId]}
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
      label: (value) => statusLabel[value as Status | 6 | 7],
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
    columnFilterModeOptions: null,
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
    columnFilterModeOptions: null,
    enableEditing: false,
    Cell: ({ cell }) => {
      const cellValue = cell.getValue();
      return (
        typeof cellValue === "number" && (
          <span>{dateFormatter.format(cellValue)}</span>
        )
      );
    },
  },
  {
    id: "actions",
    header: "",
    columnDefType: "display",
    size: 0,
    Cell: ({ row, table }) => {
      const isEditing = table.getState().editingRow?.id === row.id;
      return <EditButtonsCell row={row} table={table} isEditing={isEditing} />;
    },
  },
];
