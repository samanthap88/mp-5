"use server";

import getCollection from "@/db";
import { LINKS_COLLECTION } from "@/lib/shortener";

type CreateNewURLResult =
  | {
      ok: true;
      alias: string;
      url: string;
      shortPath: string;
      id: string;
    }
  | {
      ok: false;
      error: string;
    };

type URLDocument = {
  alias: string;
  url: string;
  createdAt: Date;
};

export default async function createNewURL(
  alias: string,
  url: string,
): Promise<CreateNewURLResult> {
  try {
    const urlCollection = await getCollection<URLDocument>(LINKS_COLLECTION);

    const p = {
      alias: alias.trim().toLowerCase(),
      url: url.trim(),
      createdAt: new Date(),
    };

    const res = await urlCollection.insertOne(p);

    return {
      ok: true,
      alias: p.alias,
      url: p.url,
      shortPath: `/${p.alias}`,
      id: res.insertedId.toHexString(),
    };
  } catch (error) {


    return {
      ok: false,
      error: "",
    };
  }
}
