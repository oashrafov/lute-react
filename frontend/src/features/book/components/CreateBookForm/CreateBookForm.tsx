import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Stepper, Button, Group } from "@mantine/core";
import { IconBook2, IconFileSettings, IconLanguage } from "@tabler/icons-react";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { StepCompleted } from "./steps/StepCompleted";
import { BookCreatedModal } from "./components/BookCreatedModal";
import type { CreateBookForm } from "#book/api/types";
import { useCreateBookForm } from "./useCreateBookForm";
import classes from "./CreateBookForm.module.css";

const fieldsByStep: Array<keyof CreateBookForm>[] = [
  ["languageId"],
  ["title", "text"],
  ["audioFile", "wordsPerPage", "splitBy", "source", "tags"],
];

export function CreateBookForm() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const [currentStep, setCurrentStep] = useState(0);
  const {
    methods,
    onSubmit,
    createBookMutation: { isSuccess, isPending, data, reset: resetMutation },
  } = useCreateBookForm(() => setCurrentStep(0));
  const currentFields = fieldsByStep[currentStep];

  async function goToNextStep() {
    const valid = await methods.trigger(currentFields);
    if (valid) {
      setCurrentStep((step) => (step < 3 ? step + 1 : step));
    }
  }

  function goToPrevStep() {
    setCurrentStep((step) => (step > 0 ? step - 1 : step));
    methods.clearErrors(currentFields);
  }

  return (
    <>
      <form id="create-book-form" onSubmit={onSubmit}>
        <FormProvider {...methods}>
          <Stepper
            active={currentStep}
            onStepClick={setCurrentStep}
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
        {currentStep <= 3 && (
          <Button variant="default" onClick={goToPrevStep} disabled={isSuccess}>
            {t("backButtonLabel")}
          </Button>
        )}
        {currentStep === 3 && (
          <Button
            form="create-book-form"
            type="submit"
            color="green"
            loading={isPending}
            disabled={isSuccess}>
            Create
          </Button>
        )}
        {currentStep < 3 && (
          <Button
            onClick={goToNextStep}
            color={currentStep === 2 ? "orange.6" : undefined}>
            {t(currentStep === 2 ? "reviewButtonLabel" : "nextStepButtonLabel")}
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
