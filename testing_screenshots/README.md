# Testing Screenshots

These artifacts are intended to be attached/referenced in the MR for test evidence.

## Commands captured

- `npm install` → `npm-install-output.svg`
- `npm run lint` → `lint-output.svg`
- `npm run typecheck` → `typecheck-output.svg`

## Notes

All commands were executed in this CI/container environment. Dependency installation failed due a registry access restriction (`403 Forbidden`), so `next` was unavailable and checks could not run to completion.
