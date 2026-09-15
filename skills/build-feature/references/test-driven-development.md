# Test-driven development

On-demand detail for [../SKILL.md](../SKILL.md). Load this when running the
red-green-refactor loop, deciding whether a TDD skip applies, or reporting
verification evidence.

Prefer the project's existing test framework, fixtures, and naming — don't
invent a parallel harness. Name the practice you are following so the loop
stays deliberate.

## Named practices and patterns

### The loop

- **Test list** — before coding, write the concrete cases implied by the
  approved behavior (happy path, boundaries, named failures); pick one,
  finish it, then take the next.
- **Red–Green–Refactor** — failing test → smallest code that passes →
  clean structure while staying green. Skipping Refactor is a failed TDD
  outcome.
  ([Fowler](https://martinfowler.com/bliki/TestDrivenDevelopment.html))
- **Self-testing code** — a suite you can run with one command that you
  trust to catch regressions so small design improvements stay safe.
  ([Fowler](https://martinfowler.com/bliki/SelfTestingCode.html))
- **One step at a time** — drive one behavior (or one failing assertion
  set) per cycle; don't implement the whole feature before the first red.

### Getting to green

- **Obvious implementation** — when the solution is clear and tiny, write
  it directly to go green.
- **Fake it (till you make it)** — return a hard-coded value to go green,
  then generalize with the next test.
- **Triangulation** — add a second example that forces out duplication /
  hard-coding before generalizing.
- **Vertical slice** — prefer an end-to-end thin path through the real
  boundary when that's how peers test; otherwise stay at the layer they
  already unit-test.

### Testability seams (needed for TDD)

Unit-level TDD needs a way to run the unit without its real collaborators.
These two practices are how that usually works — match how the surrounding
code already wires and substitutes dependencies
([design-patterns.md](design-patterns.md)).

- **Dependency Injection** — pass collaborators in (constructor, params,
  or the project's container) instead of constructing them inside the
  unit. Without an injectable seam, tests can't substitute a double and
  end up hitting real I/O, clocks, or networks. When adding code under
  test, keep (or introduce only if peers already use) the same DI style
  neighboring units use — don't new up hidden dependencies that block
  the red–green loop.
- **Mocks and other test doubles** — stand-ins for those injected
  collaborators so each test controls inputs and observes interactions.
  Pick the double that matches the assertion you need (see below). Prefer
  the real collaborator or a project **Fake** when that still keeps the
  test fast and meaningful; use a **Mock** when the approved behavior is
  about how the unit talks to a neighbor (calls made, args, order), not
  only about a return value.
  ([Fowler — Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html))

### Test doubles

Name which double you are using:

- **Dummy** — unused filler argument
- **Stub** — returns canned data; no interaction verification
- **Fake** — working lightweight stand-in (e.g. in-memory repo)
- **Spy** — records calls for later assertions
- **Mock** — pre-programmed interaction expectations (behavior
  verification)

Don't introduce a new mocking library or DI container in a module that
doesn't already use one. Don't mock what you own when peers test it with
a Fake or the real object.

### Test shape

- **Arrange–Act–Assert** (or **Given–When–Then**) — set up (including
  injected doubles), exercise one behavior, assert outcomes; keep phases
  visible.
- **Four-phase test** — setup → exercise → verify → teardown; don't leave
  shared mutable state for the next test.
- **Test isolation** — each test stands alone; no order dependence, no
  reliance on another test's side effects. DI + doubles are how isolation
  is usually achieved at the unit level.
- **Behavior-focused assertions** — assert observable outcomes at the
  boundary under test, not private internals or incidental implementation
  details.
- **Boundary and equivalence cases** — cover typical values, edges, and
  invalid inputs the acceptance criteria name.

### Kinds of test to reach for

- **Unit test** — one unit with dependencies injected and controlled via
  doubles as peers do
- **Integration test** — real wiring across modules/DB/HTTP where the
  project already tests that way (fewer mocks; real or shared fakes)
- **Contract / API test** — request/response at the public boundary
- **Regression test** — locks a fixed bug or behavior so it can't return
- **Characterization test** — captures current behavior before changing
  unfamiliar code (use only when extending existing behavior safely)

## Default loop

1. Build the **test list** from the approved behavior.
2. Confirm the unit under test has (or will get, in local style) a
   **Dependency Injection** seam so collaborators can be substituted.
3. **Red** — write or extend one test with the needed **mocks/doubles**;
   confirm it fails for the right reason (missing behavior, not a broken
   harness or missing injection).
4. **Green** — smallest change that passes, matching existing code style
   and architecture ([design-patterns.md](design-patterns.md)).
5. **Refactor** — clean while green (including tightening injection or
   double setup if the test smell requires it).
6. Next case on the list until the approved behavior is covered.

## Skip gates

Skip automated TDD only when:

- The user or approval **clearly** says not to write tests, or
- A meaningful automated test is **not achievable** (e.g. complex UI with
  no existing harness, or no runnable test tooling in the environment)

"Slightly inconvenient," "would take longer," or "I'll test manually
instead" are **not** skips when a harness already exists for this area.

When skipped:

- Name the skip and the reason in the skill's report
- Still verify through the real boundary (manual or exploratory is fine
  when automation isn't achievable)
- Do not weaken or delete existing tests to create a shortcut

## Evidence to report

Unless a named skip applied, verification should show:

- The new or updated test **failed before** the implementation change
- The same test **passed after**
- Neighboring project checks that were run (and any that could not run,
  with reason)

Never mark a check passed without running it. Never weaken an assertion,
delete coverage, or approve a snapshot solely to go green.
