# Worked example: intermittent failure

```
Some users see their dashboard widgets randomly reorder after a page
refresh, roughly one in ten refreshes. No error is thrown. Debug and fix
it.
```

Expected approach: record the reproduction rate (~1 in 10) and stabilize
what can be stabilized (same account, same widget set, same browser) to
raise it; read the widget-ordering code and recent changes to it; compare
a stable session against an unstable one; test hypotheses one at a time
(an unstable sort, a race between two writes of the same preference, a
missing tiebreaker) until one is confirmed by evidence; apply the smallest
fix for that specific cause; rerun the original repro across enough
refreshes to trust the result and add a regression test asserting stable
order. If the existing end-to-end suite can't run in the available
environment, report that check as not verified with the reason, rather
than counting it as passed.
