import { useState, type KeyboardEvent, type RefObject } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Group, rem, Collapse, InputClearButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ParentTagsField } from "./components/ParentTagsField/ParentTagsField";
import { TranslationField } from "./components/TranslationField/TranslationField";
import { TermField } from "./components/TermField/TermField";
import { TermTagsField } from "./components/TermTagsField/TermTagsField";
import { NotesField } from "./components/NotesField/NotesField";
import { SyncStatusCheckbox } from "./components/SyncStatusCheckbox/SyncStatusCheckbox";
import { PronunciationField } from "./components/PronunciationField/PronunciationField";
import { LoadDictsButton } from "./components/LoadDictsButton";
import { ToLowerCaseButton } from "./components/ToLowerCaseButton";
import { PronunciationButton } from "./components/PronunciationButton";
import { NotesButton } from "./components/NotesButton";
import { TermImagePopover } from "../TermImagePopover/TermImagePopover";
import { FormButtons } from "#common/FormButtons/FormButtons";
import { StatusRadio } from "../StatusRadio/StatusRadio";
import { deleteTermConfirm } from "#resources/modals";
import { query } from "#term/api/query";
import type { TermDetail } from "#term/api/types";
import { mutation } from "#term/api/mutation";
import classes from "./TermForm.module.css";

interface TermForm {
  term?: TermDetail;
  translationFieldRef?: RefObject<HTMLTextAreaElement>;
  onSetTermText?: (text: string) => void;
  onSubmitSuccess?: () => void;
  showPronunciation?: boolean;
  showNotes?: boolean;
}

const initialValues: TermDetail = {
  id: null,
  originalText: "",
  text: "",
  textLC: "",
  parents: [],
  romanization: "",
  notes: "",
  status: 1,
  syncStatus: false,
  termTags: [],
  translation: "",
  currentImg: null,
};

export function TermForm({
  term,
  showPronunciation = true,
  showNotes = true,
  translationFieldRef,
  onSetTermText,
  onSubmitSuccess,
}: TermForm) {
  const { textDir } = useSearch({ strict: false });
  const createTermMutation = mutation.useCreateTerm();
  const editTermMutation = mutation.useEditTerm();
  const deleteTermMutation = mutation.useDeleteTerm();

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    handleSubmit: handleFormSubmit,
  } = useForm<TermDetail>({ defaultValues: term ?? initialValues });

  const hasText = !!watch("text");
  const numOfParents = watch("parents", []).length;

  const { data: tags } = useQuery(query.tagSuggestions());

  const editMode = !!(term && term.id !== null);
  const prefilledMode = !!(term && term.id === null && term.originalText);
  const termImage = getValues().currentImg;

  const [notesOpened, setNotesOpened] = useState(showNotes);
  const [pronunciationOpened, setPronunciationOpened] =
    useState(showPronunciation);

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
    console.log(parent);
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

  function handleKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement | HTMLFormElement;

    if (e.key === "Enter" && target.type !== "submit") {
      if (target.type !== "textarea") {
        e.preventDefault();
      }
      if (e.ctrlKey) {
        if (target instanceof HTMLFormElement) {
          target.requestSubmit();
        }
      }
    }
  }

  function handleSubmit(data: TermDetail) {
    if (editMode) {
      editTerm(term.id!, data);
    } else {
      createTerm(data);
    }
  }

  function createTerm(data: TermDetail) {
    createTermMutation.mutate(data, {
      onSuccess: () => {
        if (prefilledMode) {
          reset();
        }
        onSubmitSuccess?.();
      },
    });
  }

  function editTerm(id: number, data: TermDetail) {
    editTermMutation.mutate(
      { data, id },
      {
        onSuccess: () => {
          onSubmitSuccess?.();
        },
      }
    );
  }

  function handleDeleteTerm() {
    modals.openConfirmModal(
      deleteTermConfirm(term!.text, () =>
        deleteTermMutation.mutate(term!.id!, {
          onSuccess: () => {
            onSubmitSuccess?.();
          },
        })
      )
    );
  }

  function handleToLowerCase() {
    setValue("text", getValues().text.toLowerCase());
  }

  return (
    <form onSubmit={handleFormSubmit(handleSubmit)} onKeyDown={handleKeydown}>
      <div className={`${classes.termBox} ${classes.fieldBox}`}>
        <TermField
          control={control}
          readOnly={editMode}
          variant={editMode ? "filled" : "default"}
          wrapperProps={{ dir: textDir }}
          rightSection={
            <ToLowerCaseButton
              disabled={!hasText}
              onClick={handleToLowerCase}
            />
          }
        />
        {!prefilledMode && !editMode && (
          <LoadDictsButton
            disabled={!hasText}
            onClick={() => onSetTermText?.(getValues().text)}
          />
        )}
        {editMode && (
          <>
            <PronunciationButton
              onClick={() => setPronunciationOpened((v) => !v)}
              variant={pronunciationOpened ? "light" : "subtle"}
            />
            <NotesButton
              onClick={() => setNotesOpened((v) => !v)}
              variant={notesOpened ? "light" : "subtle"}
            />
          </>
        )}
      </div>
      <ParentTagsField
        control={control}
        termText={getValues().originalText}
        onOptionSubmit={handleParentSubmit}
        onTagClick={handleParentClick}
      />
      <Collapse in={pronunciationOpened}>
        <PronunciationField control={control} />
      </Collapse>
      <div className={`${classes.translationBox} ${classes.fieldBox}`}>
        <TranslationField
          control={control}
          wrapperProps={{ dir: textDir }}
          inputRef={translationFieldRef}
        />
        {termImage && <TermImagePopover imageName={termImage} />}
      </div>
      <Collapse in={notesOpened}>
        <NotesField control={control} disabled />
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
