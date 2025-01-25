import { keepPreviousData } from "@tanstack/react-query";
import { keys } from "./keys";
import {
  getSentences,
  getTags,
  getTagSuggestions,
  getTerm,
  getTermPopup,
  getTermSuggestions,
} from "./api";

const getTermQuery = (id) => ({
  queryKey: keys.term(id),
  queryFn: () => getTerm(id),
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
  enabled: id !== null,
});

const getPopupQuery = (id) => ({
  queryKey: keys.popup(id),
  queryFn: () => getTermPopup(id),
  enabled: id !== null,
});

const getSentencesQuery = (termText, langId) => ({
  queryKey: keys.sentences(termText, langId),
  queryFn: () => getSentences(termText, langId),
  staleTime: Infinity,
});

const getTermSuggestionsQuery = (searchText, langId) => ({
  queryKey: keys.termSuggestions(searchText, langId),
  queryFn: () => getTermSuggestions(searchText, langId),
  enabled: searchText !== "" && langId != null,
});

const getTagsQuery = {
  queryKey: keys.tags,
  queryFn: getTags,
};

const getTagSuggestionsQuery = {
  queryKey: keys.tagSuggestions,
  queryFn: getTagSuggestions,
};

export {
  getTermQuery,
  getPopupQuery,
  getTermSuggestionsQuery,
  getTagSuggestionsQuery,
  getTagsQuery,
  getSentencesQuery,
};
