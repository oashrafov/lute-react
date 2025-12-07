import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Stepper, Button, Group } from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconBook2,
  IconLanguage,
} from "@tabler/icons-react";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { StepCompleted } from "./steps/StepCompleted";
import { BookCreatedModal } from "./components/BookCreatedModal";
import { query as bookQuery } from "#book/api/query";
import { mutation } from "#book/api/mutation";
import classes from "./CreateBookForm.module.css";

export function CreateBookForm() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const { langId } = useSearch({ from: "/create-book" });
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
    defaultValues: { ...formValues, language_id: String(langId) },
  });
  const { reset: resetForm, handleSubmit } = methods;

  function goToNextStep() {
    setActive((step) => (step < 3 ? step + 1 : step));
  }

  function goToPrevStep() {
    setActive((step) => (step > 0 ? step - 1 : step));
  }

  function handleResetForm() {
    setActive(0);
    resetMutation();
    resetForm();
  }

  return (
    <>
      <form
        id="create-book-form"
        onSubmit={handleSubmit((data) => mutate(data))}>
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
            <Stepper.Step
              label={t("step3Label")}
              icon={<IconAdjustmentsHorizontal />}>
              <Step3 />
            </Stepper.Step>
            <Stepper.Completed>
              <StepCompleted />
            </Stepper.Completed>
          </Stepper>
        </FormProvider>
      </form>

      <BookCreatedModal
        opened={isSuccess}
        book={{ id: data?.id }}
        onClose={handleResetForm}
      />

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
    </>
  );
}
