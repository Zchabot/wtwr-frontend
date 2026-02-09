import { baseUrl } from "./constants";

// Standardize fetch responses: resolve JSON on success, reject with a usable error on failure
export const processResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
};

/**
+ * API client wrapper:
+ * - Centralizes fetch logic + JSON parsing
+ * - Attaches Authorization header when a JWT exists
+ * - Keeps components focused on UI/state, not request plumbing
+ */
export function request(url, options) {
  return fetch(url, options).then(processResponse);
}

function updateUserInfo(data, token) {
  return request(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

function getItems() {
  return request(`${baseUrl}/items`);
}

function getUserInfo(token) {
  return request(`${baseUrl}/users/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

function addItem(item, token) {
  return request(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
}

function addCardLike(cardId, token) {
  return request(`${baseUrl}/items/${cardId}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
}
function removeCardLike(cardId, token) {
  return request(`${baseUrl}/items/${cardId}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
}

function deleteItem(id, token) {
  return request(`${baseUrl}/items/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
}

export {
  getItems,
  addItem,
  deleteItem,
  getUserInfo,
  updateUserInfo,
  addCardLike,
  removeCardLike,
};
