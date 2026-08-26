# Licence

**The Arda Archive — what this archive owns, and under what terms you may use it.**

Last measured and written: 26 August 2026.

---

## 0. Read this first

**Nobody involved in writing this file is a lawyer, and this file is not legal advice.**
It is a good-faith statement of what this archive believes it made, what it believes it did
not make, and what it is willing to let other people do with the part it made. It is not a
warranty, it is not a clearance, and it is not a claim that any particular use — ours or
yours — is lawful. If you are about to rely on this document for anything that matters,
take proper advice first. The archive's owner is advised to do the same before treating
this file as settled.

Where this file and reality disagree, reality wins and this file is wrong. If you find a
statement here that the tree does not support, that is a fault worth reporting — see §7.

---

## 1. What this file covers

This file governs **the `arda-archive` repository** — the published site: the pages you
read at `samsikallo.github.io/arda-archive`, the datasets behind them, the prose, the
stylesheets and the scripts.

The generator code that builds the site lives in a **separate repository**
(`arda-workshop`). Nothing in this file licenses that repository; it needs, and does not
yet have, a licence file of its own. The recommendation in §3 is meant to be applied to
both.

---

## 2. What the archive actually made

Measured on 26 August 2026, over the tracked contents of this repository and the
workshop tree that builds it.

### The written apparatus

- **16 Markdown documents**, 52,408 words — the reconstruction, the vector-map
  specification, the chronology, the contradictions register, the audits, the
  reckoning, the demography, and the rest. Written here.
- **653 HTML pages.** The prose on them — every rubric, every gloss, every "what was
  searched for and not found", every note on why a claim is graded as it is — is the
  archive's. The corpus lines set inside them are not; see §4.

### The datasets

- **97 `arda_*.json` datasets, 41.7 MB**, plus the per-record and per-hall JSON the
  pages load: **2,430 JSON files** in total.
- These are *derived* works: the genealogies, the concordance, the gazetteer, the
  apparatus, the timelines, the source register, the errata. Each was computed here from
  the corpus by code written here. The **selection, arrangement, grading and
  annotation** are the archive's work. The **corpus lines quoted inside them** are not,
  and the datasets carry those lines with a file-and-line citation precisely so a reader
  can tell the two apart.

### The code

- In this repository: **6 stylesheets (3,877 lines)**, **17 scripts (5,447 lines)**,
  3 Python modules, 1 shell script. No third-party JavaScript or CSS library is vendored
  into this repository; every script here was written for it.
- In the workshop repository: **456 Python modules, 137,684 lines**, of which
  **136 are `gen_*.py` generators** and the remainder are the guards, matchers and
  checkers that refuse a bad build.

### The drawings and the plates the archive made

- **20 ornament SVGs** and 11 further top-level drawings recorded as *"the archive's own
  hand"* — bosses, tailpieces, devices, rules.
- **8 SVG tracings** under `cl/` and one large traced sheet. **The tracing is the
  archive's; the linework traced is not** — see §4.
- **552 generated images** (portraits and hall art), produced by an image model driven by
  prompts written in this archive. **The archive does not assert copyright in these**, and
  §5 says why.

### The rulings record

The `RC1`–`RC39` series is often described as "the reconstructions". It is worth being
exact about what it is, because it is easy to mis-license: **`RC1`–`RC39` are
reconstructed entries in the project's decision ledger** — decisions the owner made
between 16 July and 18 August 2026 that were never written down at the time and were
recovered afterwards from transcript. They record **the owner's words and the owner's
decisions**, reconstructed by the archive. They live in `DECISIONS.md` in the workshop
repository, **not in this one**, and they are the owner's to license, not the archive's to
give away on his behalf.

*(A separate `RECONSTRUCTION.md` in this repository — 18,362 words of geographic
reconstruction — is archive-written analysis and is covered by §3.)*

---

## 3. The licence — recommendation

> ### Licence the archive's own work under **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.
>
> <https://creativecommons.org/licenses/by-sa/4.0/>

**Why, in two sentences.** Share-alike is the only term that matches what this archive
actually is: its value is not the facts but the apparatus around them — the citation, the
grading, the declared silence — and BY-SA is what stops a reuser stripping that apparatus
and republishing the bare assertions as if they were checked. It is also already the term
inside the tree: **184 published files here are CC BY-SA 4.0 derivatives** and a further
18 heraldic devices are BY-SA 3.0 or 4.0, so a more permissive licence on the archive's
own layer would sit on top of share-alike material and hand a reuser a position the
archive itself could not describe.

**One technical carve-out, not an alternative.** Creative Commons' own published guidance
is not to apply CC licences to software. So the **code** — the 6 stylesheets, 17 scripts
and 3 Python modules in this repository, and the 456 Python modules in the workshop — is
offered under
**Apache License 2.0** as well. This is not a choice put to the reader; it is one
recommendation with the correct instrument used for each half.

Nothing has been applied yet. **This file proposes; the owner decides.** Until he says
otherwise, no grant in this section is in force.

---

## 4. What this licence does **not** cover

Everything in this section is somebody else's, and no licence the archive grants can reach
it. The archive holds the registers named here so that each item can be checked
individually.

### 4.1 The quoted corpus

The archive's source register lists **260 works, 14,326,937 words**, graded across four
tiers. **140 of them are quoted on the published pages.** Those quotations are
**J.R.R. Tolkien's text, Christopher Tolkien's editorial work, and the work of many other
authors, editors and publishers.** The rights in them belong to their holders, none of
whom is this archive, and nothing in §3 grants anyone any right in them.

`ABOUT_THE_QUOTATIONS.md`, beside this file, sets out what is quoted, at what length, and
why.

### 4.2 The names and the marks

"Tolkien", the names of the persons, places and peoples of the legendarium, and the
invented scripts and languages are the subject of trademark and other claims by their
holders. The archive holds no licence in them and grants none.

**The Arda Archive is not affiliated with, endorsed by, approved by or connected to
The Tolkien Estate Limited, the Tolkien Trust, HarperCollins, Middle-earth Enterprises,
or any other rights holder.** It is an independent work of reference.

### 4.3 Tolkien's own drawings and heraldic devices

The archive's heraldry register holds **33 rows for heraldic devices drawn by
J.R.R. Tolkien himself**. Every one is marked *"© the Tolkien Estate — no licence is
held"* and **every one is marked not publishable, and none of them is in this
repository.** They are held to measure and describe from, never to reproduce.

### 4.4 Linework the archive traced but did not draw

- **8 SVGs under `cl/`** are tracings of **Christopher Tolkien's** linework.
- **`arda_baynes_sheet.svg`** is 25,805 centrelines traced from the poster map
  **Pauline Baynes** drew in 1969. Her hand-lettering is not traced.

Each is published on the archive owner's explicit direction, and the register says in its
own words that this **"is NOT a grant from the rightsholder."** The tracing is the
archive's work; the underlying drawing is not, and §3 does not reach it.

### 4.5 The typefaces

**24 web fonts** ship with this site, each under **its own licence, not this one**, with
**15 verbatim licence texts published beside them** under `fonts/`. In summary:

| Terms | Faces |
|---|---|
| SIL Open Font License 1.1 | 18 |
| Bare GPL, **with no font-embedding exception** | 1 (`TengwarTelcontar`) |
| Freeware, author asks it not be sold | 1 (`AngerthasMoria`) |
| "All Rights Reserved", published on the owner's ruling of 19 Aug 2026 | 2 (`Aniron`) |
| Permission granted to the archive's owner, no licence document | 1 (`TirionSarati`) |

The bare-GPL row is recorded as a **stated risk, not a resolved question.** It is one of
the items the owner should put to an adviser.

### 4.6 Reused freely-licensed images

- **184 files** in this repository are **CC BY-SA 4.0** — the sarati plates from Wikimedia
  Commons and the 120 cell-crops that inherit their parent plate's terms.
- **18 heraldic devices** are CC BY-SA 3.0 or 4.0; 5 are public domain.

These keep their own licences and their own attributions. Reusing them means honouring
those, not this file.

### 4.7 Images whose provenance is unknown

`machinery/UPLOADS_LICENCE.json` in the workshop repository, built 26 August 2026, holds
one row for every file supplied to the workshop as reference material:
**72 rows, of which 70 record `licence: UNKNOWN`.** Of those 72, **exactly one is
published** in this repository — and that one is the owner's own map, in his own words.
The register's own note is worth repeating: **a source on record does not clear a file.**
59 of the 72 name an author or a supplier and still read UNKNOWN, because who made a thing
and whether we may reproduce it are different questions.

A guard refuses to publish anything whose row says UNKNOWN. That guard is a mechanism, not
a permission: it stops a mistake, it does not confer a right.

### 4.8 One asset in this repository whose licence is not established

**`heraldry/glorfindel.png`** is third-party artwork, supplied to the workshop with
nothing on record as to whose hand drew it. Its own register row reads
`licence: NOT ESTABLISHED`, `author: NOT ESTABLISHED`. It is published on the owner's
explicit ruling of 21 August 2026, with the hand stated plainly as unknown. **It is not
the archive's to license, and §3 does not cover it.** It is named here rather than left
for a reader to find.

A further **43 heraldry rows** record a hand of literally *"unattributed"* with rights
confirmed by the site's owner. The rights answer exists; the *whose-is-it* answer does
not. §3 does not cover these either.

---

## 5. Generated images: a question the archive does not claim to have settled

**552 images** in this repository were produced by an image model from prompts written
here. The archive's position is stated as what it is and no more:

- **The prompts are the archive's work.** They were written here, from the corpus, and
  they are covered by §3.
- **The images are published on the archive owner's ruling of 13 August 2026** — his
  words: *"we are free to use them."*
- **The archive does not assert that it holds copyright in the outputs**, and nobody here
  is in a position to tell you whether anyone does. Whether machine-generated images
  attract copyright at all, and to whom, is unsettled and differs between jurisdictions.
  **We are not going to pretend otherwise in order to make this file tidier.**

Every one of the 552 carries a row naming the model that made it and the ruling that
published it. Read the row before relying on the image.

---

## 6. If you reuse the archive's work

Assuming §3 is adopted, honouring CC BY-SA 4.0 means, in practice:

1. **Credit** — "The Arda Archive (github.com/samsikallo/arda-archive)", and say what you
   changed.
2. **Link** the licence.
3. **Share alike** — anything you build on the archive's own layer goes out under the same
   terms.
4. **Strip nothing that is not ours to give.** The corpus quotations, the fonts, the
   BY-SA plates, the traced linework and the items in §4.7 and §4.8 travel under their own
   terms, or not at all. In particular: **the archive's licence is not a route by which
   quoted Tolkien text becomes freely reusable.** It does not become so.
5. **Do not present a reuse as connected to the Estate or to any publisher.** The archive
   is not, and a work built on it is not either.

---

## 7. Raising a concern

If you hold rights in something reproduced here and you would rather it were not, or if
you believe a statement in this file is wrong:

**Open an issue at <https://github.com/samsikallo/arda-archive/issues>.**

The archive is built by rebuilding: a page, a plate or a quotation can be withdrawn and
the whole site regenerated without it. **A concern raised in good faith will be acted on,
not argued with.** The archive would rather remove something and be wrong about it than
keep it and be wrong about it.

---

## 8. What this file is not

- Not a warranty of any kind. The archive is provided as it is.
- Not a legal opinion, and not written by anyone qualified to give one.
- Not a claim that any use described here is lawful.
- Not a claim of any relationship with any rights holder.
- Not final. Every count in §2 and §4 was measured on 26 August 2026 and will drift as the
  archive is rebuilt. The registers named throughout — `arda_assets.json`,
  `arda_heraldry_assets.json`, `arda_sources.json`, and `machinery/UPLOADS_LICENCE.json`
  in the workshop — are the current record; this file is a summary of them, and where they
  disagree with it, **they are right.**
