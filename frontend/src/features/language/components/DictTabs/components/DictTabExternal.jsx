import { IconExternalLink } from "@tabler/icons-react";
import DictFavicon from "./common/DictFavicon";
import { getLookupURL, handleExternalUrl } from "@actions/utils";

function DictTabExternal({ dict, termText, innerRef, component: Component }) {
  return (
    <Component
      ref={innerRef}
      component="a"
      variant="default"
      fw="normal"
      ml={2}
      leftSection={<DictFavicon hostname={dict.hostname} />}
      rightSection={<IconExternalLink size={16} stroke={1.6} />}
      onClick={() => handleExternalUrl(getLookupURL(dict.url, termText))}>
      {dict.label}
    </Component>
  );
}

export default DictTabExternal;
