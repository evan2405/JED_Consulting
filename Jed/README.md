# J.Ed website

Next.js 16 / React 19. Requires Node 24.14+ within Node 24.
See ../README.md and ../docs/DEPLOYMENT.md for setup and launch instructions.

Commands: npm ci; npm run dev; npm run lint; npm test; npm run build; npm run start; npm run test:e2e.
Copy .env.example into .env.local and configure the required services before enabling enquiries.

Content setup, seeds, editor workflow and verification: [CMS implementation log](../docs/CMS_IMPLEMENTATION_LOG.md). Resume point: [work bookmark](../docs/WORK_BOOKMARK.md). `npm run seed` is a dry run by default. Keep `SANITY_USE_CATALOG_FALLBACK=false` for CMS publication checks.
