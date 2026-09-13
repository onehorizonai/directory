# Inspecting and filling AcroForm fields

## 1. Check whether the PDF has real form fields

Don't assume — a "form" that's actually a scanned image has no AcroForm
fields, and no library can fill it without OCR and coordinate placement
(out of scope for this skill; tell the user instead of guessing at
coordinates).

Python (`pypdf`):

```python
from pypdf import PdfReader

reader = PdfReader("form.pdf")
fields = reader.get_fields()
if not fields:
    print("No AcroForm fields found — this PDF is not fillable as-is.")
else:
    for name, field in fields.items():
        print(name, "-", field.get("/FT"), "-", field.get("/V"))
```

Node (`pdf-lib`):

```js
import { PDFDocument } from "pdf-lib";
import { readFile } from "node:fs/promises";

const pdfDoc = await PDFDocument.load(await readFile("form.pdf"));
const form = pdfDoc.getForm();
for (const field of form.getFields()) {
  console.log(field.getName(), field.constructor.name);
}
```

The printed name (e.g. `topmostSubform[0].Page1[0].f1_01[0]` for many US
government forms, or something human-readable like `full_name` for a
hand-built form) is the string you must use to set the value — it's rarely
the same as the visible label next to the field.

## 2. Map input data to field names

Field names on real-world forms are often ugly and inconsistent (see the
government-form example above). Build an explicit mapping from the
caller's data keys to the PDF's actual field names rather than assuming a
1:1 match; when a mapping is ambiguous (e.g. two checkboxes that both look
like they could mean "married"), ask rather than guess.

Field types matter for how you set a value:

- `/Tx` (text) — set a string.
- `/Btn` (checkbox/radio) — set to the field's "on" export value, not
  `true`/`"yes"` — read it via `field.get("/_States_")` in pypdf, or
  `form.getCheckBox(name).check()` in pdf-lib, which handles the export
  value for you.
- `/Ch` (choice/dropdown) — value must be one of the field's defined
  options.

## 3. Fill and save

Python (`pypdf`):

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("form.pdf")
writer = PdfWriter()
writer.append(reader)
writer.update_page_form_field_values(
    writer.pages[0],
    {"full_name": "Acme Consulting LLC", "tin": "12-3456789"},
    auto_regenerate=False,
)
with open("form-filled.pdf", "wb") as f:
    writer.write(f)
```

Node (`pdf-lib`):

```js
form.getTextField("full_name").setText("Acme Consulting LLC");
form.getTextField("tin").setText("12-3456789");
```

## 4. Flatten if the result should be final

Flattening bakes field values into the page content and removes the
interactive form — do this when the output is a finished document, not
when the recipient still needs to edit it.

`pypdf` itself has no reliable flatten step, so after filling and writing
`form-filled.pdf`, flatten with `qpdf` (keeps the page as real, selectable
text — unlike rasterizing tools, which would throw the text layer away):

```sh
qpdf --flatten-annotations=all form-filled.pdf form-flattened.pdf
```

Or with `pikepdf` (a pypdf-compatible library built on qpdf) from Python
directly:

```python
import pikepdf

with pikepdf.open("form-filled.pdf") as pdf:
    pdf.flatten_annotations(mode="all")
    pdf.save("form-flattened.pdf")
```

```js
form.flatten(); // pdf-lib: flattens all fields in place
await writeFile("form-filled.pdf", await pdfDoc.save());
```
