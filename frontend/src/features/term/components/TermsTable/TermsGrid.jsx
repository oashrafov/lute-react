import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  colorSchemeDark,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  ActionIconGroup,
  Badge,
  Box,
  Button,
  InputClearButton,
  RangeSlider,
  Select,
  TagsInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconCheck,
  IconDeviceFloppy,
  IconEdit,
  IconMinus,
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
  IconSelector,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import StatusRadio from "../StatusRadio/StatusRadio";
import TermImage from "../TermImage/TermImage";
import { initialQuery } from "@settings/api/settings";
// import { getTagSuggestionsQuery } from "@term/api/query";
import { DatePickerInput } from "@mantine/dates";
import TagsGroup from "@common/TagsGroup/TagsGroup";
import { Link } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  fontFamily: "Poppins, sans-serif",
  accentColor: "var(--mantine-color-blue-6)",
  backgroundColor: "var(--mantine-color-body)",
  headerBackgroundColor: "var(--mantine-color-body)",
  textColor: "var(--mantine-color-text)",
  borderColor: "var(--mantine-color-dark-4)",
  spacing: 6,
  wrapperBorder: false,
  columnBorder: true,
  rowHoverColor: "var(--mantine-color-orange-0)",
  // headerColumnBorder: true,
  headerRowBorder: true,
  headerHeight: 36,
  headerFontWeight: 700,
  headerCellHoverBackgroundColor: "var(--mantine-color-blue-0)",
  cellEditingBorder: false,
  cellEditingShadow: false,

  // cellTextColor: "var(--mantine-color-gray-8)",
  // headerTextColor: "var(--mantine-color-gray-8)",

  // headerFontFamily: 'Brush Script MT',
  // cellFontFamily: 'monospace',
});

const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

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

const defaultColumnDef = {
  flex: 1,
  filter: true,
  floatingFilter: true,
  editable: true,
  resizable: false,
  // filterParams: {
  //   buttons: ["reset"],
  // },
  // autoHeight: true,
};

const selectionColumnDef = {
  pinned: "left",
};

const url = new URL("/api/terms", "http://localhost:5001");

function TermsGrid() {
  const { data } = useQuery({
    queryKey: ["terms", url.href],
    queryFn: async () => {
      const response = await fetch(url.href);
      return await response.json();
    },
    // placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  // const { data: termTags } = useQuery(getTagSuggestionsQuery);

  const gridRef = useRef(null);

  const rowData = data?.data;

  const [colDefs] = useState([
    {
      field: "text",
      headerName: "TERM",
      editable: false,
      cellRenderer: TermCell,
      // checkboxSelection: true,
      floatingFilterComponent: FloatingTextFilter,
      floatingFilter: true,
      floatingFilterComponentParams: {
        text: "TERM",
      },
      resizable: true,
      minWidth: 150,
      pinned: "left",
    },
    {
      field: "parentsString",
      headerName: "PARENTS",
      minWidth: 150,
      cellRenderer: (p) => {
        const tagsList = p.value ? p.value.split(",") : [];
        return (
          <div style={{ display: "inline-block" }}>
            <TagsGroup tags={tagsList} />
          </div>
        );
      },
      cellEditor: TagsEditField,
      floatingFilterComponent: FloatingTextFilter,
      floatingFilter: true,
      // valueGetter: (v) => v + v, (works like accessorFn)
      // valueFormatter:
    },
    {
      field: "translation",
      headerName: "TRANSLATION",
      cellRenderer: TranslationCell,
      cellEditor: TranslationEditField,
      floatingFilterComponent: FloatingTextFilter,
      floatingFilter: true,
      floatingFilterComponentParams: {
        text: "TRANSLATION",
      },
      resizable: true,
      autoHeight: true,
      minWidth: 200,
      suppressKeyboardEvent: (p) => {
        // console.log(p.event.target.style.height);
        p.node.setRowHeight(parseInt(p.event.target.style.height));
        p.api.onRowHeightChanged();
        return p.event.key === "Enter";
      },
    },
    {
      field: "tagsString",
      headerName: "TAGS",
      minWidth: 150,
      cellRenderer: (p) => {
        const tagsList = p.value ? p.value.split(",") : [];
        return <TagsGroup tags={tagsList} />;
      },
      cellEditor: TagsEditField,
    },
    {
      field: "language",
      headerName: "LANGUAGE",
      editable: false,
      maxWidth: 250,
      minWidth: 100,
      floatingFilterComponent: FloatingSelectFilter,
      floatingFilter: true,
      suppressFloatingFilterButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "statusId",
      headerName: "STATUS",
      suppressFloatingFilterButton: true,
      suppressHeaderFilterButton: true,
      cellRenderer: StatusCell,
      cellEditor: StatusEditField,
      floatingFilterComponent: FloatingRangeFilter,
      floatingFilter: true,
      minWidth: 150,
      maxSize: 200,
    },
    {
      field: "createdOn",
      headerName: "ADDED ON",
      editable: false,
      minWidth: 150,
      valueFormatter: (c) => new Date(c.value),
      cellRenderer: (c) => (
        <span>{dateFormatter.format(c.valueFormatted)}</span>
      ),
      floatingFilterComponent: FloatingDateFilter,
      floatingFilter: true,
      suppressFloatingFilterButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      colId: "action",
      editable: false,
      sortable: false,
      maxWidth: 70,
      minWidth: 70,
      cellRenderer: EditActionsCell,
      floatingFilter: false,
      suppressHeaderFilterButton: true,
    },
  ]);

  return (
    <div style={{ height: 700 }}>
      <AgGridReact
        ref={gridRef}
        // noRowsOverlayComponent={}
        // noRowsOverlayComponentParams={}
        // loadingOverlayComponent={}
        // loadingOverlayComponentParams={}
        animateRows={false}
        floatingFiltersHeight={48}
        editType="fullRow"
        pagination="true"
        paginationPageSize={25}
        paginationPageSizeSelector={[10, 25, 50, 100]}
        rowSelection={{ mode: "multiRow", checkboxLocation: "selectionColumn" }}
        defaultColDef={defaultColumnDef}
        theme={myTheme}
        rowData={rowData}
        columnDefs={colDefs}
        selectionColumnDef={selectionColumnDef}
        suppressClickEdit={true}
        onRowEditingStopped={handleRowEditingStopped}
        onRowEditingStarted={handleRowEditingStopped}
        suppressRowVirtualisation={true} // or edited row gets reset
      />
    </div>
  );
}

export default TermsGrid;

function StatusEditField(c) {
  const [value, setValue] = useState(String(c.value));
  return (
    <Box>
      <StatusRadio size="sm" value={value} onChange={setValue} />
    </Box>
  );
}

function TranslationCell(c) {
  const img = c.data.image;
  return (
    <div style={{ display: "inline-block" }}>
      <Text
        size="sm"
        component="span"
        style={{ whiteSpace: "pre-wrap", display: "inline-block" }}>
        {c.value}
      </Text>
      {img && (
        <TermImage position="right" src={`http://localhost:5001${img}`} />
      )}
    </div>
  );
}

function handleRowEditingStopped(params) {
  params.api.refreshCells({
    columns: ["action"],
    rowNodes: [params.node],
    force: true,
  });
}

function StatusCell(c) {
  const statusId = c.value;
  const label =
    statusId === 98 ? (
      <IconMinus size={16} />
    ) : statusId === 99 ? (
      <IconCheck size={16} />
    ) : (
      String(statusId)
    );

  return (
    // <Box pos="relative" left="50%" top="50%" style={{ translate: "-50% -50%" }}>
    <Badge
      fw={600}
      fullWidth
      size="md"
      // onClick={handleSetFilter}
      leftSection={label}
      style={{
        cursor: "pointer",
        translate: "-50% -50%",
        left: "50%",
        top: "50%",
        position: "relative",
      }}
      c={`var(--lute-text-color-status${c.value})`}
      bg={`var(--lute-color-highlight-status${c.value}`}>
      {status[statusId].label}
    </Badge>
    // </Box>
  );
}

function EditActionsCell(params) {
  // console.log(c);
  // const [editing, setEditing] = useState(false);
  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  // const isEditing =
  //   c.api.getEditingCells()[0] &&
  //   c.api.getEditingCells()[0].rowIndex === c.node.rowIndex;
  console.log(isCurrentRowEditing);
  return !isCurrentRowEditing ? (
    <ActionIconGroup
      style={{
        translate: "-50% -50%",
        left: "50%",
        top: "50%",
        position: "relative",
      }}>
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={() => {
          params.api.startEditingCell({
            rowIndex: params.node.rowIndex,
            colKey: "translation",
          });

          params.node.setRowHeight(200);
          params.api.onRowHeightChanged();
          // setEditing(true);
        }}>
        <IconEdit />
      </ActionIcon>
      <ActionIcon
        size="sm"
        variant="subtle"
        color="red"
        onClick={() => params.api.stopEditing()}>
        <IconTrash />
      </ActionIcon>
    </ActionIconGroup>
  ) : (
    <ActionIconGroup
      style={{
        translate: "-50% -50%",
        left: "50%",
        top: "50%",
        position: "relative",
      }}>
      <ActionIcon
        // color="red"
        size="sm"
        variant="subtle"
        onClick={() => {
          params.api.stopEditing();
          params.node.setRowHeight(null);
          // console.log(params.api);
          params.api.onRowHeightChanged();
          // params.api.refreshCells({ force: true });
          // setEditing(false);
        }}>
        <IconX />
      </ActionIcon>
      <ActionIcon
        size="sm"
        variant="subtle"
        color="green"
        onClick={() =>
          params.api.stopEditing({
            rowIndex: params.node.rowIndex,
            colKey: "translation",
          })
        }>
        <IconDeviceFloppy />
      </ActionIcon>
    </ActionIconGroup>
  );
}

function FloatingRangeFilter() {
  return (
    <RangeSlider
      flex={1}
      minRange={0}
      min={0}
      max={7}
      step={1}
      showLabelOnHover={false}
      label={(val) => status[val].label}
      marks={[
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
      ]}
      defaultValue={[0, 6]}
    />
  );
}

function FloatingTextFilter() {
  // console.log(c);
  const [value, setValue] = useState("");
  return (
    <TextInput
      // variant="unstyled"
      // placeholder={`Filter by ${c.text}`}
      // radius={0}
      inputWrapperOrder={["label", "input", "description", "error"]}
      // sty
      // description="Filter Mode: Contains"
      rightSection={value && <InputClearButton onClick={() => setValue("")} />}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      size="xs"
      // styles={{ root: { display: "flex", alignItems: "center" } }}
      styles={
        {
          // root: { marginBlock: "10px" },
          // input: { borderBottom: "2px solid var(--mantine-color-gray-7)" },
        }
      }
    />
  );
}

function TranslationEditField(p) {
  return (
    <Textarea
      minRows={2}
      autosize
      defaultValue={p.value}
      // mah={200}
      maxRows={6}
    />
  );
}

function TagsEditField(p) {
  return <TagsInput defaultValue={p.value?.split(",")} />;
}

function FloatingSelectFilter() {
  const { data: initial } = useQuery(initialQuery);
  const [activeLang, setActiveLang] = useState("");

  const langFieldRSection = activeLang ? (
    <InputClearButton onClick={() => setActiveLang(null)} />
  ) : (
    <IconSelector size={16} />
  );

  return (
    <Select
      size="xs"
      value={activeLang}
      onChange={setActiveLang}
      // placeholder="All languages"
      allowDeselect={false}
      data={initial.languageChoices.map((language) => language.name)}
      rightSection={langFieldRSection}
      rightSectionPointerEvents={activeLang ? "initial" : "none"}
    />
  );
}

function FloatingDateFilter() {
  const [value, setValue] = useState([null, null]);
  return (
    // <Tooltip
    //   label={value
    //     .map((v) => v.toDateString().split(" ").slice(1).join(" "))
    //     .join(" - ")}>
    <DatePickerInput
      valueFormat="DD MMM YYYY"
      size="xs"
      styles={{ input: { overflow: "hidden", textOverflow: "ellipsis" } }}
      maw="100%"
      w={200}
      type="range"
      // placeholder="Pick dates range"
      value={value}
      onChange={setValue}
      clearable
    />
    // {/* </Tooltip> */}
  );
}

function TermCell(c) {
  return (
    <Button
      maw={290}
      variant="subtle"
      size="compact-sm"
      component={Link}
      to={`/terms/term?termId=${c.data.id}&langId=${c.data.languageId}`}
      style={{ color: "inherit", textDecoration: "none" }}>
      <Text size="sm" lineClamp={1} truncate>
        {c.value}
      </Text>
    </Button>
  );
}
