import { BASE_API_URL } from "../../../resources/constants";

const root = `${BASE_API_URL}/terms`;

export const endpoints = {
  getTerms: root,
  getTermById: (id: number) => `${root}/${id}`,
  getTermByText: (text: string, langId: number) => `${root}/${text}/${langId}`,
  getTermPopup: (id: number) => `${root}/${id}/popup`,
  getTermSuggestions: (text: string, langId: number) =>
    `${root}/${text}/${langId}/suggestions`,
  getSentences: (text: string, langId: number) =>
    `${root}/${text}/${langId}/sentences`,
  getTags: `${root}/tags`,
  getTagSuggestions: `${root}/tags/suggestions`,
  createTerm: root,
  editTerm: (id: number) => `${root}/${id}`,
  deleteTerm: (id: number) => `${root}/${id}`,
} as const;
