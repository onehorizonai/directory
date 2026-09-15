# Worked example: pending-invite management

```
Support wants a way for an admin to see which team members haven't
accepted their invite yet and re-send or revoke it. Plan the UX for this
before we build it.
```

Expected approach: model the actor (admin), object (pending invite) and
its lifecycle states (sent, expired, accepted, revoked), the actions
available in each state, derive use cases (find pending invites, re-send,
revoke) and prioritize them against how often support says this comes up,
work through what information the admin needs to decide (who, how long
pending) and where this list should live relative to existing team
management, then produce verification scenarios for re-send and revoke
covering the happy path and the case where the invite already expired.
