export async function parseJsonObject(
  request: Request,
): Promise<Record<string, unknown> | null> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return null;
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  return body as Record<string, unknown>;
}
