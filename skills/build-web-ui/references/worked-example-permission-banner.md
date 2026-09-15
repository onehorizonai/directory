# Worked example: read-only banner from a permission check

```
Update the account settings page to show a "read-only" banner and disable
all form fields when the current user's role lacks edit permission, per
the approved spec.
```

Expected approach: inspect the actual permission check the API already
enforces for this page rather than inferring it from the UI; reuse the
product's existing disabled-field and banner/alert components and tokens;
confirm the disabled state is exposed to assistive technology (not just
visually dimmed) and that focus order skips disabled controls sensibly;
verify both the permitted and read-only cases in a running browser,
including that the API still rejects an edit attempt server-side even if a
client bypasses the disabled UI.
