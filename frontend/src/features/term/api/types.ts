import type { TextDirection } from "#resources/types";

export interface SentenceRef {
  id: number;
  sentence: string;
  bookId: number;
  bookTitle: string;
  pageNumber: number;
  sentenceId: number;
}

interface Variation {
  term: string;
  references: SentenceRef[];
}

export interface SentencesResponse {
  text: string;
  variations: Variation[];
}

export interface TermPopupSection {
  tags: string[];
  text: string;
  pronunciation: string;
  translation: string;
}

export interface TermPopup extends TermPopupSection {
  images: [string, string][];
  components: TermPopupSection[];
  parents: TermPopupSection[];
}

export interface TermDetail {
  id: number | null;
  originalText: string;
  text: string;
  textLC: string;
  parents: string[];
  translation: string;
  romanization: string;
  notes: string;
  status: number;
  syncStatus: boolean;
  termTags: string[];
  currentImg: string | null;
}

export interface TermsListItem {
  createdOn: string;
  id: number;
  image: string | null;
  language: string;
  languageId: number;
  textDirection: TextDirection;
  parentsString: string | null;
  romanization: string | null;
  statusId: number;
  tagsString: string;
  text: string;
  translation: string | null;
}

export interface TermsList {
  data: TermsListItem[];
  filteredCount: number;
  totalCount: number;
}

export interface Tag {
  id: number;
  text: string;
  comment: string;
  termCount: number;
}

export type TermQueryParams = TermByIdQueryParams | TermByTextParams;

interface TermByIdQueryParams {
  id: number;
}

interface TermByTextParams {
  text: string;
  langId: number;
}

export interface TermSuggestion {
  id: number;
  text: string;
  translation: string;
  status: number;
}
