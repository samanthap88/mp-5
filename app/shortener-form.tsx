"use client";

import { FormEvent, useMemo, useState } from "react";
import createNewURL from "@/lib/createNewURL";

type ApiResponse = {
  alias: string;
  url: string;
  shortPath: string;
};

export default function ShortenerForm() {
  const [alias, setAlias] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<ApiResponse | null>(null);

  const shortUrl = useMemo(() => {
    if (!success) {
      return "";
    }

    if (typeof window === "undefined") {
      return success.shortPath;
    }

    return `${window.location.origin}${success.shortPath}`;
  }, [success]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);

    try {
      const res = await createNewURL(alias, url);

      if (!res.ok) {
        return;
      }

      setSuccess({
        alias: res.alias,
        url: res.url,
        shortPath: res.shortPath,
      });
      setAlias("");
      setUrl("");
    } catch {
        console.error("Error creating short URL");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyShortUrl() {
    if (!shortUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      console.error("Error copying URL");
    }
  }

  return (
    <div>

      <div>
        <h1 className="text-3xl font-bold ">
          Link shortener
        </h1>
      </div>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Destination URL</span>
          <input
            className="w-full rounded-xl border border-gray-500 bg-white px-4 py-3 text-black outline-none "
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Alias</span>
          <input
            className="w-full rounded-xl border border-gray-500 bg-white px-4 py-3 text-black outline-none "
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
          />
        </label>

        <button
          className="inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-semibold text-white "
          type="submit"
          disabled={isSubmitting}
        >
          {"Create short URL"}
        </button>
      </form>


      {success ? (
        <div className="relative mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">Short link created!</p>
          <a
            className="mt-1 block break-all text-emerald-700 underline underline-offset-4"
            href={success.shortPath}
          >
            {shortUrl || success.shortPath}
          </a>
        </div>
      ) : null}
    </div>
  );
}
