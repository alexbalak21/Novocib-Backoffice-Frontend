import type { APIRoute } from "astro";
import { client } from "../../lib/graphqlClient";
import { CREATE_ITEM } from "../../lib/queries/items";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type") ?? "";

  let rawName: FormDataEntryValue | null = null;
  let rawDescription: FormDataEntryValue | null = null;

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await request.formData();
    rawName = formData.get("name");
    rawDescription = formData.get("description");
  } else {
    // Fallback for non-standard form submissions that omit a supported content-type.
    const rawBody = await request.text();
    const params = new URLSearchParams(rawBody);

    if (params.has("name") || params.has("description")) {
      rawName = params.get("name");
      rawDescription = params.get("description");
    } else {
      const textFields = rawBody
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .reduce<Record<string, string>>((acc, line) => {
          const separatorIndex = line.indexOf("=");
          if (separatorIndex <= 0) return acc;
          const key = line.slice(0, separatorIndex).trim();
          const value = line.slice(separatorIndex + 1).trim();
          acc[key] = value;
          return acc;
        }, {});

      rawName = textFields.name ?? null;
      rawDescription = textFields.description ?? null;
    }
  }

  const name = typeof rawName === "string" ? rawName.trim() : "";
  const description =
    typeof rawDescription === "string" && rawDescription.trim().length > 0
      ? rawDescription.trim()
      : null;

  if (!name) {
    return new Response("Name is required", { status: 400 });
  }

  await client.request(CREATE_ITEM, {
    name,
    description,
  });

  return redirect("/items", 303);
};