import type { APIRoute } from "astro";
import { client } from "../../../lib/graphqlClient";
import { UPDATE_ITEM } from "../../../lib/queries/items";

export const prerender = false;

export const POST: APIRoute = async ({ params, request, redirect }) => {
  const id = params.id;

  if (!id) {
    return new Response("Missing item id", { status: 400 });
  }

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
    const rawBody = await request.text();
    const paramsBody = new URLSearchParams(rawBody);
    rawName = paramsBody.get("name");
    rawDescription = paramsBody.get("description");
  }

  const name = typeof rawName === "string" ? rawName.trim() : "";
  const description =
    typeof rawDescription === "string" && rawDescription.trim().length > 0
      ? rawDescription.trim()
      : null;

  if (!name) {
    return new Response("Name is required", { status: 400 });
  }

  await client.request(UPDATE_ITEM, {
    id,
    name,
    description,
  });

  return redirect("/items", 303);
};