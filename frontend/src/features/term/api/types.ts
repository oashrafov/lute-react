import type { TextDirection } from "../../../resources/types";

interface Sentence {
  term: string;
  references: {
    id: number;
    sentence: string;
    bookId: number;
    bookTitle: string;
    pageNumber: number;
  }[];
}

export interface SentencesResponse {
  text: string;
  variations: Sentence[] | [];
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
  id: number;
  originalText: string;
  text: string;
  textLC: string;
  parents: string[];
  romanization: string;
  status: number;
  syncStatus: boolean;
  termTags: string[];
  translation: string;
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

export interface TermQueryParams {
  id?: number;
  text?: string;
  langId?: number;
}
