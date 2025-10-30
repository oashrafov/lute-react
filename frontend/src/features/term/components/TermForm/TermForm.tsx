import { useState, type KeyboardEvent, type RefObject } from "react";
import { useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Group, rem, Collapse, InputClearButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconSitemap } from "@tabler/icons-react";
import { StatusRadio } from "../StatusRadio/StatusRadio";
import { TagsField } from "./components/TagsField/TagsField";
import { FormButtons } from "../../../../components/common/FormButtons/FormButtons";
import { LoadDictsButton } from "./components/LoadDictsButton";
import { ToLowerCaseButton } from "./components/ToLowerCaseButton";
import { PronunciationButton } from "./components/PronunciationButton";
import { NotesButton } from "./components/NotesButton";
import { TermImage } from "../TermImage/TermImage";
import { editTerm, createTerm, deleteTerm } from "../../api/api";
import { deleteTermConfirm } from "../../../../resources/modals";
import {
  termCreated,
  termUpdated,
  termDeleted,
} from "../../resources/notifications";
import { queries as bookQueries } from "../../../book/api/queries";
import { queries as termQueries } from "../../api/queries";
import type { TermDetail } from "../../api/types";
import type { UserLanguageDetail } from "../../../language/api/types";
import { TranslationField } from "./components/TranslationField/TranslationField";
import { TermField } from "./components/TermField/TermField";
import { TermTagsField } from "./components/TermTagsField/TermTagsField";
import { NotesField } from "./components/NotesField/NotesField";
import { SyncStatusCheckbox } from "./components/SyncStatusCheckbox/SyncStatusCheckbox";
import { PronunciationField } from "./components/PronunciationField/PronunciationField";
import classes from "./TermForm.module.css";

interface TermForm {
  term?: TermDetail;
  language?: UserLanguageDetail;
  translationFieldRef?: RefObject<HTMLTextAreaElement>;
  onSetTerm?: (text: string) => void;
  onAction?: () => void;
}

export function TermForm({
  term,
  language,
  translationFieldRef,
  onSetTerm, // typed text in the term field
  onAction,
}: TermForm) {
  const queryClient = useQueryClient();
  const { bookId } = useParams({ strict: false });

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

  const { data: tags } = useQuery(termQueries.tagSuggestions());

  const editMode = !!term;
  const blankMode = !term?.text;
  const dir = language.right_to_left ? "rtl" : "ltr";
  const termImage = getValues().currentImg;

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

  function handleParentClick(parent: string) {
    // setActiveTerm(
    //   {
    //     data: parent,
    //     langId: language.id,
    //     type: "multi",
    //     textitems: [],
    //   },
    //   false
    // );
  }

  function handleClearTags() {
    setValue("termTags", []);
  }

  function handleDeleteTerm() {
    modals.openConfirmModal(
      deleteTermConfirm(term.text, () => deleteTermMutation.mutate(term.id))
    );
  }

  function handleKeydown(e: KeyboardEvent) {
    const target = e.target;
    const isTextarea = target.type === "textarea";
    const isSubmitButton = target.type === "submit";
    const enterPressed = e.key === "Enter";
    const ctrlPressed = e.ctrlKey;

    if (enterPressed && !isTextarea && !isSubmitButton) {
      e.preventDefault();
    }
    if (enterPressed && ctrlPressed && !isSubmitButton) {
      target.requestSubmit();
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
        onAction?.();
        queryClient.invalidateQueries({
          queryKey: bookQueries.bookPages(bookId),
        });
      }
    },
  });

  const editTermMutation = useMutation({
    mutationFn: editTerm,
    onSuccess: () => {
      notifications.show(termUpdated);
      if (bookId) {
        onAction?.();
        queryClient.invalidateQueries({
          queryKey: bookQueries.bookPages(bookId),
        });
      }
    },
  });

  const deleteTermMutation = useMutation({
    mutationFn: deleteTerm,
    onSuccess: () => {
      notifications.show(termDeleted);
      if (bookId) {
        onAction?.();
        queryClient.invalidateQueries({
          queryKey: bookQueries.bookPages(bookId),
        });
      }
    },
  });

  return (
    <form onSubmit={handleFormSubmit(handleSubmit)} onKeyDown={handleKeydown}>
      <div className={`${classes.termBox} ${classes.fieldBox}`}>
        <TermField
          control={control}
          readOnly={editMode}
          variant={editMode ? "filled" : "default"}
          textDirection={dir}
          rightSection={
            <ToLowerCaseButton
              disabled={!hasText}
              onClick={handleToLowerCase}
            />
          }
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
        placeholder="Parents"
        termText={getValues().originalText}
        values={getValues().parents || []}
        onSetValues={(parents) => setValue("parents", parents)}
        onOptionSubmit={handleParentSubmit}
        onTagClick={handleParentClick}
        languageId={language.id}
        leftSection={<IconSitemap size={20} />}
        leftSectionProps={{ className: classes.leftSection }}
        mb={5}
      />
      <Collapse in={pronunciationOpened}>
        <PronunciationField control={control} />
      </Collapse>
      <div className={`${classes.translationBox} ${classes.fieldBox}`}>
        <TranslationField
          control={control}
          textDirection={dir}
          inputRef={translationFieldRef}
        />
        {termImage && <TermImage src={`http://localhost:5001${termImage}`} />}
      </div>
      <Collapse in={notesOpened}>
        <NotesField control={control} />
      </Collapse>
      <Group dir="ltr" gap="md" style={{ rowGap: rem(7) }} mb={5}>
        <Controller
          name="status"
          control={control}
          render={({ field: { value, ref, ...field } }) => (
            <StatusRadio {...field} value={String(value)} />
          )}
        />
        <SyncStatusCheckbox control={control} disabled={numOfParents !== 1} />
      </Group>
      <TermTagsField
        control={control}
        data={tags || []}
        rightSection={<InputClearButton onClick={handleClearTags} />}
      />

      <FormButtons
        okDisabled={!hasText}
        discardLabel={editMode ? "Delete" : undefined}
        discardCallback={handleDeleteTerm}
      />
    </form>
  );
}
