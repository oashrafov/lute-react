import { useEffect } from "react";
import { useNavigation } from "react-router-dom";
import { nprogress } from "@mantine/nprogress";

export function useNavigationProgress() {
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === "loading") {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [navigation.state]);
}
