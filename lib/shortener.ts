export const LINKS_COLLECTION = "shortLinks";

export type ShortLinkDocument = {
  alias: string;
  url: string;
};