interface TermSuggestion {
  id: number;
  text: string;
  translation: string;
  status: string;
}

function _createSuggestionString(suggestion: TermSuggestion) {
  const txt = decodeURIComponent(suggestion.text);
  let t = suggestion.translation ?? "";

  if (t == "") {
    return txt;
  }

  const maxLen = 70;
  t = t.replaceAll("\n", "; ").replaceAll("\r", "");
  if (t.length > maxLen) {
    t = t.substring(0, maxLen) + "...";
  }

  return `${txt} (${t})`;
}

export function buildSuggestionsList(
  currentTermText: string,
  suggestions: TermSuggestion[]
) {
  return suggestions
    .map((suggestion) => ({
      value: suggestion.text,
      suggestion: _createSuggestionString(suggestion),
      status: suggestion.status,
    }))
    .filter((item) => item.value != currentTermText);
}
