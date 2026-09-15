# Worked example: fixing a dependency boundary

```
This module reaches directly into another module's internals instead of
going through its public interface. Plan a safe way to fix the dependency
without changing any of its outputs — plan only, no code yet.
```

Expected approach: name the problem (the module bypasses the other module's
public interface), freeze invariants (every value and side effect currently
produced through the internal reach-in), inspect existing tests for those
call sites and plan characterization tests where coverage is missing, plan
redirecting the calls through the public interface in small per-call-site
steps each checked against the consuming code's current output, list
anything found that behaves like a latent bug as excluded follow-up work,
and return the plan.
