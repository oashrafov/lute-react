import { endpoints } from "./endpoints";
import type {
  SentencesResponse,
  Tag,
  TermDetail,
  TermPopup,
  TermsList,
  TermSuggestion,
} from "./types";

export async function getTerms(filters?: string): Promise<TermsList> {
  const url = filters ? `${endpoints.getTerms}?${filters}` : endpoints.getTerms;
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getTermById(id: number): Promise<TermDetail> {
  const response = await fetch(endpoints.getTermById(id));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getTermByText(
  text: string,
  langId: number
): Promise<TermDetail> {
  const response = await fetch(endpoints.getTermByText(text, langId));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getTermPopup(id: number): Promise<TermPopup> {
  const response = await fetch(endpoints.getTermPopup(id));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getTermSuggestions(
  searchText: string,
  langId: number
): Promise<TermSuggestion[]> {
  const response = await fetch(
    endpoints.getTermSuggestions(searchText, langId)
  );

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getSentences(
  termText: string,
  langId: number
): Promise<SentencesResponse> {
  const response = await fetch(endpoints.getSentences(termText, langId));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getTags(): Promise<Tag[]> {
  const response = await fetch(endpoints.getTags);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getTagSuggestions(): Promise<string[]> {
  const response = await fetch(endpoints.getTagSuggestions);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function createTerm(data: any) {
  const response = await fetch(endpoints.createTerm, {
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

export async function editTerm(data: any) {
  const response = await fetch(endpoints.editTerm(data.id), {
    method: "PUT",
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

export async function deleteTerm(id: number) {
  const response = await fetch(endpoints.deleteTerm(id), {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}
