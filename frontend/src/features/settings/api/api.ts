import { apiClient } from "#utils/apiClient";
import type {
  AppInfoResponse,
  BackupsResponse,
  Highlights,
  InitialResponse,
  SettingsForm,
  ShortcutsForm,
} from "./types";

const BASE_URL = "";

export const api = {
  getInitialState() {
    return apiClient.get<InitialResponse>(`${BASE_URL}/initial`);
  },

  getAppInfo() {
    return apiClient.get<AppInfoResponse>(`${BASE_URL}/appinfo`);
  },

  getShortcuts() {
    return apiClient.get<ShortcutsForm>(`${BASE_URL}/shortcuts`);
  },

  getBackupInfo() {
    return apiClient.get<BackupsResponse>(`${BASE_URL}/backups`);
  },

  getSettingsFormValues() {
    return apiClient.get<SettingsForm>(`${BASE_URL}/settings/form`);
  },

  getThemeFormValues() {
    return apiClient.get<Highlights>(`${BASE_URL}/theme/form`);
  },

  clearDemoData() {
    return apiClient.delete(`${BASE_URL}/settings/db`);
  },

  deactivateDemoMode() {
    return apiClient.patch(`${BASE_URL}/settings/db`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deactiveDemo: true }),
    });
  },
};
