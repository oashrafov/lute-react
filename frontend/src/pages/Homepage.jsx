import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box } from "@mantine/core";
import BooksTable from "@book/components/BooksTable/BooksTable";
import { BooksGrid } from "@book/components/BooksGrid/BooksGrid";
import PageTitle from "@common/PageTitle/PageTitle";
import PageContainer from "@common/PageContainer/PageContainer";
import DemoNotice from "../components/DemoNotice/DemoNotice";
import { WelcomeModal } from "../components/Modals/WelcomeModal";
import { initialQuery } from "@settings/api/settings";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useInitializePage } from "@book/components/TheText/hooks/useInitializePage";

function HomePage() {
  const media = useMediaQuery();
  useInitializePage();
  const navigate = useNavigate();
  const { data: initial } = useQuery(initialQuery);
  const haveLanguagesButNoBooks = !initial.haveBooks && initial.haveLanguages;

  useEffect(() => {
    if (haveLanguagesButNoBooks) {
      navigate("/books/new");
    }
  });

  if (haveLanguagesButNoBooks) {
    return;
  }

  return (
    <>
      {/* after user wipes off or deactivates demo mode tutorialBookId is set to null */}
      {initial.tutorialBookId && (
        <Box px={20} pb={10}>
          <DemoNotice />
        </Box>
      )}

      <WelcomeModal isOpen={!initial.haveLanguages} />

      {initial.haveBooks && (
        <PageContainer>
          <PageTitle>Books</PageTitle>
          {media === "mobile" ? <BooksGrid /> : <BooksTable />}
        </PageContainer>
      )}
    </>
  );
}

export default HomePage;
