export const keys = {
  terms: ["terms"],
  term: (id) => ["term", id],
  popup: (id) => ["popup", id],
  termSuggestions: (searchText, langId) => [
    "termSuggestions",
    searchText,
    langId,
  ],
  tagSuggestions: ["termTagSuggestions"],
  tags: ["termTags"],
  sentences: (termId, langId) => ["termSentences", termId, langId],
};
