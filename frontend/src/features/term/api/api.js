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
    `http://localhost:5001/api/terms/${searchText}/${langId}/suggestions`
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

async function createTerm(data) {
  const response = await fetch(`http://localhost:5001/api/terms`, {
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

async function editTerm(data) {
  const response = await fetch(`http://localhost:5001/api/terms/${data.id}`, {
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

async function deleteTerm(id) {
  const response = await fetch(`http://localhost:5001/api/terms/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export {
  getTerm,
  getTermPopup,
  getTermSuggestions,
  getSentences,
  getTags,
  getTagSuggestions,
  createTerm,
  editTerm,
  deleteTerm,
};
