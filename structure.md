# Project structure

This document describes the recommended structure for a large Astro backoffice application
with multiple business modules and JWT-based authentication.

```txt
src/
  modules/
    stock/
      pages/
        index.astro
        new.astro
        [id]/
          edit.astro
      components/
        ItemsTable.astro
        ItemForm.astro
      queries/
        items.ts
      types/
        items.ts

    auth/
      pages/
        login.astro
        logout.ts
      components/
        LoginForm.astro
      lib/
        authStore.ts
        token.ts
      queries/
        auth.ts

    users/
      pages/
      components/
      queries/
      types/

  layouts/
    BaseLayout.astro
    AdminLayout.astro

  components/
    ui/
      Button.astro
      Input.astro
      Table.astro
      Card.astro
      Modal.astro
      FormField.astro

  lib/
    graphql/
      client.ts
      request.ts
      errors.ts
    utils/
      format.ts
      validation.ts

  middleware/
    auth.ts

pages/
  index.astro
```

## Modules

Each domain (stock, auth, users, etc.) lives under `src/modules/<moduleName>` and contains:

- `pages/`  
  Route-level pages for this module. Example: `stock/pages/index.astro` → `/stock`.

- `components/`  
  UI components specific to this module (tables, forms, filters, etc.).

- `queries/`  
  GraphQL queries and mutations for this module only.

- `types/`  
  TypeScript interfaces and types for this module’s data models.

- `lib/` (optional)  
  Module-specific logic (stores, helpers, mappers).

This keeps each business area isolated and easier to maintain.

## Layouts

`src/layouts/` contains shared layout shells:

- `BaseLayout.astro`  
  Global layout (HTML skeleton, `<head>`, base styles).

- `AdminLayout.astro`  
  Backoffice layout (sidebar, header, main content area).

Pages wrap their content with these layouts to keep a consistent structure.

## Shared UI components

`src/components/ui/` contains generic, reusable UI primitives:

- Button.astro  
- Input.astro  
- Table.astro  
- Card.astro  
- Modal.astro  
- FormField.astro  

Module components (e.g. `ItemsTable.astro`) compose these primitives instead of re‑implementing UI patterns.

## Lib

`src/lib/` contains cross-cutting infrastructure:

- `graphql/`  
  - `client.ts` – GraphQL client configuration (endpoint, headers, auth).  
  - `request.ts` – helper wrappers for queries/mutations.  
  - `errors.ts` – error handling utilities.

- `utils/`  
  Generic helpers (formatting, validation, parsing, etc.).

Nothing in `lib/` should be domain-specific.

## Middleware

`src/middleware/auth.ts` contains authentication/authorization logic:

- Checks JWT / session state.  
- Protects routes (e.g. `/stock`, `/users`).  
- Redirects unauthenticated users to `/auth/login`.

This centralizes access control instead of scattering checks across pages.

## Pages

`src/pages/` is reserved for top-level routes:

- `index.astro` – application home or dashboard.  
- Optionally thin wrappers that delegate to module pages.

Example:

```ts
---
// src/pages/stock.astro
import StockIndex from "../modules/stock/pages/index.astro";
---
<StockIndex />
```

This keeps the public routing surface clear while modules own their internal structure.

## Principles

- One module per business domain (`stock`, `auth`, `users`, …).  
- Shared UI in `components/ui`, never duplicated in modules.  
- Shared infrastructure in `lib`, never domain-specific.  
- Auth and route protection in `middleware`, not in individual pages.  
- GraphQL and types are defined per module, close to where they are used.
