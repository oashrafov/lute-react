import { Drawer } from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";
import { TermsTable } from "../../../term/components/TermsTable/TermsTable";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export default function PageTermsDrawer() {
  const { pageNum } = route.useParams();
  const { termIds } = route.useSearch();
  const navigate = route.useNavigate();

  function handleClose() {
    navigate({ search: (prev) => ({ ...prev, termIds: [] }) });
  }

  return (
    <Drawer
      size="100%"
      opened={Boolean(termIds && termIds.length > 0)}
      onClose={handleClose}
      title={`Terms for page ${pageNum}`}
      styles={{ title: { fontWeight: 500 } }}
      position="bottom">
      <TermsTable />
    </Drawer>
  );
}
