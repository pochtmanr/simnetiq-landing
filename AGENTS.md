<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:git-auth-rules -->
# Git & Authentication Rules
- **DO NOT create branches.** Always commit and push directly to `main`.
- **Commit Author:** Always commit as the local configured user:
  - Name: `rpochtman-lang`
  - Email: `269783741+rpochtman-lang@users.noreply.github.com`
  - Do NOT modify local `user.name` or `user.email`.
- **Git Push:** Push to **`rpochtman-lang main`** — that remote (`rpochtman-lang/simnetiq-landing`)
  is what Vercel builds. `origin` (`pochtmanr/simnetiq-landing`) deploys nothing: pushing there
  reports success and leaves production frozen. Requires `gh auth switch --user rpochtman-lang`.
  See CLAUDE.md for the full explanation — if these two files ever disagree again, CLAUDE.md is
  the correct one.
<!-- END:git-auth-rules -->
