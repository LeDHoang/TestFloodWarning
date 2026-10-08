# Anti-Flood: redesign (design-only frontend)

A standalone visual redesign of SMART ANTI-FLOOD AI for pitching. It uses **mock data only and no app logic**, and it is designed for a laptop (1440×900) screen.

```bash
bun run dev:redesign     # http://localhost:3100  (#cover #live #network #incident #model)
bun run build:redesign
```

## Design direction
- **A municipal bulletin, not a SaaS dashboard.** Off-white paper and black ink. Hairline rules and numbered section labels replace floating rounded cards. There are no gradients, glows or emoji.
- **One signal colour.** Vermilion `#c8371d` means "high flood risk" and nothing else. Amber and ochre are the lower risk levels, and slate blue is water.
- **Type with Vietnamese support:** *Newsreader* (serif) for headlines and key figures, *Be Vietnam Pro* for the interface, *JetBrains Mono* for timestamps, IDs and model outputs. The fonts are bundled through `@fontsource`, so the demo works offline.
- **A believable camera image** (`src/ui/CctvFrame.tsx`). A procedurally drawn top-down CCTV still, with perspective, wet asphalt, grain, a timestamp HUD and ROI corner brackets. `roiOnly` renders the 224×224 crop the model sees.

## Screens
| # | Screen | What it says to judges |
|---|---|---|
| 01 | Tổng quan | The idea in one sentence, the camera frame, and the 5-step loop |
| 02 | Trực tiếp | A live camera, the 30-minute drain history, the rule verdict with its 3 conditions, model output, rain and water |
| 03 | Mạng lưới | How one camera scales to a district: map plus a priority queue |
| 04 | Sự cố | One incident end to end: before/after frames, timeline, log, water vs. "if not cleared" |
| 05 | Mô hình | Scientific evidence: accuracy, confusion matrix, precision/recall, and examples including mistakes |

All numbers are **illustrative**. Replace the model metrics on screen 05 with the team's own test results before presenting.
