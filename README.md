# SMART ANTI-FLOOD AI · NEWTON AI

> *"PHÁT HIỆN SỚM – CẢNH BÁO SỚM – HÀNH ĐỘNG SỚM"*
> An AI system that detects blocked storm drains and gives early warning of street flooding in Hanoi.

A student science-fair project by team **NEWTON AI** (Trường THCS & THPT Newton, Hà Nội).

## The idea

Streets in Hanoi flood during heavy rain, often because trash and leaves cover the storm-drain grates. Today, drainage crews usually find out only after the road is already flooded.

SMART ANTI-FLOOD AI uses a street camera to watch the drain mouth. A Teachable Machine image model classifies it, and that result is combined with rain and water-level readings to warn crews *before* the water rises:

```
Camera ─► ROI crop (drain mouth, 224×224) ─► Teachable Machine
          CLEAR | TRASH_NEARBY | PARTIAL_BLOCKED | BLOCKED
                         │
Rain mm/h + water level ─┴─► Rule Engine (deterministic, not AI)
                              NORMAL → WATCH → WARNING → HIGH
                                         │
                       Alert ─► Ticket for the drainage crew ─► Camera re-check: CLEAR → RESOLVED
```

| Part | What it is |
|---|---|
| Teachable Machine | **AI**: image classification (computer vision), runs in the browser with tf.js |
| ROI | Image processing that crops the camera frame to the drain mouth |
| Rain / water level | Environmental readings. They are **simulated** in this demo; the planned upgrade is a rain gauge or an ultrasonic sensor with ESP32 |
| Rule Engine | A deterministic decision algorithm (`src/services/ruleEngine.ts`) |

## Run it

```bash
bun install        # or: npm install --legacy-peer-deps
bun run dev        # http://localhost:3000
bun run test       # checks that Demo Mode steps match the rule engine
bun run build
```

## Demo tips

- **Overview** opens with a live street scene. Change the rain, drain state and water level, and watch the rule engine react.
- **🎓 DEMO MODE** walks judges through 7 steps, from heavy rain through a blocked drain and a ticket to the AI re-check. Each step shows whether the live risk level matches the script.
- **Without a model URL** the app runs in clearly labelled *mock mode*: the "AI" output is the state you choose, not an analysis of the image.
- **To use your real model**, paste the public Teachable Machine URL in *Cấu hình AI*. The classes must be named `CLEAR`, `TRASH_NEARBY`, `PARTIAL_BLOCKED` and `BLOCKED`; case and spaces don't matter. The settings page warns if any is missing.

## Tech

React 19 · Vite · Tailwind 4 · tf.js 1.3.1 + @teachablemachine/image 0.8.5 (CDN) · localStorage. There is no backend.
