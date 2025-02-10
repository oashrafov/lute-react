import { memo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Group,
  TextInput,
  Textarea,
  TagsInput,
  Checkbox,
  rem,
  Collapse,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import StatusRadio from "../StatusRadio/StatusRadio";
import TagsField from "./components/TagsField";
import FormButtons from "@common/FormButtons/FormButtons";
import LoadDictsButton from "./components/LoadDictsButton";
import ToLowerCaseButton from "./components/ToLowerCaseButton";
import PronunciationButton from "./components/PronunciationButton";
import NotesButton from "./components/NotesButton";
import TermImage from "../TermImage/TermImage";
import useTermForm from "./hooks/useTermForm";
import { moveCursorToEnd } from "@actions/utils";
import { getTagSuggestionsQuery } from "../../api/query";
import { editTerm, createTerm, deleteTerm } from "../../api/api";
import { deleteTermConfirm } from "@resources/modals";
import {
  termCreated,
  termUpdated,
  termDeleted,
} from "@term/resources/notifications";
import classes from "./TermForm.module.css";

const termBlank = {
  id: null,
  text: "",
  textLC: "",
  originalText: "",
  status: "1",
  translation: "",
  romanization: "",
  syncStatus: false,
  termTags: [],
  parents: [],
  // "currentImg": term.current_image,
};

const languageBlank = { id: 0, right_to_left: false, show_romanization: true };

function TermForm({
  term = termBlank,
  language = languageBlank,
  translationFieldRef = {},
  onSetActiveTerm = null, // selected word data from page text
  onSetTerm = null, // typed text in the term field
}) {
  const form = useTermForm(term, language);
  const { data: tags } = useQuery(getTagSuggestionsQuery);
  const queryClient = useQueryClient();

  const editMode = term.id !== null;
  const blankMode = !term.text;
  const { id: bookId } = useParams();
  const dir = language.right_to_left ? "rtl" : "ltr";

  const [notesOpened, setNotesOpened] = useState(blankMode);
  const [pronunciationOpened, setPronunciationOpened] = useState(
    !blankMode ? language.show_romanization : true
  );

  function handleParentSubmit(val) {
    const obj = JSON.parse(val);

    const parents = [...form.getValues().parents, obj.value];
    const hasSingleParent = parents.length === 1;

    if (hasSingleParent) {
      form.setFieldValue("status", String(obj.status));
    }
    form.setFieldValue("syncStatus", hasSingleParent);
    form.setFieldValue("parents", parents);
  }

  function handleKeydown(e) {
    const isTextarea = e.target.type === "textarea";
    const isSubmitButton = e.target.type === "submit";
    const enterPressed = e.key === "Enter";
    const ctrlPressed = e.ctrlKey;

    if (enterPressed && !isTextarea && !isSubmitButton) {
      e.preventDefault();
    }
    if (enterPressed && ctrlPressed && !isSubmitButton) {
      e.currentTarget.requestSubmit();
    }
  }

  function handleSubmit(data) {
    if (!editMode) {
      createTermMutation.mutate(data);
    } else {
      editTermMutation.mutate({ ...data, id: term.id });
    }
  }

  function handleToLowerCase() {
    form.setFieldValue("text", form.getValues().text.toLowerCase());
  }

  const createTermMutation = useMutation({
    mutationFn: createTerm,
    onSuccess: () => {
      notifications.show(editMode ? termUpdated : termCreated);
      blankMode && form.reset();
      !blankMode && bookId && onSetActiveTerm({ data: null });
      !blankMode && bookId && queryClient.invalidateQueries(["page", bookId]);
    },
  });

  const editTermMutation = useMutation({
    mutationFn: editTerm,
    onSuccess: () => {
      notifications.show(termUpdated);
      bookId && onSetActiveTerm({ data: null });
      bookId && queryClient.invalidateQueries(["page", bookId]);
    },
  });

  const deleteTermMutation = useMutation({
    mutationFn: deleteTerm,
    onSuccess: () => {
      notifications.show(termDeleted);
      bookId && onSetActiveTerm({ data: null });
      bookId && queryClient.invalidateQueries(["page", bookId]);
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} onKeyDown={handleKeydown}>
      <div className={classes.container}>
        <Group gap={4} flex={1}>
          <TextInput
            readOnly={editMode}
            wrapperProps={{ dir: dir }}
            placeholder="Term"
            withAsterisk
            flex={1}
            rightSection={
              blankMode && (
                <LoadDictsButton
                  enabled={form.getValues().text}
                  onClick={() => onSetTerm(form.getValues().text)}
                />
              )
            }
            rightSectionWidth={50}
            key={form.key("text")}
            {...form.getInputProps("text")}
          />
          {!blankMode && (
            <>
              <ToLowerCaseButton onClick={handleToLowerCase} />
              <PronunciationButton
                onToggle={() => setPronunciationOpened((v) => !v)}
              />
              <NotesButton onToggle={() => setNotesOpened((v) => !v)} />
            </>
          )}
        </Group>
        <TagsField
          termText={form.getValues().originalText}
          values={form.getValues().parents || []}
          onSetValues={(parents) => form.setFieldValue("parents", parents)}
          onSubmitParent={handleParentSubmit}
          onSetActiveTerm={onSetActiveTerm}
          languageId={language.id}
        />
        <Collapse in={pronunciationOpened}>
          <TextInput
            placeholder="Pronunciation"
            key={form.key("romanization")}
            {...form.getInputProps("romanization")}
          />
        </Collapse>
        <div className={classes.flex}>
          <Textarea
            wrapperProps={{ dir: dir }}
            placeholder="Translation"
            resize="vertical"
            flex={1}
            ref={translationFieldRef}
            onFocusCapture={moveCursorToEnd}
            minRows={2}
            autosize
            spellCheck={false}
            autoCapitalize="off"
            autoFocus
            key={form.key("translation")}
            {...form.getInputProps("translation")}
          />
          {form.getValues().currentImg && (
            <TermImage
              src={`http://localhost:5001${form.getValues().currentImg}`}
            />
          )}
        </div>
        <Collapse in={notesOpened}>
          <Textarea
            resize="vertical"
            placeholder="Notes"
            autosize
            spellCheck={false}
            autoCapitalize="off"
            minRows={3}
          />
        </Collapse>
        <Group dir="ltr" gap="md" style={{ rowGap: rem(7) }}>
          <StatusRadio form={form} />
          <Checkbox
            styles={{ label: { paddingInlineStart: rem(5) } }}
            size="xs"
            label="Link to parent"
            key={form.key("syncStatus")}
            {...form.getInputProps("syncStatus", { type: "checkbox" })}
          />
        </Group>
        <TagsInput
          clearable
          data={tags || []}
          placeholder="Tags"
          maxDropdownHeight={200}
          key={form.key("termTags")}
          {...form.getInputProps("termTags")}
        />

        <FormButtons
          okDisabled={!form.getValues().text}
          discardLabel={editMode ? "Delete" : null}
          discardCallback={() =>
            modals.openConfirmModal(
              deleteTermConfirm(term.text, () =>
                deleteTermMutation.mutate(term.id)
              )
            )
          }
        />
      </div>
    </form>
  );
}

export default memo(TermForm);
