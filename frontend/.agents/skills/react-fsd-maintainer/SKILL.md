---
name: react-fsd-maintainer
description: Steps to create a slice, move code down to another layer or fix an architecture finding of the lint in the portfolio frontend. Use when adding code in frontend/src or when pnpm lint fails on an architecture rule.
---

# Maintaining the frontend architecture

This is an aid to carry the work out, not a rule: what goes in each layer, what
may import what and what enforces each rule is in
[ARCHITECTURE.md → Feature-Sliced Design Rules](../../../../ARCHITECTURE.md#-feature-sliced-design-rules),
how agents work is in `AGENTS.md`, and the project's own conventions are in the
`portfolio-conventions` skill. Where this skill disagrees with them, they win
and this skill is corrected in the same change.

## Create a slice

1. **The layer.** Follow *Where new code goes* in
   [ARCHITECTURE.md](../../../../ARCHITECTURE.md#where-new-code-goes): new code
   starts in the page that uses it, and moves to a slice of its own when the
   second consumer appears.
2. **The folder.** `src/<layer>/<slice>/`, in kebab-case, with only the segments
   that will hold something.
3. **The public API first.** Write `<slice>/index.ts` with what other slices
   will use, and nothing else.
4. **The business rules**, as pure functions in `model` or `lib`, with their
   test next to them (`<file>.test.ts`) in the same change; the components in
   `ui`, with their test next to them (`<Component>.test.tsx`).
5. **The gates.** `pnpm lint`, `pnpm test` and `pnpm build`, all green before
   the part is done.

## Move code down to another layer

When a second page, widget or feature needs something that lives in another
slice:

1. Choose the destination with the same section of
   [ARCHITECTURE.md](../../../../ARCHITECTURE.md#where-new-code-goes): the
   highest layer that is below every consumer.
2. Move the files with `git mv`, with their tests, so the diff shows a move and
   not a deletion and a copy.
3. Export what moved from the destination's `<slice>/index.ts` and remove it
   from the origin's.
4. Change every import to the new `@/<layer>/<slice>`, and search `src` and
   `tooling` for the old path until none is left.
5. The gates green, and in the same change, the documentation that named the
   old path.

## Fix an architecture finding of the lint

What each rule of `eslint.config.js` asks for; the case that makes it fire is in
`eslint.config.test.ts`.

| Rule | What it found | Fix |
|---|---|---|
| `fsd/forbidden-imports` | An import of a layer above | Move what is shared down to a lower layer, or pass it from above as a prop or an argument |
| `fsd/no-cross-slice-dependency` | An import of a sibling slice | Move what is common down to a lower layer, or compose both slices in the layer above |
| `fsd/no-public-api-sidestep` | An import that enters a slice without going through its index | Export what is needed from `<slice>/index.ts` and import `@/<layer>/<slice>` |
| `fsd/no-relative-imports` | A relative path that leaves the slice | Use the alias: `@/<layer>/<slice>` |
| `fsd-gaps/boundaries` | What the four rules above find in an import, in a re-export (`export … from`); or a dynamic `import()` of a layer above | The fix in the fsd-lint row that says the same of an import; the message says which boundary it crosses |
| `no-restricted-syntax` | A file outside the six layers, loose at the root of `src` or not `.ts`/`.tsx`; in `model`, `api` or `lib`, a `.tsx` file or a dynamic import of UI or of React | Move the file to its layer (the entry point and `vite-env.d.ts` live in `src/app/`) and to TypeScript, or the component to `ui`; from React, import its hooks by name |
| `Parsing error` (no rule) | A `.js`, `.jsx`, `.mjs`, `.cjs`, `.mts` or `.cts` file in `src` holding TypeScript or JSX | Rename it to `.ts` or `.tsx` in its layer |
| `no-restricted-imports` | UI, MUI or Emotion (types included), styles, `react-dom`, a JSX runtime or React as a whole in `model`, `api` or `lib` | Let the model return data and the view render it from `ui`; from React, import its hooks by name; a type the view needs is declared by the logic (as `NotificationSeverity`) |
| `no-restricted-globals`, `no-restricted-properties` | A `fetch` or an `XMLHttpRequest` in `src` | The site sends no request of its own: content goes in the entity's `data.json`; a real network need is an owner decision, together with the CSP's `connect-src` |
| `no-restricted-properties`, in a test | A test that does not run: `.skip`, `.todo`, `skipIf` or `runIf` | Make it pass or delete it |

A finding is not silenced by relaxing `eslint.config.js`, and an
`eslint-disable` comment switches nothing off: the lint reports it as a warning,
and a warning fails `pnpm lint`. A silence is an exception, and exceptions are
the owner's decision, recorded in `eslint.config.js` next to their reason, with
their case in `eslint.config.test.ts` and their line in `ARCHITECTURE.md` and its Spanish mirror, `docs/es/ARCHITECTURE.md`.
