# Worked example: Android lifecycle/accessibility review

```
Check the Android contacts-list multi-select flow for accessibility and
lifecycle issues. It should survive rotation and returning from a
backgrounded app.
```

Expected approach: fix the target (Android, the contacts-list screen, the
multi-select flow, stated min OS); inspect the real running flow on an
emulator or device; verify selection state and scroll position actually
survive rotation and a background/foreground round-trip; verify TalkBack
can reach and describe the selection toolbar and touch targets meet the
platform minimum; validate each suspected issue against the running app
before reporting it; state explicitly if TalkBack access wasn't available
for part of the check rather than omitting that gap.
