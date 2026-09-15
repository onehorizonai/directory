# Worked example: partially unreachable environment

```
Verify the claimed-complete "export to CSV" feature. Acceptance criteria
say the export must include all visible columns and match the current
filter/sort state. The CI environment for this repo has no access to the
production database used for the export job.
```

Expected approach: map both criteria to checks — columns/order for the
first, filter/sort parity for the second — and run what can be run against
a reachable environment (e.g. a staging dataset or local fixture); for the
part of the export path that depends on the production database that
isn't reachable, report that portion as not verified with the specific
access gap named, rather than assuming it behaves like the reachable
environment or reporting it as passed.
