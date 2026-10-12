# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File                     | URL                                                       |
| ------------------------ | --------------------------------------------------------- |
| `_public.tsx`            | Pathless public layout                                    |
| `_public.index.tsx`      | `/` (child of the public layout)                          |
| `_public.about.tsx`      | `/about` (child of the public layout)                     |
| `_public.events.tsx`     | `/events` (child of the public layout)                    |
| `_public.news.tsx`       | `/news` (child of the public layout)                      |
| `_public.gallery.tsx`    | `/gallery` (child of the public layout)                   |
| `_public.contact.tsx`    | `/contact` (child of the public layout)                   |
| `_admin.tsx`             | Pathless admin layout                                     |
| `_admin.admin.tsx`       | `/admin` (child of the admin layout)                      |
| `users/index.tsx`        | `/users`                                                  |
| `users/$id.tsx`          | `/users/:id` (dynamic — bare `$`, no curly braces)        |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment)                    |
| `files/$.tsx`            | `/files/*` (splat — read via `_splat` param, never `*`)   |
| `_layout.tsx`            | pathless layout route (renders children via `<Outlet />`) |
| `__root.tsx`             | app shell — wraps every page; preserve `<Outlet />`       |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.
