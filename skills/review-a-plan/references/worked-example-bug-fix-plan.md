# Worked example: bug-fix plan with a claimed root cause

```
Review this bug-fix plan. It says the root cause is a race condition in the
webhook retry handler and proposes adding a lock. No test plan is included.
```

Expected approach: fix the plan version and the original bug report as the
baseline; check the claimed root cause against the actual retry handler
code rather than accepting it as given; check whether the proposed lock
addresses that root cause or only a symptom; flag the missing verification
mapping as a confirmed gap since a race-condition fix with no reproduction
or test plan is a step no one else could confirm as done; check for a
missing rollback/approval point given the change affects concurrency
behavior; and report the verdict as "not ready" if the root cause can't be
confirmed from the code, naming exactly what evidence would confirm it.
