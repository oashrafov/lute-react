import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@mantine/core";
import { BooksTable } from "../features/book/components/BooksTable/BooksTable";
import { BooksGrid } from "../features/book/components/BooksGrid/BooksGrid";
import { PageTitle } from "../components/common/PageTitle/PageTitle";
import { PageContainer } from "../components/common/PageContainer/PageContainer";
import { DemoNotice } from "../components/DemoNotice/DemoNotice";
import { WelcomeModal } from "../components/Modals/WelcomeModal";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { queries } from "../features/settings/api/queries";

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

      <WelcomeModal opened={!initial.haveLanguages} onClose={() => {}} />

      {initial.haveBooks && (
        <PageContainer>
          <PageTitle>Books</PageTitle>
          {media === "desktop" ? <BooksTable /> : <BooksGrid />}
        </PageContainer>
      )}
    </>
  );
}
