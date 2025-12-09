import { useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Stepper, Button, Group } from "@mantine/core";
import { IconBook2, IconFileSettings, IconLanguage } from "@tabler/icons-react";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { StepCompleted } from "./steps/StepCompleted";
import { BookCreatedModal } from "./components/BookCreatedModal";
import { query as bookQuery } from "#book/api/query";
import { mutation } from "#book/api/mutation";
import { createBookFormSchema } from "#book/api/schemas";
import type { CreateBookForm } from "#book/api/types";
import classes from "./CreateBookForm.module.css";

const route = getRouteApi("/create-book");

const fieldsByStep: Array<keyof CreateBookForm>[] = [
  ["language_id"],
  ["title", "text"],
  [
    "audio_file",
    "threshold_page_tokens",
    "split_by",
    "source_uri",
    "book_tags",
  ],
];

export function CreateBookForm() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const { langId } = route.useSearch();
  const navigate = route.useNavigate();
  const [active, setActive] = useState(0);
  const {
    mutate,
    isSuccess,
    isPending,
    data,
    reset: resetMutation,
  } = mutation.useCreateBook();

  const { data: formValues } = useSuspenseQuery(bookQuery.bookForm());
  const methods = useForm({
    defaultValues: {
      ...formValues,
      language_id: langId !== undefined ? langId : -1,
    },
    resolver: zodResolver(createBookFormSchema),
    mode: "onBlur",
  });
  const { reset: resetForm, handleSubmit, trigger, clearErrors } = methods;
  const currentFields = fieldsByStep[active];

  async function goToNextStep() {
    const valid = await trigger(currentFields);
    if (valid) {
      setActive((step) => (step < 3 ? step + 1 : step));
    }
  }

  function goToPrevStep() {
    setActive((step) => (step > 0 ? step - 1 : step));
    clearErrors(currentFields);
  }

  function handleResetForm() {
    setActive(0);
    resetForm();
    navigate({ search: (prev) => ({ ...prev, langId: undefined }) });
  }

  return (
    <>
      <form
        id="create-book-form"
        onSubmit={handleSubmit((data) =>
          mutate(data, { onSuccess: handleResetForm })
        )}>
        <FormProvider {...methods}>
          <Stepper
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
            styles={{ content: { paddingTop: 32 } }}
            classNames={{ stepLabel: classes.label, stepIcon: classes.icon }}>
            <Stepper.Step label={t("step1Label")} icon={<IconLanguage />}>
              <Step1 />
            </Stepper.Step>
            <Stepper.Step label={t("step2Label")} icon={<IconBook2 />}>
              <Step2 />
            </Stepper.Step>
            <Stepper.Step label={t("step3Label")} icon={<IconFileSettings />}>
              <Step3 />
            </Stepper.Step>
            <Stepper.Completed>
              <StepCompleted />
            </Stepper.Completed>
          </Stepper>
        </FormProvider>
      </form>

      <Group justify="center" mt="xl" gap={5}>
        {active <= 3 && (
          <Button variant="default" onClick={goToPrevStep} disabled={isSuccess}>
            {t("backButtonLabel")}
          </Button>
        )}
        {active === 3 && (
          <Button
            form="create-book-form"
            type="submit"
            color="green"
            loading={isPending}
            disabled={isSuccess}>
            Create
          </Button>
        )}
        {active < 3 && (
          <Button
            onClick={goToNextStep}
            color={active === 2 ? "orange.6" : undefined}>
            {t(active === 2 ? "reviewButtonLabel" : "nextStepButtonLabel")}
          </Button>
        )}
      </Group>

      <BookCreatedModal
        opened={isSuccess}
        book={data}
        onClose={resetMutation}
      />
    </>
  );
}
