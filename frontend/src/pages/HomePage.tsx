import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@mantine/core";
import { BooksTable } from "#book/components/BooksTable/BooksTable";
import { BooksGrid } from "#book/components/BooksGrid/BooksGrid";
import { PageTitle } from "#common/PageTitle/PageTitle";
import { PageContainer } from "#common/PageContainer/PageContainer";
import { DemoNotice } from "#components/DemoNotice/DemoNotice";
import { WelcomeAlert } from "#components/WelcomeAlert/WelcomeAlert";
import { useMediaQuery } from "#hooks/useMediaQuery";
import { queries } from "#settings/api/queries";

export function HomePage() {
  const media = useMediaQuery();
  const { data: initial } = useSuspenseQuery(queries.init());
  return (
    <>
      {/* after user wipes off or deactivates demo mode tutorialBookId is set to null */}
      {initial.tutorialBookId && (
        <Box px={20} pb={10}>
          <DemoNotice tutorialBookId={initial.tutorialBookId} />
        </Box>
      )}

      {!initial.haveLanguages && <WelcomeAlert />}

      {initial.haveBooks && (
        <PageContainer>
          <PageTitle>Books</PageTitle>
          {!media || media === "desktop" ? <BooksTable /> : <BooksGrid />}
        </PageContainer>
      )}
    </>
  );
}
