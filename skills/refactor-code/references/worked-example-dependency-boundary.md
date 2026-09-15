# Worked example: fixing a dependency boundary

```
This module reaches directly into another module's internals instead of
going through its public interface. Fix the dependency without changing
any of its outputs.
```

Expected approach: name the problem (the module bypasses the other
module's public interface), freeze invariants (every value and side effect
currently produced through the internal reach-in), check whether existing
tests cover those call sites and add characterization tests where they
don't, redirect the calls through the public interface in small steps,
inspect the diff and full test-diff after each step, and verify the
consuming code's outputs are byte-for-byte the same as the baseline before
reporting.
