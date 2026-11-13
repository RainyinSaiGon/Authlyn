export class HttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Request failed with status ${status}`);
    this.name = "HttpError";
    this.status = status;
  }
}

export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return (await response.json()) as T;
}

export async function postJson<TResponse, TBody = unknown>(
  url: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return (await response.json()) as TResponse;
}
