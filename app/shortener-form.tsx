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
  const [errorMessage, setErrorMessage] = useState("");
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
    setErrorMessage("");
    setSuccess(null);

    try {
      const res = await createNewURL(alias, url);

      if (!res.ok) {
        setErrorMessage(res.error);
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
      setErrorMessage("Something went wrong. Please try again.");
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
      setErrorMessage("Could not copy URL. Copy it manually.");
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-200/40 blur-2xl" />
      <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-amber-200/40 blur-2xl" />

      <div className="relative space-y-2">
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-800">
          URL Shortener
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Create clean links in seconds
        </h1>
        <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          Paste any destination URL and choose your own alias. Anyone who visits
          your short link will be redirected instantly.
        </p>
      </div>

        <form className="relative mt-8 space-y-5" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Destination URL</span>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-cyan-300 transition focus:border-cyan-500 focus:ring"
            type="url"
            placeholder="https://example.com/really/long/path"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Alias</span>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-cyan-300 transition focus:border-cyan-500 focus:ring"
            type="text"
            placeholder="my-event"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
            minLength={3}
            maxLength={30}
            required
          />
          <p className="text-xs text-slate-500">
            Allowed characters: letters, numbers, hyphens, and underscores.
          </p>
        </label>

        <button
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create short URL"}
        </button>
      </form>

      {errorMessage ? (
        <p className="relative mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      {success ? (
        <div className="relative mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">Short link created!</p>
          <a
            className="mt-1 block break-all text-emerald-700 underline underline-offset-4"
            href={success.shortPath}
          >
            {shortUrl || success.shortPath}
          </a>
          <button
            className="mt-3 inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
            type="button"
            onClick={copyShortUrl}
          >
            Copy URL
          </button>
        </div>
      ) : null}
    </div>
  );
}
