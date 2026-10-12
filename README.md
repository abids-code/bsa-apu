# BSA APU Website

A modern, responsive website for the Bangladeshi Students Association at Ritsumeikan Asia Pacific University (APU), built with React, TanStack Router, and Vite.

The project showcases the association’s mission, events, community activities, gallery, and contact information for prospective members and visitors.

## Tech stack

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Start
- React Query
- Tailwind CSS
- Lucide icons
- Vitest

## Features

- Landing page with hero section and community messaging
- About page describing the BSA APU mission and culture
- Event listing and upcoming highlights
- News and updates section
- Gallery page with community photos
- Contact page for membership and inquiries
- Mobile-friendly responsive navigation
- SEO metadata and social metadata per route

## Project structure

```text
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── test/
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
├── .gitignore
├── components.json
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── README.md
└── bunfig.toml
```

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Lint the project

```bash
npm run lint
```

## Available scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Production build
npm run preview   # Preview the production build locally
npm test          # Run Vitest tests
npm run lint      # Run ESLint
```

## Notes

The site continues to run locally with sample content when Supabase environment variables are
absent. When configured, it reads published events, news, and gallery items from Supabase and
saves contact form submissions there.

## Supabase setup

The project includes a Supabase client and an initial database migration. To connect it to a
Supabase project:

1. Create a Supabase project in the Supabase dashboard.
2. Open the SQL Editor and run
   `supabase/migrations/20261009000000_initial_schema.sql`.
3. Copy `.env.example` to `.env.local` and fill in the project's URL and anon/publishable key.
   Restart the Vite dev server after changing environment variables.
4. Create the intended administrator in Supabase Authentication. The migration creates a
   `member` profile automatically; promote the administrator from the SQL Editor:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (
     select id from auth.users where email = 'admin@example.com'
   );
   ```

The browser client uses only the public anon/publishable key. Do not put a service-role key in
`.env.local` or any `VITE_` variable. Row-level security limits public reads to published content,
allows public contact submissions, and reserves content management and contact-message reads for
profiles explicitly assigned the `admin` role.

This adds the database and authorization foundation, not an admin login or content-management
screen. Those UI flows can be added separately; contact form submissions are stored in
`contact_messages`, and image objects use the public `bsa-gallery` Storage bucket. Public contact
submission is not yet protected by CAPTCHA or rate limiting, so add an abuse-control mechanism
before exposing the form to heavy traffic.
