import { createContext, useMemo, type ReactNode } from "react";
import type { Audio } from "../../../../api/types";
import { useBookQuery } from "../../../../hooks/useBookQuery";

const AudioDataContext = createContext<Audio | null>(null);

function AudioDataProvider({ children }: { children: ReactNode }) {
  const { data } = useBookQuery();
  const audioData = useMemo(() => data.audio, [data]);
  return (
    <AudioDataContext.Provider value={audioData}>
      {children}
    </AudioDataContext.Provider>
  );
}

export { AudioDataProvider, AudioDataContext };
