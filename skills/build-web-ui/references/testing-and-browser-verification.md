# Testing and browser verification

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
writing tests or declaring a UI change done.

**Do not claim the UI is correct because it compiles or unit tests pass.**
Meaningful UI changes need a rendered browser pass.

## Testing philosophy

- **TDD where appropriate** — red → green → refactor for behavior you can
  express as an automated test (especially logic, state machines,
  form validation, URL sync). Skip only when the approval says so or no
  meaningful harness exists; say so in the report. Don't force TDD
  ceremony on exploratory visual polish or a small spacing change — pair
  a direct browser look with the smallest useful test level instead of a
  full end-to-end test for something a unit or component test already
  proves.
- Test **observable behavior** (what the user or AT can perceive), not
  private implementation details (internal state shape, CSS class names
  that aren't contracts).
- Prefer **interaction / integration** tests for critical flows over
  shallow render snapshots of implementation markup.
- Include **accessibility assertions** the stack supports (roles, names,
  keyboard) plus a real keyboard pass in browser.
- Visual regression where the project already has it — don't invent a
  flaky screenshot suite mid-change.
- Cover **edge and error states** affected by the change, not only happy path.
- Don't chase coverage % for its own sake; cover the approved risk.
- The use cases, priorities, and states from the approved design (or the
  step-4 object/action model) are the candidate test list — turn each
  reachable state and primary use case into a check instead of testing
  only what the implementation happens to do.

Inspect the repo first and prefer its existing test framework and style
when it fits the work — don't stand up a parallel harness. When there is
no suitable framework already in place, or the existing tooling can't
cover the required behavior (browser-level interaction, visual
regression), see [Choosing a framework](#choosing-a-framework) below.

## Choosing a framework

Guidance, not a mandatory stack — reach for these only when the repo's
existing framework doesn't fit.

| Framework | Fits | When to reach for it | Limitation |
| --- | --- | --- | --- |
| **Playwright** | Real-browser E2E and component tests, multiple browser engines | Default for browser UI testing: user flows, navigation, visual regression, a11y snapshots | Slower than a unit test; don't use it to test pure logic |
| **Cypress** | Real-browser E2E, component tests | Already the project's E2E tool, or its time-travel debugging/watch loop is preferred | Single-tab/origin model is more restrictive than Playwright for multi-tab or cross-origin flows |
| **Vitest** | Unit and component tests, fast Vite-native runner | Logic, hooks, small component behavior — the smallest useful level for most changes | Not a substitute for a real-browser pass on layout/visual/interaction risk |
| **Jest** | Unit and component tests | Already the project's runner (common in non-Vite stacks) | Same scope limits as Vitest; slower cold start on large suites |
| **Testing Library** (`@testing-library/*`) | Component-level behavior queried the way a user/AT would (role, label, text) | Pairs with Vitest/Jest/Playwright component testing to keep assertions on observable behavior, not markup shape | Not a runner by itself; needs a host framework |

Prefer semantic selectors (role, label, text) and observable outcomes
over implementation details (CSS class, DOM structure, internal state) in
any of these.

**Agent-ready tooling:** Playwright ships an agent workflow — a
**planner** that explores the running app and writes a Markdown test
plan, a **generator** that turns the plan into runnable Playwright tests,
and a **healer** that reads a failing run and repairs broken selectors/
assertions. Bootstrap it with the Playwright CLI (`npx playwright
init-agents`, current flags/docs vary — check the installed version)
rather than hand-rolling the same loop. Useful when a change needs new
browser coverage or existing Playwright tests broke from a markup
change; don't reach for it just because it exists — the smallest useful
test level still wins for pure logic.

## Anthropic-style browser verification loop

When the app can run locally (or in a preview):

1. **Start or attach** to the running app (dev server or preview URL).
2. **Navigate** to the affected route; wait for the UI to be ready
   (`networkidle` or a specific selector — not a blind sleep alone).
3. **Reconnaissance** — inspect the rendered DOM (and/or accessibility
   snapshot); discover selectors from the live page, not only from source.
4. **Exercise the user flow** — click, type, keyboard, submit; cover the
   states the change implies.
5. **Console / page errors** — capture `console` error/warning and page
   errors during the flow; treat unexpected errors as failures.
6. **Screenshots** when useful for evidence (before/after, breakpoints,
   failure states) — store or attach per the caller's process.
7. **Responsive** — resize or set viewport to declared breakpoints.
8. Close the browser; report passed / failed / not run with reasons.

Pseudo-structure (Playwright-shaped; adapt to available tools):

```text
launch browser → goto route → wait for ready →
  discover controls → perform actions →
  assert visible outcomes + a11y names →
  collect console errors → screenshot if needed → close
```

Browser MCP / DevTools automation is fine when Playwright scripts aren't
set up — same loop, same evidence bar.

## What "done" requires (meaningful UI changes)

1. Relevant automated tests
2. Project build / type-check / lint as usual
3. App running where possible
4. Affected flow exercised in a real browser
5. Runtime / console errors checked
6. Keyboard / focus when interactive
7. Responsive sizes in scope
8. Loading / empty / error / edge states affected
9. Accessibility checks proportionate to risk
10. Performance measurement when performance is in scope
    ([performance.md](performance.md))

## Flakes and honesty

- Prefer role/label selectors (`getByRole`) over brittle CSS chains.
- Wait for conditions, not fixed multi-second sleeps as the only sync.
- If you can't run the browser (no server, no tool), mark verification
  **not run** with the reason — never imply it passed.

Cross-check UI modeling and full checklists in
[design-and-verification-checklist.md](design-and-verification-checklist.md).
