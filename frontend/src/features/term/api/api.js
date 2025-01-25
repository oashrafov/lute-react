async function getTerm(id) {
  const response = await fetch(`http://localhost:5001/api/terms/${id}`);
  return await response.json();
}

async function getTermPopup(id) {
  const response = await fetch(`http://localhost:5001/api/terms/${id}/popup`);
  return await response.json();
}

async function getTermSuggestions(searchText, langId) {
  const response = await fetch(
    `http://localhost:5001/api/terms/${searchText}/${langId}`
  );
  return await response.json();
}

async function getSentences(termText, langId) {
  const response = await fetch(
    `http://localhost:5001/api/terms/${termText}/${langId}/sentences`
  );
  return await response.json();
}

async function getTags() {
  const response = await fetch(`http://localhost:5001/api/terms/tags`);
  return await response.json();
}

async function getTagSuggestions() {
  const response = await fetch(
    `http://localhost:5001/api/terms/tags/suggestions`
  );
  return await response.json();
}

export {
  getTerm,
  getTermPopup,
  getTermSuggestions,
  getSentences,
  getTags,
  getTagSuggestions,
};
