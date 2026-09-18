# Contribution workflow

Branch naming, commit style, issue/PR templates, and the PR/release flow
for this repo. Linked from [`AGENTS.md`](../../AGENTS.md).

For every requested task:

0. If asked to create an issue, follow the template at
   [`.github/ISSUE_TEMPLATE/task.md`](../../.github/ISSUE_TEMPLATE/task.md):
   Description, optional Why, Scope, Acceptance Criteria, optional
   Dependencies (one checkbox per dependency, checked once done; omit
   the section entirely if there are none). Add a task-specific section
   (e.g. "Security requirements") only when the issue genuinely calls
   for one — don't add it by default.
1. Create a branch from `dev` named `<type>/<short-kebab-case-description>`,
   per [Conventional Branch](https://conventionalbranch.org/):
   - `feature/` or `feat/` — new functionality
   - `bugfix/` or `fix/` — bug fixes
   - `docs/` — documentation-only changes (README, `docs/`, `AGENTS.md`,
     code comments)
   - `chore/` — other non-code tasks (config, deps, tooling)
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, ...):
   - No AI co-author trailer (no `Co-Authored-By` line) on any commit.
   - Subject line under 72 characters.
   - Split unrelated concerns into separate commits instead of one bulk
     commit.
3. Before opening a PR, update your branch from `dev` again and integrate
   those changes (merge or rebase — this repo has no single documented
   policy for which to use, so follow whatever the rest of the branch's
   history already does, or ask if that's unclear), resolving any conflicts
   locally. Don't open a PR against a stale base.
4. Push the branch and open a PR into `dev`, never `main` directly, using
   [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md):
   reference the issue with `Closes #N` (the closing keyword only fires
   once the PR lands on the default branch, i.e. once `dev` is promoted to
   `main`), explain what changed, list the automated/unit tests and manual
   testing steps, and note any configuration or migration required. The
   normal target is `dev`.

### Promotion, releases, and deploys

- `dev` requires the same green CI (lint/typecheck/test/format/build +
  Docker build check, dependency review + secret scan — the shared
  `security.yml` runs dependency review + Gitleaks, both via org-shared
  `Nucleo-Estudantes-Informatica-ISEP/.github` workflows) and review as
  `main`, but no release label. CodeQL is enforced separately: it's a
  branch ruleset's native `code_scanning` rule, not an Actions status
  check/workflow.
- Once a batch of work on `dev` is ready to ship, open a `dev` → `main`
  promotion PR and apply exactly one `release:major`, `release:minor`, or
  `release:patch` label before merging — a required check blocks the merge
  otherwise. Dependabot PRs and docs/`.github`-only PRs are exempt and need
  no label.
- Merging a labeled promotion PR auto-tags the next semver version and
  publishes a GitHub Release.
- This template repo has no live deployment of its own, so neither branch
  here gates a deploy — `dev` and `main` just need green CI and (for
  `main`) the release label. **This does not apply to edition repos created
  from this template**: their `main` is what's actually deployed live via
  Coolify, and each edition repo makes its own call on whether to keep a
  `dev` staging branch gating that deployment.
