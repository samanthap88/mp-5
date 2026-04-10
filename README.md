# MongoDB URL Shortener

A mini URL shortener built with Next.js App Router and MongoDB.

## Features

- Create short links with a custom alias (`my-alias`)
- Store aliases and target URLs in MongoDB
- Redirect visitors from `/<alias>` to the original URL
- Show validation and duplicate-alias errors in the UI

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- MongoDB Node.js Driver

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables and update them for your MongoDB instance:

```bash
cp .env.example .env.local
```

Environment variables:

- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB`: Database name (default in code is `url_shortener`)

3. Run the development server:

```bash
npm run dev
```

4. Open http://localhost:3000

## How It Works

- `POST /api/shorten`
	- Accepts `{ alias, url }`
	- Validates alias and URL
	- Stores data in MongoDB collection `shortLinks`
- `GET /:alias` via `app/[alias]/page.tsx`
	- Looks up alias in MongoDB
	- Redirects to original URL if found
	- Returns 404 page if alias does not exist

## Notes

- Alias format: 3-30 characters, letters/numbers/hyphen/underscore.
- URLs must start with `http://` or `https://`.
