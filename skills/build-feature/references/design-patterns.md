# Design patterns and local architecture

On-demand detail for [../SKILL.md](../SKILL.md). Load this when choosing
among implementations, when the smallest candidate looks like a smell, or
when the change must fit an existing boundary.

This catalog is for **naming a pattern already present in the codebase**,
not a menu of patterns to introduce. Do not invent a new architecture or
drop in a named pattern the surrounding code doesn't use. Prefer the
patterns peers already follow. Name the pattern you are matching (or
extending) so the choice is deliberate. This list is **code-level** (how
units are structured and wired) — not deployment topology (microservices,
event-driven platforms, etc.).

## Named patterns to recognize and reuse

Use these names when inspecting the codebase and picking an option.
Prefer whichever of these (or a close local variant) is already present.

### Creational

- **Factory** / **Factory Method** — centralize “how do I build this?”
  when peers already do; don't add a factory for a single concrete type.
- **Abstract Factory** — family of related products created together,
  only where the codebase already groups creation that way.
- **Builder** — step-by-step construction of a complex object; match
  existing builder/fluent construction APIs.
- **Prototype** — clone an example instance instead of re-building from
  scratch when that is the local idiom.
- **Singleton** — one shared instance. Prefer the project's existing
  DI/container lifetime over a new hand-rolled singleton.
- **Dependency Injection** — collaborators are provided (constructor,
  parameter, or container) rather than constructed deep inside the unit;
  match how neighboring code receives dependencies. Essential seam for
  unit-level TDD
  ([test-driven-development.md](test-driven-development.md)).
- **Registry** — lookup of named handlers/validators/plugins; register
  the new case where similar cases already register.

### Structural

- **Adapter** — make an incompatible interface look like the one callers
  already expect.
- **Decorator** — wrap behavior (logging, auth, retries) the way existing
  middleware/HOCs/decorators do.
- **Facade** — a thin, stable face over a subsystem when peers already
  go through one.
- **Proxy** — stand-in that controls access (lazy load, auth, caching,
  remote) when that pattern is already in use.
- **Composite** — tree of objects treated uniformly (UI trees, menus,
  nested nodes).
- **Bridge** — split abstraction from implementation so both can vary —
  only when peers already separate those axes.
- **Flyweight** — share fine-grained immutable state across many
  instances when memory/sharing is already handled that way.

### Behavioral

- **Strategy** — interchangeable algorithms behind a shared interface or
  function table; prefer extending an existing strategy set over a new
  `if/else` ladder.
- **Template Method** — shared skeleton with overridable steps when a
  base/helper already encodes that flow.
- **Command** — encapsulate an action (and undo/metadata) when the
  codebase already queues or dispatches commands.
- **Observer** / **Pub-Sub** — react to events through the project's
  existing event bus or listeners; don't invent a parallel notification
  path.
- **State** — behavior changes with explicit states instead of flag soup,
  when the domain already models states that way.
- **Iterator** — walk a collection without exposing internals; use the
  language/runtime iteration peers use.
- **Chain of Responsibility** — pass a request along handlers until one
  handles it (middleware pipelines, validation chains).
- **Mediator** — objects talk through a hub instead of each other, when
  a mediator already exists for that graph.
- **Visitor** — add operations over a structure without changing the
  elements — only where visitors are already established.
- **Memento** — capture/restore object state (undo stacks) when peers
  already snapshot for undo/restore.
- **Interpreter** — represent grammar/rules as an object structure —
  rare; only if the codebase already has a rule/expression tree.

### Data and boundaries (Fowler-style)

- **Repository** — collection-like access to aggregates/entities; extend
  an existing repository rather than querying ad hoc from a higher layer.
  ([Fowler](https://martinfowler.com/eaaCatalog/repository.html))
- **Data Mapper** / **Active Record** — follow whichever persistence
  style the module already uses; don't mix both in one change.
  ([Data Mapper](https://martinfowler.com/eaaCatalog/dataMapper.html),
  [Active Record](https://martinfowler.com/eaaCatalog/activeRecord.html))
- **Gateway** — wrap an external system (HTTP, queue, vendor SDK) behind
  a narrow gateway whose interface looks like a normal object to the rest
  of the app; written by the client for its use (related to, but not the
  same as, Adapter/Facade).
  ([Fowler](https://martinfowler.com/eaaCatalog/gateway.html),
  [deeper write-up](https://martinfowler.com/articles/gateway-pattern.html))
- **Anti-Corruption Layer** — translate an awkward external model at the
  boundary instead of leaking foreign types into the core (often
  implemented as a Gateway).
- **Data Transfer Object (DTO)** — shape data across a boundary without
  leaking internal entities; match existing request/response types.
- **Snapshot** — a usually immutable, non-temporal view of an object as at
  a given date (e.g. `getAddress()` instead of `getAddress(date)`), often
  via delegation — use when peers already model temporality and need a
  fixed-time view. Not the same as snapshot *testing*.
  ([Fowler](https://martinfowler.com/eaaDev/Snapshot.html))

### Domain and everyday code shapes

- **Value Object** — immutable equality-by-value types for money, IDs,
  ranges, etc., when the domain already uses them.
- **Null Object** — a no-op stand-in instead of scattered null checks,
  only where that pattern already exists.
- **Specification** — composable business rules as objects/predicates
  when peers already express rules that way.
- **Fluent Interface** — readable chained calls
  (`query.where().orderBy()`) when that is the local API style.
- **Service Layer** — application operations live in services that
  coordinate domain/persistence; put multi-step use cases there if that's
  where peers put them.
  ([Fowler](https://martinfowler.com/eaaCatalog/serviceLayer.html))
- **Domain Model** — rich domain objects own business rules when the
  codebase already models that way; don't dump new rules into controllers.
  ([Fowler](https://martinfowler.com/eaaCatalog/domainModel.html))
- **Transaction Script** — procedural per-use-case scripts when that's
  the local style; don't invent a domain model for one new endpoint.
  ([Fowler](https://martinfowler.com/eaaCatalog/transactionScript.html))

### Only if the codebase already uses them

These organize code across layers; still not deployment architecture. Use
them only when already present — don't introduce them for one feature.

- **Layered architecture** — keep presentation, application/service,
  domain, and persistence concerns in the layers peers already use.
- **Ports and adapters (hexagonal)** — add the feature behind the same
  port and adapter style; don't call infrastructure from the domain if
  peers don't.

## Match what is already there

Before writing code, identify and reuse:

1. **Code style** — naming, file/module layout, import order, error-handling
   idioms, logging, comments, typing conventions, and formatter/linter
   expectations already enforced in neighboring files. Match them; don't
   introduce a personal style in the same module.
2. **Patterns in use** — which named pattern above (or local equivalent)
   owns similar behavior, and which call path peers use. Put the new
   behavior on that same path.
3. **Extension points** — existing validation helpers, shared query-param
   parsers, factories, registries, or strategy tables. Prefer extending
   those over a closed one-off branch.

If the codebase has no clear pattern yet, keep the change small and local
rather than introducing a framework-level pattern "for later."

## Smells that disqualify the "smallest" option

Treat these as reasons to reject a candidate even if it is shorter:

- Duplicated logic that already exists nearby (extract a shared function
  or strategy instead of copy-paste)
- Long method or god module grown one `if` at a time
- Magic values instead of named constants or existing enums
- Silenced errors / empty catches that hide the real failure
- Feature envy or reaching across a layer the codebase otherwise respects
- A special-case branch that bypasses the shared validation, registry, or
  DI wiring peers already use
- A workaround that papers over the wrong layer (e.g. UI compensating for a
  missing API contract)
- New abstractions (extra interfaces, factories, layers) that no second
  caller needs yet

## Future-proof without YAGNI

Future-proof means:

- Use the extension point peers already use (registry, strategy, DI seam,
  shared validator) so the next similar change plugs in the same way
- Prefer open variation the codebase already supports over a hard-coded
  closed special case

It does **not** mean:

- Adding an unused interface, factory, or abstraction layer "just in case"
- Introducing a named pattern from this list the surrounding code doesn't
  use
- Broad cleanup or rename drives outside the approved behavior

## Choosing among options

Among candidates that satisfy the approved behavior:

1. Discard any that fight local style or the pattern already in use
2. Discard any that are smells or one-offs the next change would rip out
3. Among the remainder, take the smallest

When a small behavior-preserving extract (shared function, strategy entry,
repository method) makes the clean option safe, do that move for the
feature — not a drive-by rewrite.

If every remaining candidate is a smell or fights local architecture, stop
and report the conflict rather than shipping the least-bad hack.
