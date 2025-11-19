import { API_BASE_URL } from "#resources/constants";

export const apiClient = {
  get(endpoint: string, options?: RequestInit) {
    return this._request(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  },

  post(endpoint: string, options: RequestInit) {
    return this._request(endpoint, {
      ...options,
      method: "POST",
    });
  },

  delete(endpoint: string) {
    return this._request(endpoint, {
      method: "DELETE",
    });
  },

  patch(endpoint: string, options: RequestInit) {
    return this._request(endpoint, {
      ...options,
      method: "PATCH",
    });
  },

  async _request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      ...options,
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(message);
    }
    return await response.json();
  },
};
