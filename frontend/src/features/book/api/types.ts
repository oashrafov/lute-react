import type { TextDirection } from "../../../resources/types";

export interface BookStats {
  [key: string]: {
    percentage: number;
    wordCount: number;
  };
}

export interface BooksListItem {
  id: number;
  audioName: string;
  currentPage: number;
  isArchived: boolean;
  isCompleted: boolean;
  language: string;
  languageId: number;
  textDirection: TextDirection;
  lastRead: string;
  pageCount: number;
  source: string;
  tags: string[];
  title: string;
  unknownPercent: number | null;
  wordCount: number;
}

export interface BooksList {
  data: BooksListItem[];
  activeCount: number;
  archivedCount: number;
  filteredCount: number;
  totalCount: number;
}

export interface SentenceBookmark {
  id: number;
  description: string;
}

export interface PageBookmark {
  [key: string]: SentenceBookmark[];
}

export interface Audio {
  name: string;
  position: 0;
  bookmarks: number[] | [];
}

export interface BookDetail {
  id: number;
  languageId: number;
  currentPage: number;
  pageCount: number;
  source: string;
  title: string;
  audio: Audio | null;
  bookmarks: PageBookmark | null;
  textDirection: TextDirection;
}

export interface Textitem {
  id: number;
  displayText: string;
  classes: string;
  langId: number | null;
  paragraphId: number;
  sentenceId: number;
  text: string;
  statusClass: string;
  order: number;
  wid: number | null;
  isWord: boolean;
  status: number | null;
  isSentenceStart: boolean;
  isOverlapped: boolean;
}

export type Paragraph = Textitem[][];

export interface Page {
  text: string;
  paragraphs: Paragraph[];
}

export interface EditAction {
  action: "active" | "archive" | "unarchive" | "markAsStale" | "edit";
}
export interface EditBook {
  id: number;
  data: EditAction;
}

export interface NewBookForm {
  language_id: string;
  title: string;
  text: string;
  importurl: string;
  text_file: File | undefined;
  audio_file: File | undefined;
  threshold_page_tokens: number;
  split_by: "paragraphs" | "sentences";
  source_uri: string;
  book_tags: string[];
}
