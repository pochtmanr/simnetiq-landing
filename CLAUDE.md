# Agent Instructions

## Git & Authentication Guidelines
- **No Feature Branches:** NEVER create new branches or feature branches. Work, commit, and push directly to the `main` branch.
- **Git Push — READ THIS, there are two remotes and only one deploys:**
  - `rpochtman-lang` → `rpochtman-lang/simnetiq-landing` (private). **This is the deploy source.** Vercel
    (`vercel.com/romans-projects-44e28a53/simnetiq-landing`) builds `main` from here. **Push here.**
  - `origin` → `pochtmanr/simnetiq-landing`. Nothing deploys from this remote. Pushing here only looks
    like it worked; production will not change.
  - Pushing to `rpochtman-lang` requires being logged in as that account: `gh auth switch --user rpochtman-lang`.
    The `pochtmanr` account has no access and gets `Repository not found` — that means *private + no access*,
    **not** that the repo is gone.
  - Symptom this causes: production silently frozen at the last commit that reached the deploy repo, while
    `git push` reports success. Verify a deploy actually landed before reporting done.
- **Commit Authorship:** Commits should be authored by the `rpochtman-lang` GitHub account
  (`269783741+rpochtman-lang@users.noreply.github.com`). The local git config does **not** do this for you —
  it reads `Roman Pochtman <173081345+pochtmanr@users.noreply.github.com>`. Set the identity per-commit
  (`git -c user.name=… -c user.email=… commit`) rather than editing the stored config.

## Build & Test Commands
- **Dev Server:** `npm run dev`
- **Build App:** `npm run build`
- **Linting:** `npm run lint`

---
@AGENTS.md
