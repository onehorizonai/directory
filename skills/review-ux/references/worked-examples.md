# Worked examples

The procedure applied to a proposed (unbuilt) target and an implemented one.

## Proposed target: wireframe

```
Here's a wireframe for a new "project archive" flow (attached). Review it
for UX problems before we build it.
```

Expected approach: fix the wireframe as the target, one version; establish
the model from it and from how "project" is handled elsewhere in the
product — actors (owner, member, viewer), the project object and its
active/archived states, the archive/restore actions, and the prioritized
use case (archive a project without losing access to its data); walk that
use case for entry point, whether the consequence (can members still see
it?) and reversibility (can it be restored?) are clear, and the empty and
error states; check whether "archived" is visually distinguished
consistently with other states in the product; nothing is built yet, so
trace the walkthrough through the wireframe and note that explicitly;
separate a confirmed problem (no restore action shown anywhere) from a
question (is archiving reversible for all roles, or only owners? — unclear
from the wireframe) before reporting.

## Implemented target: staging build

```
Review the new bulk-tagging feature on the /library route (staging, build
def456) — does it fit how the rest of the app handles multi-select actions?
```

Expected approach: fix the target (staging, that route, that build);
establish the model from the library's existing single-select actions and
any stated requirements for bulk tagging; identify the prioritized use case
(tag many items at once) and its states (0 selected, 1, some, all); inspect
the real running page and exercise the use case — select several items, add
a tag, check the result and undo path; build a state × action matrix if the
bulk actions differ meaningfully between "some selected" and "all
selected"; check whether the bulk toolbar's placement and prominence match
how other primary actions are surfaced in the app, and whether its
container/spacing choices reinforce that hierarchy or just add a visual
boundary; validate any suspected issue against the running page or
existing patterns before reporting; report confirmed problems (e.g. no way
to undo a bulk tag) separately from a judgment-based recommendation (e.g.
the toolbar could sit closer to the selection count for scanability) with
its reasoning stated.
