# THE AUDIT — Phases 4–5 of the re-ingestion
### The archive's claims machine-checked against the full extracted corpus (5,615,333 words).

## What was checked
- **521 dated claims** (105 chronology event-years, 390 genealogy birth/death-years, 26 campaign-years) verified by direct text search across era-appropriate volumes, including App A's abbreviated year-spans ('2804–64').
- **541 entities** concordanced across all 28 volumes (77,372 mentions located) — every archive person, place, battle and treasure now traceable to the books that speak of it.
- Structural cross-consistency (edges, actors, links, bounds) re-run clean.

## Findings & classification (per the audit brief)
- **Canon-accurate:** 483 of 521 dated claims text-verified directly; all structural checks clean.
- **Chart-borne canon [C-chart]:** 36 dates (Durin's-line and App C hobbit family trees) live in chart-images the text extraction cannot read; several are independently text-attested by the Complete Guide [corpus-secondary]. Kept, with this classification documented.
- **Under-sourced (corrected):** Laura Grubb's birth/death years and Farmer Cotton's death-year could not be grounded in text or confident chart-reading — precision removed from the trees rather than kept.
- **Errors found & fixed across all audits to date:** the Third Kinslaying at 525 → **538** (WoJ Tale of Years' final layer); Dáin's 500 → 'more than five hundred'; hwesta's Westron value kh → **ch**; a mis-lemmatized name-element; the halla omission; ~35 map-pin calibrations; two ungrounded hobbit dates (this pass).
- **Over-confident inferences (downgraded):** none newly found this pass; earlier passes' confidence labels stand.

## Restructuring delivered
The re-ingestion's products are now part of the archive itself: CORPUS_INDEX.md (Phase 1 structure), arda_concordance.json + the records' new 'In the books' panels (Phase 2 bidirectional links), CONTRADICTIONS.md + arda_contradictions.json (Phase 3 register), and this report (Phases 4–5).

## Standing limits, stated
A language model cannot truthfully claim to have re-read five million words with human attention; this audit is **mechanical where mechanical wins** (dates, mentions, structure) and **targeted where judgment is needed** (flag adjudication, contradiction classification). The gaps that remain are in The Silences, where they belong.
## Addendum (2026-07-23, the corrections pass)
- **Faramir's death**: previously open-ended. PM ('The Heirs of Elendil' commentary) dates it in the redrawn Dol Amroth genealogy: **3103 = F.A. 83** — applied as [C] to the family trees and the chronology.
- **Éowyn's death**: no year anywhere in the corpus (a rejected WotR draft killed her on the Pelennor). Estimated **c. F.o.A. 65 [I-L]** from Rohirric royal spans (Théoden 71, Éomer 93) and her line's Lossarnach strain; labeled as estimate in both halls.
- **realms.html regression**: the artifacts-header cloning broke after the nav rework (regex over-capture → truncated script). Root-cause fixed by a canonical header partial (map/hdr_partial.html); console-level QA (map/qa_console.sh) added — the DOM-grep method could not see this error class.
