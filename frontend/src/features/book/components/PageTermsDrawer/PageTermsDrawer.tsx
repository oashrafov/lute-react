import { Drawer } from "@mantine/core";
import { useParams, useSearchParams } from "react-router-dom";
import { TermsTable } from "../../../term/components/TermsTable/TermsTable";

export default function PageTermsDrawer() {
  const { page } = useParams();
  const [params, setParams] = useSearchParams();
  const termIds = params.get("ids");

  return (
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
  );
}
