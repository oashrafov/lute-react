import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box } from "@mantine/core";
import BooksTable from "../../features/book/components/BooksTable/BooksTable";
import { BooksGrid } from "../../features/book/components/BooksGrid/BooksGrid";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { DemoNotice } from "../../components/DemoNotice/DemoNotice";
import { WelcomeModal } from "../../components/Modals/WelcomeModal";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useApplyHighlightTypes } from "../../features/book/components/TheTextContainer/hooks/useApplyHighlightTypes";
import { queries } from "../../features/settings/api/queries";

export default function HomePage() {
  const media = useMediaQuery();
  useApplyHighlightTypes();
  const navigate = useNavigate();
  const { data: initial } = useQuery(queries.init());
  const haveLanguagesButNoBooks = !initial?.haveBooks && initial?.haveLanguages;

  useEffect(() => {
    if (haveLanguagesButNoBooks) {
      navigate("/books/new");
    }
  });

  if (haveLanguagesButNoBooks || !initial) {
    return;
  }

  return (
    <>
      {/* after user wipes off or deactivates demo mode tutorialBookId is set to null */}
      {initial.tutorialBookId && (
        <Box px={20} pb={10}>
          <DemoNotice tutorialBookId={initial.tutorialBookId} />
        </Box>
      )}

      <WelcomeModal isOpen={!initial.haveLanguages} />

      {initial?.haveBooks && (
        <PageContainer>
          <PageTitle>Books</PageTitle>
          {media === "mobile" ? <BooksGrid /> : <BooksTable />}
        </PageContainer>
      )}
    </>
  );
}
