# Worked example: Android multi-select surviving rotation

```
Add multi-select to the existing Android contacts list, per the approved
design: long-press selects an item, a selection toolbar appears, and the
selection and scroll position must survive rotation and returning from
the backgrounded app.
```

Expected approach: inspect the existing list's state-hoisting pattern and
where scroll position is currently tracked; hoist selection state the same
way and persist both selection and scroll position across
configuration change and process death using the app's existing
`SavedStateHandle`/state-restoration pattern; verify with TalkBack, a
rotation check, and a background/foreground round-trip on an emulator or
device.
