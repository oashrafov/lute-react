import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Drawer } from "@mantine/core";
import Book from "@book/components/Book/Book";
import DrawerMenu from "../components/DrawerMenu/DrawerMenu";
import TermsTable from "@term/components/TermsTable/TermsTable";

function BookPage() {
  const { page } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [themeFormOpen, setThemeFormOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const termIds = params.get("ids");

  return (
    <>
      <DrawerMenu
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onThemeFormOpen={setThemeFormOpen}
      />

      <Book
        themeFormOpen={themeFormOpen}
        onDrawerOpen={() => setDrawerOpen(true)}
        onThemeFormOpen={setThemeFormOpen}
      />

      <Drawer
        size="100%"
        opened={!!termIds}
        onClose={() => {
          params.delete("ids");
          setParams(params);
        }}
        title={`Terms for page ${page}`}
        styles={{ title: { fontWeight: 500 } }}
        position="bottom">
        <TermsTable />
      </Drawer>
    </>
  );
}

export default BookPage;
