import { clearAllHovered, getHovered, getMarked, makeMarked } from "./text";

export function updateStatusForMarked(new_status: number) {
  const termids = getMarked()
    .concat(getHovered())
    .map((el) => Number(el.dataset.wid));
  const updates = [createStatusUpdateHash(new_status, termids)];
  post_bulk_update(updates);
}

/**
 * Change status using arrow keys for selected or hovered elements.
 */
export function incrementStatusForMarked(shiftBy: number) {
  const elements = Array.from(
    document.querySelectorAll("span.kwordmarked, span.wordhover")
  );
  if (elements.length == 0) return;

  const statuses = [
    "status0",
    "status1",
    "status2",
    "status3",
    "status4",
    "status5",
    "status99",
  ];

  // Build payloads to update for each unique status that will be changing
  const status_elements = statuses.reduce((obj, status) => {
    obj[status] = [];
    return obj;
  }, {});

  elements.forEach((element) => {
    const s = element.dataset.statusClass ?? "missing";
    if (s in status_elements) status_elements[s].push(element);
  });

  // Convert map to update hashes.
  const updates = [];

  Object.entries(status_elements).forEach(([status, update_elements]) => {
    if (update_elements.length == 0) return;

    const status_index = statuses.indexOf(status);
    let new_index = status_index + shiftBy;
    new_index = Math.max(0, Math.min(statuses.length - 1, new_index));
    const new_status = Number(statuses[new_index].replace(/\D/g, ""));

    // Can't set status to 0 (that is for deleted/non-existent terms only).
    // TODO delete term from reading screen: setting to 0 could equal deleting term.
    if (new_index != status_index && new_status != 0) {
      updates.push(createStatusUpdateHash(new_status, update_elements));
    }
  });

  post_bulk_update(updates);
}

function post_bulk_update(updates) {
  if (updates.length == 0) {
    // console.log("No updates.");
    return;
  }
  const elements = Array.from(
    document.querySelectorAll("span.kwordmarked, span.wordhover")
  );
  if (elements.length == 0) return;
  const firstEl = elements[0];
  const firstStatus = updates[0].new_status;
  const selectedIds = getMarked().map((el) => el.getAttribute("id"));

  const data = JSON.stringify({ updates: updates });

  function remarkSelectedIds() {
    selectedIds.forEach((id) => makeMarked(document.getElementById(id)));

    if (selectedIds.length > 0) {
      clearAllHovered();
    }
  }

  const reload_text_div = function () {
    const bookid = "";
    const pagenum = "";
    const url = `/read/renderpage/${bookid}/${pagenum}`;
    const repel = "";
    repel.load(url, remarkSelectedIds);
  };

  fetch("/term/bulk_update_status", {
    method: "POST", // Set the HTTP method to POST
    headers: {
      "Content-Type": "application/json", // Indicate the content type as JSON
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  })
    .then((response) => {
      if (!response.ok) {
        // Check if the response is successful
        return Promise.reject("Failed to update status");
      }
      return response.json(); // Parse JSON from the response
    })
    .then(() => {
      reload_text_div();
      if (elements.length === 1) {
        _updateTermForm(firstStatus);
      }
    })
    .catch((error) => {
      const msg = {
        error: error,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    });
}

/**
 * If the term editing form is visible when reading, and a hotkey is hit,
 * the form status should also update.
 */
function _updateTermForm(new_status: number) {
  const sel = 'input[name="status"][value="' + new_status + '"]';
  const radioButton = top.frames.wordframe.document.querySelector(sel);
  if (radioButton) {
    radioButton.click();
  } else {
    // Not found - user might just be hovering over the element,
    // or multiple elements selected.
    // console.log("Radio button with value " + new_status + " not found.");
  }
}

function createStatusUpdateHash(new_status: number, termids: number[]) {
  return {
    new_status: new_status,
    termids: termids,
  };
}
