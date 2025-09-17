import { useState, type RefObject } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Group, rem, Collapse, InputClearButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconBubbleText,
  IconLanguage,
  IconNote,
  IconSitemap,
  IconSpeakerphone,
  IconTags,
} from "@tabler/icons-react";
import { TextInput } from "../../../../components/common/TextInput/TextInput";
import { Checkbox } from "../../../../components/common/Checkbox/Checkbox";
import { TagsInput } from "../../../../components/common/TagsInput/TagsInput";
import { Textarea } from "../../../../components/common/Textarea/Textarea";
import { StatusRadio } from "../StatusRadio/StatusRadio";
import { TagsField } from "./components/TagsField/TagsField";
import { FormButtons } from "../../../../components/common/FormButtons/FormButtons";
import { LoadDictsButton } from "./components/LoadDictsButton";
import { ToLowerCaseButton } from "./components/ToLowerCaseButton";
import { PronunciationButton } from "./components/PronunciationButton";
import { NotesButton } from "./components/NotesButton";
import { TermImage } from "../TermImage/TermImage";
import { moveCursorToEnd } from "../../../../utils/utils";
import { editTerm, createTerm, deleteTerm } from "../../api/api";
import { deleteTermConfirm } from "../../../../resources/modals";
import {
  termCreated,
  termUpdated,
  termDeleted,
} from "../../resources/notifications";
import { useActiveTermContext } from "../../hooks/useActiveTermContext";
import { queries as bookQueries } from "../../../book/api/queries";
import { queries as termQueries } from "../../api/queries";
import type { TermDetail } from "../../api/types";
import type { UserLanguageDetail } from "../../../language/api/types";
import classes from "./TermForm.module.css";

interface TermForm {
  term?: TermDetail;
  language?: UserLanguageDetail;
  translationFieldRef?: RefObject<HTMLTextAreaElement>;
  onSetTerm?: (text: string) => void;
}

export function TermForm({
  term,
  language,
  translationFieldRef,
  onSetTerm, // typed text in the term field
}: TermForm) {
  const queryClient = useQueryClient();
  const { id: bookId } = useParams();

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    handleSubmit: handleFormSubmit,
  } = useForm({
    defaultValues: term,
  });

  const hasText = !!watch("text");
  const numOfParents = watch("parents", []).length;

  const { setActiveTerm } = useActiveTermContext();
  const { data: tags } = useQuery(termQueries.tagSuggestions());

  const editMode = term.id !== null;
  const blankMode = !term.text;
  const dir = language.right_to_left ? "rtl" : "ltr";

  const [notesOpened, setNotesOpened] = useState(blankMode);
  const [pronunciationOpened, setPronunciationOpened] = useState(
    blankMode ? true : language.show_romanization
  );

  function handleParentSubmit(val: string) {
    const obj = JSON.parse(val);

    const parents = [...getValues().parents, obj.value];
    const hasSingleParent = parents.length === 1;

    if (hasSingleParent) {
      setValue("status", obj.status);
    }
    setValue("syncStatus", hasSingleParent);
    setValue("parents", parents);
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
    setValue("text", getValues().text.toLowerCase());
  }

  const createTermMutation = useMutation({
    mutationFn: createTerm,
    onSuccess: () => {
      notifications.show(editMode ? termUpdated : termCreated);
      if (blankMode) {
        reset();
      }
      if (!blankMode && bookId) {
        setActiveTerm({ data: null });
        queryClient.invalidateQueries({
          queryKey: bookQueries.bookPages(Number(bookId)),
        });
      }
    },
  });

  const editTermMutation = useMutation({
    mutationFn: editTerm,
    onSuccess: () => {
      notifications.show(termUpdated);
      if (bookId) {
        setActiveTerm({ data: null });
        queryClient.invalidateQueries({
          queryKey: bookQueries.bookPages(Number(bookId)),
        });
      }
    },
  });

  const deleteTermMutation = useMutation({
    mutationFn: deleteTerm,
    onSuccess: () => {
      notifications.show(termDeleted);
      if (bookId) {
        setActiveTerm({ data: null });
        queryClient.invalidateQueries({
          queryKey: bookQueries.bookPages(Number(bookId)),
        });
      }
    },
  });

  return (
    <form onSubmit={handleFormSubmit(handleSubmit)} onKeyDown={handleKeydown}>
      <div className={`${classes.termBox} ${classes.fieldBox}`}>
        <TextInput
          name="text"
          control={control}
          readOnly={editMode}
          variant={editMode ? "filled" : "default"}
          wrapperProps={{ dir: dir }}
          placeholder="Term"
          flex={1}
          rightSection={
            <ToLowerCaseButton enabled={hasText} onClick={handleToLowerCase} />
          }
          leftSection={<IconBubbleText size={20} />}
          leftSectionProps={{ className: classes.leftSection }}
        />
        {blankMode && (
          <LoadDictsButton
            disabled={!hasText}
            onClick={() => onSetTerm?.(getValues().text)}
          />
        )}
        {!blankMode && (
          <>
            <PronunciationButton
              onToggle={() => setPronunciationOpened((v) => !v)}
              active={pronunciationOpened}
            />
            <NotesButton
              onToggle={() => setNotesOpened((v) => !v)}
              active={notesOpened}
            />
          </>
        )}
      </div>
      <TagsField
        termText={getValues().originalText}
        values={getValues().parents || []}
        onSetValues={(parents) => setValue("parents", parents)}
        onSubmitParent={handleParentSubmit}
        languageId={language.id}
        leftSection={<IconSitemap size={20} />}
        leftSectionProps={{ className: classes.leftSection }}
        mb={5}
      />
      <Collapse in={pronunciationOpened}>
        <TextInput
          name="romanization"
          control={control}
          mb={5}
          placeholder="Pronunciation"
          leftSection={<IconSpeakerphone size={20} />}
          leftSectionProps={{ className: classes.leftSection }}
        />
      </Collapse>
      <div className={`${classes.translationBox} ${classes.fieldBox}`}>
        <Textarea
          name="translation"
          control={control}
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
          leftSection={<IconLanguage size={20} />}
          leftSectionProps={{ className: classes.leftSection }}
        />
        {getValues().currentImg && (
          <TermImage src={`http://localhost:5001${getValues().currentImg}`} />
        )}
      </div>
      <Collapse in={notesOpened}>
        <Textarea
          name="notes"
          control={control}
          resize="vertical"
          placeholder="Notes"
          autosize
          spellCheck={false}
          autoCapitalize="off"
          minRows={3}
          mb={5}
          leftSection={<IconNote size={20} />}
          leftSectionProps={{ className: classes.leftSection }}
        />
      </Collapse>
      <Group dir="ltr" gap="md" style={{ rowGap: rem(7) }} mb={5}>
        <Controller
          name="status"
          control={control}
          render={({ field: { value, ...field } }) => (
            <StatusRadio {...field} value={String(value)} />
          )}
        />
        <Checkbox
          name="syncStatus"
          control={control}
          styles={{ label: { paddingInlineStart: rem(5) } }}
          size="xs"
          label="Link to parent"
          disabled={numOfParents !== 1}
        />
      </Group>
      <TagsInput
        name="termTags"
        control={control}
        data={tags || []}
        placeholder="Tags"
        maxDropdownHeight={200}
        mb={5}
        leftSection={<IconTags size={20} />}
        leftSectionProps={{ className: classes.leftSection }}
        rightSection={
          <InputClearButton onClick={() => setValue("termTags", [])} />
        }
      />

      <FormButtons
        okDisabled={!hasText}
        discardLabel={editMode ? "Delete" : undefined}
        discardCallback={() =>
          modals.openConfirmModal(
            deleteTermConfirm(term.text, () =>
              deleteTermMutation.mutate(term.id)
            )
          )
        }
      />
    </form>
  );
}
