# J.Ed Studio

Sanity content and private enquiry workspaces. Requires Node 24.14+ within Node 24.
Copy .env.example into .env.local. Public content and private enquiries must use separate datasets.
Commands: npm ci; npm run dev; npm run lint; npm run build.
Studio auto-updates are disabled; dependencies are pinned to reviewed stable versions.
See ../docs/DEPLOYMENT.md for dataset roles, migration and deployment.

The content workspace includes a dashboard, singleton homepage/settings editors, courses/curricula, counselling, moderated reviews, banners, updates, placements and FAQs. Publish reviewed content with approval enabled. See [the implementation log](../docs/CMS_IMPLEMENTATION_LOG.md) for editor instructions and guarded development seeding. Website staff roles and Sanity account permissions are separate; configure both at their respective providers.
