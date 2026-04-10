import getCollection from "@/db";
import { LINKS_COLLECTION, type ShortLinkDocument } from "@/lib/shortener";
import { notFound, redirect } from "next/navigation";

type AliasPageProps = {
  params: Promise<{ alias: string }>;
};

export default async function AliasRedirectPage({ params }: AliasPageProps) {
  const { alias } = await params;

  let shortLink;

  try {
    const collection = await getCollection<ShortLinkDocument>(LINKS_COLLECTION);
    shortLink = await collection.findOne({ alias: alias.toLowerCase() });
  } catch {
    notFound();
  }

  if (!shortLink) {
    notFound();
  }

  redirect(shortLink.url);
}
