# SMART ANTI-FLOOD AI — Project Review (MVP / Hackathon Demo)

> Review date: 2026-10-08 (competition section added 2026-10-11) · Scope: repository at commit `02e4f0a`; §6 and §7 reflect the `dev` branch
> Method: a full code read by the lead reviewer, then two independent agents argued opposite sides (**Advocate**: pros, **Critic**: cons). Every claim was backed with file:line evidence, and the key claims were re-verified.
> Build status: `tsc --noEmit` ✅ passes · `vite build` ✅ passes (431 KB JS / 121 KB gzip)

---

## 1. What the project is meant to do

**SMART ANTI-FLOOD AI** by student team **NEWTON AI** (Trường THCS & THPT Newton, Hà Nội) is an entry in a student science and engineering contest. Its slogan is *"PHÁT HIỆN SỚM – CẢNH BÁO SỚM – HÀNH ĐỘNG SỚM"* (detect early, warn early, act early).

**Problem:** Hanoi streets flood during heavy rain, often because storm-drain inlets are covered by trash and leaves. Drainage crews usually find out only after residents complain or water is already 30–50 cm deep.

**Proposed solution:** use street cameras (existing CCTV) and an image classifier to spot blocked drains *before* water rises. Combine that with rain and water-level readings to decide the risk, then dispatch a crew and check that the drain was actually cleared.

### End-to-end pipeline

```
Camera / Uploaded image
   └─► ROI crop of drain mouth → 224×224          (services/teachableMachine.ts: cropToROI)
        └─► Teachable Machine image classifier    (CLEAR | TRASH_NEARBY | PARTIAL_BLOCKED | BLOCKED)
             │    (or a labelled MOCK prediction when no model is connected)
             ▼
Rain mm/h (simulated slider) + Water level % (simulated slider)
             ▼
Deterministic Rule Engine → NORMAL | WATCH | WARNING | HIGH   (services/ruleEngine.ts — explicitly "not AI")
             ▼
Alert panel → Create Ticket (snapshot + readings) → Assign → In progress
             ▼
Re-check with camera: CLEAR ≥ threshold → RESOLVED (feedback loop) + History log
```

### Tech and structure
- React 19 + Vite + Tailwind 4 SPA with a Vietnamese UI and no backend. State lives in a single `AppContext` and is saved to `localStorage`.
- tf.js and `@teachablemachine/image` are loaded from a CDN in `index.html`. The model is connected at runtime by pasting a public Teachable Machine URL.
- There are 10 tabs: Overview, Camera/AI, Rain simulator, Alerts, Tickets, History, Hanoi media, AI Explain, Settings, About.
- A **Demo Mode bar** walks judges through 7 scripted steps, from heavy rain through a blocked drain and a ticket to the resolved drain.

---

## 2. Lead reviewer's summary of good and bad points

| 👍 Good | 👎 Bad |
|---|---|
| Complete detect → decide → act → verify loop | The Demo Mode script disagrees with the engine on 4 of the 6 steps that set inputs |
| Honest split between "AI" and "rules", with mock mode clearly labelled | In mock mode the "AI" just echoes the class picked beforehand, so any uploaded photo shows the same result |
| Explainable decisions (reasons, matched rule ID, recommended action) | A real model only works if its class names exactly match `CLEAR/BLOCKED/...`; otherwise alerts fail silently |
| Stage-safe: works offline from the model, with mock fallback | Unpinned `@latest` CDN scripts; large uploaded images can overflow `localStorage` |
| Zero cost, edge/in-browser inference, privacy friendly | Leftover template code (unused `@google/genai`/`express`, `react-example`, Rickroll `youtubeId`) and no README or tests |
| ROI cropping shows real CV understanding | Small learned AI component; rain and water level are sliders only |

---

## 3. Advocate's case (PROS)

**Ranked strengths**

1. **The full loop works end to end. Few student demos manage this.**
   - Flow: ROI crop (`teachableMachine.ts:261-303`) → classifier (`:308-335`) → rule engine that recomputes reactively (`AppContext.tsx:418-438`) → ticket with snapshot, readings and a history entry (`AppContext.tsx:441-510`).
   - Resolving a ticket is gated on the AI seeing CLEAR at or above the confidence threshold (`TicketManager.tsx:55-79`).
   - This shows systems thinking, not just a classifier demo.
2. **It is honest about what is AI.**
   - `ruleEngine.ts:5-6` states that the rule engine is *"KHÔNG PHẢI LÀ AI"* (not AI).
   - The AI Explain page has a terminology table (`AIExplainView.tsx:210-235`).
   - The rain page marks its data as simulated (`RainSimulator.tsx:261`).
   - Mock mode is labelled in the header, the camera view and the analysis banner, and mock results carry an `isMock` flag.
   - Science-fair judges punish AI-washing; this team avoids it.
3. **Every decision can be explained.** Each result carries `reasons[]`, `matchedRules[]` and `actionRecommendation`. Rules are short and in priority order, and a low-confidence prediction cannot trigger rule HIGH_01 on its own. A city works team can audit "rule X fired because of A+B".
4. **The demo survives the stage.**
   - Mock predictions have realistic jitter and are normalised so the probabilities sum to 1.
   - If a saved model URL fails, the app silently falls back to mock.
   - The 7-step scripted demo sets the inputs for each step.
   - Every `localStorage` call is wrapped in try/catch.
   - Venue Wi-Fi, CORS and webcam failures do not kill the pitch.
5. **ROI cropping is a real CV design choice.** It crops to 224×224 with clamped bounds and offers a whole-image fallback. The Explain page says why: a full street frame distracts the model.
6. **No backend and no cost.** Inference runs in the browser, so there are no API keys, no image uploads and nothing to pay for. It can be hosted as a static site, which fits a ward budget and points toward edge devices.
7. **Easy to extend.**
   - Swap the model by pasting a URL. The URL is normalised and class names are read from the model's metadata.
   - Thresholds are settings, not code.
   - The UI already names the upgrade path: rain gauge, ultrasonic level sensor, ESP32 or Arduino.
8. **It has the start of a scientific method.** The data structures for a dataset test mode are in place (but see Critic #8).
9. **Polished and localised.** Fully Vietnamese UI, confetti when a ticket is resolved, a Hanoi media page, and a clean build.

**Rebuttals to expected criticism**
- **"Sensors are fake."** That is true and stated on screen. The new idea is visual drain-blockage detection; sensors are standard parts for v2, and the engine's input interface already fits them.
- **"Mock means the demo is fake."** Mock is a labelled fallback, and the real-model path is fully built.
- **"Teachable Machine is a toy."** It is the right tool for a student team to train and retrain a model themselves.
- **"Rules instead of ML for risk."** There is no labelled flood-outcome data, so a learned risk model would be overfitting theatre. Rules are auditable.
- **"localStorage, no backend."** That fits an MVP. The ticket and history structures could move to REST or Firebase without UI changes.
- **"Loose ends."** The demo-preset mismatches, `@latest` CDN versions and `tickets.length` numbering are each a fix of one to a few lines. None breaks the architecture.

---

## 4. Critic's case (CONS)

### A. Critical for the live demo
1. **The Demo Mode script disagrees with the engine.** *(Verified by running the engine.)*
   - Steps 1 and 2 (rain 55, water LOW, CLEAR) produce **WATCH**, but the script says NORMAL / "not yet alerting".
   - Step 3 (rain 55, water MEDIUM, TRASH_NEARBY) produces **WARNING**, but the script says WATCH.
   - Step 7, the finale (rain 25, water LOW, CLEAR), produces **WATCH**, but the script says NORMAL.
   - `expectedRisk` is never displayed or checked (`AppContext.tsx:47-120` against `ruleEngine.ts:61-138`).
   - *Fix:* use rain < 20 for steps 1, 2 and 7 and water LOW for step 3, or rewrite the hints. Add an assertion that each step's engine result equals its `expectedRisk`.
2. **Uploaded photos can overflow `localStorage`.**
   - The uploader accepts files up to 10 MB as raw base64 (`ImageUploader.tsx:57,82`), and that string is copied into the ticket (`AppContext.tsx:467`).
   - With a quota of about 5 MB, `saveTickets` throws, and the error is only logged with `console.error`. The ticket disappears on refresh.
   - *Fix:* downscale to about 640 px JPEG, or store only the 224 px crop, and warn the user when a save fails.
3. **Unpinned CDN scripts.** `tfjs@latest` and `@teachablemachine/image@latest` are loaded in `index.html:15-16`. tmImage has known incompatibilities with newer tfjs, so a release on demo day could break the real-model path. *Fix:* pin the versions or vendor the files locally.
4. **Class names must match exactly.**
   - The engine does an exact string compare (`ruleEngine.ts:63-66`), and the model's `p.className` is passed through raw.
   - A model trained with labels like "Blocked", "Cống tắc" or "Class 1" never escalates. `'Blocked'` with rain 55 gives only WATCH.
   - *Fix:* normalise and map the labels, and warn when connecting if the four expected labels are missing.
5. **Demo mode and a real model fight each other.** The presets write mock predictions, but the camera loop overwrites them every 600 ms while a real model is connected (`CameraView.tsx:125-127`).
6. **The camera loop is churny.**
   - `isProcessingCameraFrame` is in the callback's deps, so the interval is torn down and recreated on every frame.
   - The loop calls `toDataURL` every 600 ms, even in mock mode.
   - The context value is not memoised, so the whole app re-renders about twice a second.

### B. Credibility with judges
7. **In mock mode the "AI" echoes a preselected class.**
   - Any uploaded image returns `generateMockPrediction(mockClass)` (`ImagePreview.tsx:83-85`). A selfie shows "BLOCKED 91%" by default.
   - The sample images are SVGs with the answer printed on them.
   - "Simulate cleanup" writes "Camera AI xác nhận CLEAR 96%" without checking anything (`TicketManager.tsx:81-96`).
8. **The dataset test is circular and has no UI.** In mock mode it predicts the expected class and then compares it with the expected class, which is always 100%. `datasetTestItems` is not used by any component. There is no real accuracy number.
9. **The app starts in a seeded HIGH alert.**
   - It opens with rain 55, water 85% and BLOCKED, and ticket #0001 plus 4 history rows are hardcoded.
   - Demo step 6 says "Xem Ticket #0001", but it actually creates #0002.
10. **Media attribution.**
    - An Unsplash stock photo is credited as *"Khảo sát thực địa NEWTON AI"* (`storage.ts:47`).
    - The listed video entries have no media behind them.
    - The default `youtubeId` is `dQw4w9WgXcQ` (a Rickroll).
11. **The AI share is thin.** The only learned part is a classifier loaded from a URL. The repo has no model, no training data and no metrics, and rain and water are sliders.
12. **Inconsistencies inside the rule engine.**
    - The reason text uses `>=` for the high-rain threshold but `isRainHigh` uses `>` (`ruleEngine.ts:48` against `:61`). At 50 mm/h the text says the threshold was crossed, but rule HIGH_01 does not fire.
    - Confidence only gates rule HIGH_01. A 50%-confidence BLOCKED prediction still escalates through the water-HIGH rule.
    - The comment does not match the code for the WARNING rule.

### C. Code quality
13. **Template leftovers.**
    - Unused `@google/genai`, `express` and `dotenv`.
    - Build tools listed under runtime `dependencies`.
    - Package name `react-example`, and `metadata.json` still says "Remix …" and lists `SERVER_SIDE_GEMINI_API`.
14. No tests, no README, and only 2 commits.
15. **Stale closure.** `runDatasetTestItem` reads `datasetTestItems` from its closure, so a batch run right after adding items can stay stuck on ANALYZING.
16. **Fragile numbering.** Ticket numbers come from `tickets.length + 1`.
17. **Side effects in a state updater.** `nextDemoStep` calls `applyDemoStepPreset` inside a `setState` updater while StrictMode is on. It is idempotent today, but it is an anti-pattern.

---

## 5. Verdict

As a **hackathon / science-fair MVP the concept and architecture are strong**: a complete, explainable, honest, zero-cost loop with a well-chosen AI scope. Both sides agree that the main weaknesses are **demo-script consistency and credibility** rather than architecture. Most fixes are small.

The biggest risk is that a judge reads the demo hint ("NORMAL"), sees **WATCH** on the badge, or uploads an unrelated photo in mock mode and gets "BLOCKED 91%". Either moment can undo the trust the honesty-focused design built.

### Priority fix list before judging
| # | Fix | Effort |
|---|---|---|
| 1 | Make the demo presets and `expectedRisk` match the engine (steps 1, 2, 3 and 7), and add a test for it | ~15 min |
| 2 | Normalise TM class labels, and warn on connect if any of the 4 expected labels is missing | ~30 min |
| 3 | Pin tfjs and tmImage versions in `index.html`, or vendor them | ~5 min |
| 4 | Downscale uploaded images before storing, and show a toast when a save fails | ~30 min |
| 5 | Mock mode: show a clear "MOCK — preset class" label on uploaded-image results; make "simulate cleanup" go through the real CLEAR check | ~20 min |
| 6 | Bring a **real** held-out accuracy number or confusion matrix for the trained TM model (biggest credibility win) | team work |
| 7 | Fix the `>` vs `>=` rain threshold; decide whether confidence should gate every BLOCKED rule | ~10 min |
| 8 | Remove the template leftovers (unused deps, `react-example`, Rickroll ID, the "field survey" caption on a stock photo), and add a README | ~20 min |
| 9 | Use a ref for the camera loop's busy flag; memoise the context value | ~15 min |


### Status on `dev` (2026-10-11)
Done on `dev`: #1, #2, #3, #4, #5, #7 (the reason text now matches `>`), #8 and #9, plus a `bun run test` check for the demo steps. Still open: **#6 (real accuracy numbers)**. The "no README / 2 commits" remark in §1–§4 is outdated; a README exists now. §3's "works offline from the model" claim is wrong, because tf.js still loads from a CDN. One engine/table mismatch also remains: the Alerts table in the UI does not list every WARNING and HIGH path in `ruleEngine.ts`.

---

## 6. UI / storytelling review and changes made (dev branch)

### What the UI got wrong about *conveying the idea*
- **The core idea was never shown.** The idea is that trash blocks the drain, water can't drain away, and the road floods, but the Overview only showed text, badges and a box diagram. A judge had to read a lot before understanding the mechanism.
- **The value proposition (early instead of late) was only stated in text** on the About page, never shown visually.
- **Too much shouting.** All-caps labels, emoji and an icon side by side on almost every label (e.g. `📷` plus a Camera icon), and `animate-bounce`/`animate-pulse` on several elements at once. Nothing stands out when everything does.
- **The pipeline diagram was wrong for 2 of 4 levels.** The "Alert" node showed a green "🟢 AN TOÀN" (safe) for any level other than HIGH, including WARNING.
- **Demo Mode contradicted itself.** See §4 A1. There was no visible progress through the 7 steps, and nothing showed whether the screen matched the script.
- **Mobile.** The brand name was truncated to "S", and the 10-item sidebar pushed all content below the fold.
- **Offline venues.** All media were hot-linked from Unsplash and turned into black boxes with no network. Captions credited stock photos as the team's own field survey.

### Changes implemented
| Area | Change |
|---|---|
| **Live street scene** (`dashboard/FloodScene.tsx`) | An animated SVG cross-section in the Overview hero, driven entirely by live state. Rain density and speed follow mm/h. Trash pieces follow the AI class. Water on the road follows the water level, with a depth ruler. Flow particles in the sewer pipe slow down as the drain gets blocked. The camera's field of view and a dashed ROI box are drawn on the drain, coloured by risk. A one-line cause → effect sentence and the rule-engine verdict sit under it, along with 3 "try it" control groups (rain, drain, water). It respects `prefers-reduced-motion`. |
| **"Why early?" timeline** (`dashboard/EarlyWarningTimeline.tsx`) | Two lanes compare *today* (rain → blocked drain → flood → residents call → crew arrives) with *SMART ANTI-FLOOD AI* (camera → AI detects → alert + ticket → crew clears → AI verifies). The second lane highlights the live stage ("Đang ở đây"). It replaces the redundant quick-action banner. |
| Pipeline diagram | The Alert node now shows all 4 levels with the correct colours. |
| Demo Mode | Presets and hints were fixed to match the engine. A step progress bar was added (click a dot to jump to that step). A live **"✓ expected"** or **"Expected X · Now Y"** chip was added. `npm test` now runs `scripts/check-demo-steps.ts` to stop the script and engine drifting apart again. |
| Honesty | The mock-mode banner now says the result is the chosen state, not an analysis of the image. "Simulate cleanup" runs the same CLEAR ≥ threshold check instead of writing a hardcoded "96%". Media are credited as "Ảnh minh họa – Unsplash". The Rickroll default `youtubeId` was removed. |
| Offline | Gallery cards show a themed placeholder (emoji + title) when a photo can't load. |
| Real-model robustness | Class labels are normalised (`Blocked`, `partial blocked` … → enum). The settings page warns when the model is missing any of the 4 expected classes. tf.js and tmImage are pinned to `1.3.1` / `0.8.5`, because tmImage 0.8.5 declares tfjs 1.3.1 as its peer. |
| Rule engine | The "above high threshold" reason text now uses the same `>` as the rule. The comment now matches the code. |
| Mobile | Shorter brand name and compact header pills. The sidebar becomes a horizontal scrolling tab bar. The scene's info chips are hidden on small screens. |
| Hygiene | Removed the unused `@google/genai`, `express`, `dotenv` and `@types/express`. Renamed the package to `smart-anti-flood-ai`. Added a README, a `.gitignore` and a `test` script. |

### Further ideas not implemented (worth considering)
1. **A "rainstorm replay" button.** It would play a scripted 60-second storm in the scene, with rain building, trash arriving, the alert firing, the crew cleaning and the water receding. That makes a perfect hands-free opening for a pitch.
2. **A mini map of several drains around Cầu Giấy.** Each pin would be coloured by risk, showing how this scales from one camera to a city.
3. **Real model evidence.** A confusion matrix and accuracy figure from the team's own held-out test images, on the "AI hoạt động thế nào?" page. This is the single biggest credibility gain.
4. **Calmer visual language.** Drop the emoji where an icon already exists, use sentence case for most labels, and keep animation for the risk state only.
5. **Start in a calm state** (NORMAL), so the first thing judges see is the system escalating, not an alarm already going off. The team's current default (HIGH on load) was left as is because it looks deliberate.
6. **Real rain data** from an open weather API for Hanoi, as an optional input next to the slider.

---

## 7. Competition context and readiness (added 2026-10-11)

> **Caveat:** the sandbox could not open ai.tainangviet.vn (DNS/403). Everything below comes from search snippets and press articles, and the Advocate and Critic agents both failed to find the scoring rubric. **Treat every item as unverified until a team member reads the official plan PDF (`tainangviet.vn/source/files/AI2026_Ke hoach_The le_phathanh.pdf`) and `/faq`.** Do not borrow criteria from "Sáng tạo trẻ Hà Nội 2026", which is a different contest.

### What was found
- **Contest:** Cuộc thi Sáng tạo trẻ quốc gia về AI 2026, run by Trung ương Đoàn, launched 18/07/2026. Ages 12–22. Bảng A = THCS (12–15), B = THPT (16–18), C = students (19–22). Teams of at most 3. Which band NEWTON AI is in depends on the members' ages.
- **Rounds:** sơ loại, khu vực, chung kết. South regional was 10/10. **North/Central regional is 17/10/2026, six days from this review.** Bảng A/B: a 10-minute MVP defense plus a 6-hour mini-hackathon with change-requests from the organizers. The final (about 20–22/11, Hanoi) adds a 12-hour improvement challenge and a rebuttal.
- **Dossier:** Bảng A is a PDF of at most 8 pages, a video of at most 5 minutes, a demo video of at most 3 minutes, and **prompt history and development evidence**. Bảng B is a 12-page PDF with **test evidence** and an honest declaration of tools, data and code. An integrity pledge applies.
- **Scoring:** one source says 60% regional and 40% dossier. No rubric found.
- **Dates conflict:** free-team registration was reported as 10/07–20/09 and provincial submission as 30/09. Confirm the team is registered and its dossier was accepted.

### Fit (Advocate)
Real local problem, clear pipeline (camera → ROI → classifier → rules → ticket → re-check), honest AI/rules/simulated labelling that matches a tool-declaration culture, explainable output (`reasons`, `matchedRules`), a settings-driven engine and swap-by-URL model that suit change-requests, and a demo test that keeps the 7 steps in line with the engine.

### Risks (Critic)
1. **No real AI evidence.** No model, dataset or held-out metrics in the repo; mock mode is the default. The redesign's model numbers are illustrative and must be replaced before use. Showing invented metrics to judges is an integrity problem.
2. **Circular mock test.** The "dataset test" predicts the expected class and then compares it to the same class (`AppContext.tsx` ~292).
3. **Change-request fragility.** The engine is hard-coded to four class names and fixed rules (`ruleEngine.ts` ~63–138); `AppContext.tsx` is one large file.
4. **Thin AI depth.** Teachable Machine is easy to replace. The strongest answer is the engineering and the real-world loop, not the model.
5. **Integrity.** The repo was built with AI help. There is no prompt-history or development-log file, which Bảng A (and possibly B) asks for. Every member must be able to explain every file.
6. **Venue risk.** CDN scripts and hot-linked images need internet. Vendor tf.js and use local images.
7. **Presentation over substance.** `design/` and `redesign/` are mock-data front ends.

### Added to the priority list
| # | Fix | Effort |
|---|---|---|
| 10 | Read the official PDF and `/faq` today; record criteria, band, AI-tool policy, what to bring | 30 min |
| 11 | Train on real drain photos (aim for 100+ per class), hold out a test set, report accuracy and a confusion matrix with one failure example (this is #6, now urgent) | team work |
| 12 | Add `DEVELOPMENT_LOG.md`: prompt history, what AI tools wrote, what the team wrote, data sources | 1–2 h |
| 13 | Drill a 30-minute change-request: add a class, swap the model, add a rule, add one real input (open weather API or an ESP32 reading) | 2 h |
| 14 | Vendor tf.js and local images; keep a build that runs offline; put it on a USB stick | 1 h |
| 15 | Rebuttal Q&A: why Teachable Machine, false alarms, CCTV privacy, scaling cost, maintenance, why rules instead of ML | 1 h |
| 16 | Backups: screen recording of the demo, a one-page printout | 1 h |
| 17 | Align the Alerts table with the engine (see the status note above) | 30 min |

### Readiness verdict
The concept fits a "real problem solved with AI" contest well and is unusually honest and explainable. For a 17/10 defense plus a hackathon, the biggest gaps are **real model evidence**, **a development log**, and **change-request speed**, not UI.
