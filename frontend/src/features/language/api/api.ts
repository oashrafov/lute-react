import { endpoints } from "./endpoints";
import type {
  UserLanguageDetail,
  UserLanguagesList,
  LanguageForm,
  PredefinedLanguageDetail,
} from "./types";

export async function getUserLanguages(): Promise<UserLanguagesList> {
  const response = await fetch(endpoints.getUserLanguages);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getPredefinedLanguages(): Promise<string[]> {
  const response = await fetch(endpoints.getPredefinedLanguages);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getUserLanguage(id: number): Promise<UserLanguageDetail> {
  const response = await fetch(endpoints.getUserLanguage(id));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getPredefinedLanguage(
  langName: string
): Promise<PredefinedLanguageDetail> {
  const response = await fetch(endpoints.getPredefinedLanguage(langName));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getLanguageParsers() {
  const response = await fetch(endpoints.getLanguageParsers);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getLanguageFormInitValues(): Promise<LanguageForm> {
  const response = await fetch(endpoints.getLanguageFormInitValues);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function createLanguage(data: {
  name: string;
  loadStories?: boolean;
}) {
  const response = await fetch(endpoints.createLanguage, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}
