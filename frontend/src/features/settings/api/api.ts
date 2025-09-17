import { endpoints } from "./endpoints";
import type {
  AppInfoResponse,
  BackupsResponse,
  Highlights,
  InitialResponse,
  SettingsForm,
  ShortcutsForm,
} from "./types";

export async function getSettingsFormInitValues(): Promise<SettingsForm> {
  const response = await fetch(endpoints.getSettingsFormInitValues);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getThemeFormInitValues(): Promise<Highlights> {
  const response = await fetch(endpoints.getThemeFormInitValues);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getShortcuts(): Promise<ShortcutsForm> {
  const response = await fetch(endpoints.getShortcuts);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getAppInfo(): Promise<AppInfoResponse> {
  const response = await fetch(endpoints.getAppInfo);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getInitialState(): Promise<InitialResponse> {
  const response = await fetch(endpoints.getInitialState);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getBackupInfo(): Promise<BackupsResponse> {
  const response = await fetch(endpoints.getBackupInfo);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function wipeDemoDatabase() {
  const response = await fetch(endpoints.wipeDemoDatabase, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function deactivateDemoMode() {
  const response = await fetch(endpoints.deactivateDemoMode, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deactiveDemo: true }),
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}
