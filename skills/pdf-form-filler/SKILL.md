---
name: pdf-form-filler
description: >-
  Use when the user has a fillable PDF form (AcroForm) and wants its fields
  filled from structured data — a JSON/CSV record, a spreadsheet row, or
  values described in the conversation — instead of typing into each field
  by hand. Also use when the user asks what fields a PDF form contains
  before filling it.
metadata:
  title: PDF Form Filler
  tagline: Fill out PDF form fields programmatically from structured data.
  category: productivity
  tags:
    - pdf
    - forms
    - automation
---

## Overview

Most "fillable" PDFs (tax forms, applications, contracts, intake forms) are
AcroForms: the PDF itself carries named form fields, and any AcroForm-aware
library can read and write those fields directly without touching page
graphics. This skill covers the workflow for filling such a PDF from
structured data: inspect the form to find its real field names, map input
data onto those names, write the values back, and hand back a completed
PDF — flattened (values baked into the page, no longer editable) if the
user needs a final document, or left as a live form if they'll keep
editing it.

It does not cover scanned/flat PDFs with no AcroForm fields — those need
OCR and coordinate-based text placement, which is a different (and much
less reliable) problem; say so if a form turns out to have no fields
rather than guessing coordinates.

## When to use

- The user provides a PDF form and a data source (JSON, CSV, a spreadsheet
  row, or values typed directly in chat) and asks to fill it in.
- The user has the same form to fill many times from a list of records
  (batch filling) and wants one PDF per record.
- The user asks "what fields does this PDF have?" or "what are the exact
  field names in this form?" before supplying data.
- The user wants a filled form flattened into a static, non-editable PDF
  for sending or archiving.

Don't reach for this skill if the PDF has no fillable fields at all (a
scanned image or a form with no AcroForm) — check first per
[references/field-inspection.md](references/field-inspection.md), and tell
the user if that's the case instead of attempting to fill it.

## Examples

```
Fill out this W-9 with:
- Name: Acme Consulting LLC
- Business type: LLC, taxed as partnership
- Address: 123 Market St, Springfield, IL 62704
- TIN: 12-3456789

[attached: w9-blank.pdf]
```

Expected approach: list the form's field names first
(see [references/field-inspection.md](references/field-inspection.md)), map
each supplied value to the matching field (asking the user if a mapping is
ambiguous, e.g. multiple similarly-named checkboxes), fill the form, and
return `w9-filled.pdf`.

```
Here's a list of 40 vendors (vendors.csv) and a blank onboarding-form.pdf.
Fill one copy per vendor and flatten each one.
```

Expected approach: inspect the form once, confirm the CSV column headers
map cleanly onto field names, then loop over rows producing
`onboarding-form-<vendor-slug>.pdf` for each, flattened since these are
final documents.
