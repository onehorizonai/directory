# Worked example: comparing two technical options

```
Compare Postgres logical replication vs Debezium/CDC for near-real-time
sync into a search index, for our use case (single-region, <10ms lag
target, existing Postgres 15 cluster).
```

Expected approach: identify primary sources for each option (Postgres docs,
Debezium docs, relevant RFCs/issues), read them rather than summary
articles, normalize claims to the stated constraints (region, lag target,
Postgres version), check for contradicting claims about lag or operational
overhead, and return a recommendation with the evidence and any unresolved
disagreement stated separately — not folded into one paragraph.
