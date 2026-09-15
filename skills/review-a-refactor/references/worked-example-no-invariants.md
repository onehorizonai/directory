# Worked example: no invariants stated

```
Review this branch against main. The commit message says "refactor: split
the 800-line UserService into smaller modules, no behavior change." No
written invariants were given.
```

Expected approach: fix the range (branch vs main), derive invariants since
none were stated — read UserService's current public methods, callers, and
existing tests to establish what "no behavior change" must mean here; check
scope purity for anything beyond splitting (e.g. a changed permission check
tucked into the new module boundaries); check equivalence for each public
method's return values, side effects, and any ordering between the new
modules; read the full test diff for tests that were split apart in a way
that dropped an assertion instead of just relocating it; judge whether the
split actually reduced the original problem (one 800-line file) rather than
just moving the same tangle into multiple files that still call each other
directly; validate suspected issues against the code and test suite before
reporting; and state clearly if any invariant had to be assumed because none
was given.
