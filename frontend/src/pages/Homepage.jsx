import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box, em, Modal, useComputedColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import BooksTable from "@book/components/BooksTable/BooksTable";
import BooksGrid from "@book/components/BooksGrid/BooksGrid";
import PageTitle from "@common/PageTitle/PageTitle";
import PageContainer from "@common/PageContainer/PageContainer";
import DrawerMenu from "../components/DrawerMenu/DrawerMenu";
import DemoNotice from "../components/DemoNotice/DemoNotice";
import Welcome from "../components/Modals/Welcome";
import { settingsQuery, initialQuery } from "@settings/api/settings";
import { applyLuteHighlights } from "@actions/general";

function HomePage() {
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(992)})`);
  const navigate = useNavigate();

  const colorScheme = useComputedColorScheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: settings } = useQuery(settingsQuery);
  const { data: initial } = useQuery(initialQuery);

  useEffect(() => {
    applyLuteHighlights(settings.highlights.status, colorScheme);
    applyLuteHighlights(settings.highlights.general, colorScheme);
  }, [colorScheme, settings.highlights]);

  useEffect(() => {
    if (!initial.haveBooks && initial.haveLanguages) navigate("/books/new");
  });

  return (
    <>
      {/* after user wipes off or deactivates demo mode tutorialBookId is set to null */}
      {initial.tutorialBookId && (
        <Box pl={20} pr={20} pb={10}>
          <DemoNotice />
        </Box>
      )}
      <Modal
        trapFocus={false}
        opened={!initial.haveLanguages}
        title="Welcome to Lute"
        size="auto"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}>
        <Welcome />
      </Modal>

      {isTablet && initial.haveBooks && (
        <DrawerMenu
          drawerOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {initial.haveBooks && (
        <PageContainer>
          <PageTitle>Books</PageTitle>
          {isMobile ? <BooksGrid /> : <BooksTable />}
        </PageContainer>
      )}
    </>
  );
}

export default HomePage;
