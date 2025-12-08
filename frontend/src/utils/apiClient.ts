import { z } from "zod";
import { API_BASE_URL } from "#resources/constants";

export const apiClient = {
  get<T>(
    endpoint: string,
    options?: RequestInit,
    responseSchema?: z.ZodType<T>
  ) {
    return this._request(
      endpoint,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      },
      responseSchema
    );
  },

  post<T>(
    endpoint: string,
    options: RequestInit,
    responseSchema?: z.ZodType<T>
  ) {
    return this._request(
      endpoint,
      {
        ...options,
        method: "POST",
      },
      responseSchema
    );
  },

  delete<T>(endpoint: string, responseSchema?: z.ZodType<T>) {
    return this._request(
      endpoint,
      {
        method: "DELETE",
      },
      responseSchema
    );
  },

  patch<T>(
    endpoint: string,
    options: RequestInit,
    responseSchema?: z.ZodType<T>
  ) {
    return this._request(
      endpoint,
      {
        ...options,
        method: "PATCH",
      },
      responseSchema
    );
  },

  async _request<T>(
    endpoint: string,
    options: RequestInit,
    responseSchema?: z.ZodType<T>
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      ...options,
    });

    if (!response.ok) {
      const message = await response.json();
      throw new Error(message);
    }

    if (responseSchema) {
      const parsed = responseSchema.safeParse(response);
      if (!parsed.success) {
        throw new Error("Invalid response format");
      }
      return parsed.data;
    }

    return await response.json();
  },
};
