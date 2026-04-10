import { NextResponse } from "next/server";
import getCollection from "@/db";
import {
  LINKS_COLLECTION,
  type ShortLinkDocument,
} from "@/lib/shortener";

type CreateShortLinkBody = {
  alias?: string;
  url?: string;
};

export async function POST(request: Request) {
  let body: CreateShortLinkBody;

  try {
    body = (await request.json());
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
    );
  }

  const alias = body.alias || "";
  const url = body.url || "";

  const collection = await getCollection<ShortLinkDocument>(LINKS_COLLECTION);


  await collection.insertOne({
    alias,
    url
  });

  return NextResponse.json(
    {
      alias,
      url,
      shortPath: `/${alias}`,
    }
  );
}
