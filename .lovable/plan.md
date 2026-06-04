# Migrate deployment from Cloudflare Workers to Vercel

## Why you're seeing 404 today

Your `vercel.json` rewrites every request to `/index.html`, but this project does not produce an `index.html` at build time. It's a **TanStack Start SSR app** built for **Cloudflare Workers** via `@cloudflare/vite-plugin`, `wrangler.jsonc`, and a custom Worker entry at `src/server.ts`. The Cloudflare build output is not something Vercel knows how to serve, so every URL falls through to a 404.

To deploy on Vercel, the project's server target has to be switched from Cloudflare Workers to a Node/Vercel-compatible target.

## Honest tradeoff (please read)

This is not a config tweak — it's a real migration that touches the build setup. The Lovable preset (`@lovable.dev/vite-tanstack-config`) bundles the Cloudflare plugin and Worker assumptions. We have to work around that, and you may hit edge cases the Lovable preset normally smooths over.

The one-click **Publish** button in Lovable already gives you a working SSR deployment on `milele-motors-forge.lovable.app` (plus custom domain support) with zero changes. If your only goal is "get the site live," Publish is dramatically less risky.

If you specifically need Vercel (e.g. team is on Vercel, you want Vercel analytics, etc.), continue.

## Plan

### 1. Replace the Cloudflare build target with Vercel's Node preset
- Stop using the Cloudflare-bundled config. Replace `vite.config.ts` with a direct TanStack Start config that uses the **Node** server target (`target: 'vercel'` via TanStack Start's deployment presets, or plain Node SSR output).
- Remove `@cloudflare/vite-plugin` from `package.json`.
- Delete `wrangler.jsonc` (Cloudflare-only).
- Add a new `vite.config.ts` that imports `tanstackStart` directly and configures the Vercel target, plus the React, Tailwind v4, and tsconfig-paths plugins that the Lovable preset used to provide.

### 2. Rewrite the server entry for Node
- The current `src/server.ts` is a Workers `fetch` handler. Vercel's Node runtime expects a different export shape (a Node HTTP handler exported as `default`).
- Keep the lazy import + error normalization pattern, but adapt the surrounding wrapper to Node. The h3 error-swallowing fix still applies.

### 3. Fix `vercel.json`
Replace the broken SPA rewrite with the correct config for a TanStack Start (SSR Node) deploy:
- Remove the `/(.*) → /index.html` rewrite.
- Set the framework to "other" and let Vercel auto-detect the Node server output, OR add an explicit `builds`/`functions` block pointing at the built server entry.

### 4. Move runtime env vars from Cloudflare to Vercel
The app currently expects `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `LOVABLE_API_KEY` at runtime (read inside server function `.handler()` bodies). On Vercel these have to be added via **Vercel Project Settings → Environment Variables** for Production, Preview, and Development. The matching `VITE_*` build-time vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) also need to be set in Vercel for the client bundle.

### 5. Re-verify Supabase auth wiring
`requireSupabaseAuth` middleware + `attachSupabaseAuth` global middleware will continue to work on Node — no code change expected. But the admin login loop you've been fighting will need to be re-tested end-to-end against the deployed Vercel URL, because cookie/CORS behavior on Vercel's Node runtime differs slightly from Workers.

### 6. Lovable preview impact (important)
Lovable's in-editor preview runs against the Cloudflare-based dev setup. Switching the build to Vercel/Node may degrade or break the Lovable preview and the Lovable **Publish** button — your only working deploy target after this migration will be Vercel. You can't easily have both.

### 7. Deploy
- Push to GitHub (you do this manually — Lovable syncs the repo).
- Import the repo into Vercel.
- Add the env vars from step 4.
- Trigger a Vercel build. Confirm SSR responses, the `/admin` flow, and Supabase server functions all work against the Vercel URL.

## Files that will change

- `vite.config.ts` — rewritten (no Lovable preset, no Cloudflare plugin)
- `package.json` — remove `@cloudflare/vite-plugin`, possibly remove `@lovable.dev/vite-tanstack-config`, add Vercel adapter if needed
- `src/server.ts` — rewritten for Node export shape
- `wrangler.jsonc` — deleted
- `vercel.json` — rewritten for SSR (no SPA rewrite)
- `.env` / Vercel dashboard — env var migration (manual, by you)

## Recommendation

I'll write the plan and the migration if you confirm, but **strongly suggest you use Lovable's Publish button instead** unless there's a specific Vercel requirement. Want me to proceed with the Vercel migration as above, or switch back to Publish-on-Lovable?
