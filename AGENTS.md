# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Settings View Pattern

- When working on `SettingsView`, inputs must bind to the local `cachedState`, NOT the live `useExtensionState()`. The `cachedState` acts as a buffer for user edits, isolating them from the `ContextProxy` source-of-truth until the user explicitly clicks "Save". Wiring inputs directly to the live state causes race conditions.

## PR Decomposition Guidance

Small PRs reduce review latency and keep each change understandable, testable, and mergeable on its own.

- Before coding a non-trivial change, decide whether it should be one PR, stacked PRs, or a smaller first slice.
- Put one independently reviewable unit in each PR.
- Use stacked draft PRs when a change builds in layers. Link dependent PRs and keep each PR small.
- Separate refactors from behavior changes. If a change both restructures code and adds or fixes user-visible behavior, land the preparatory refactor first.
- "Tightly coupled" is not enough reason to bundle everything together. Shared files or runtime coupling do not automatically mean the work belongs in one PR.
- If merging PR A without PR B would leave the repository broken or degraded, keep them together; otherwise split them.
- When the decomposition is unclear, pause before coding and propose the split in the issue or in a draft PR.

## Test Placement Guidance

Prefer the narrowest test layer that proves the behavior. This follows standard test-pyramid guidance: keep most coverage in fast, focused tests; add integration tests for cross-module contracts; reserve end-to-end tests for full workflow confidence.

- Use package-local unit tests for pure logic, parsing, state transitions, validation, serialization, request construction, retry decisions, and error handling.
- Use integration tests when behavior depends on multiple internal modules working together, but does not require the real VS Code extension host or browser/webview runtime.
- Use `webview-ui` tests for React rendering, hooks, component state, forms, validation, and webview UI wiring.
- Use `apps/vscode-e2e` only when the behavior depends on the real VS Code extension host, VS Code workspace APIs, extension activation, webview/extension messaging, file watcher behavior, or a complete user workflow.
- Keep e2e tests focused on high-value smoke coverage across boundaries. Avoid placing detailed protocol, parsing, storage, retry, or edge-case assertions in e2e when they can be covered reliably at a lower layer.
- When fixing a regression, add the regression test at the lowest layer that would have failed for the bug. Add an e2e test only if lower-level tests cannot represent the failure mode.
