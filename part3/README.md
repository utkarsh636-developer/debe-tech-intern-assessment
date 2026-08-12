# Session Reschedule Widget — TutorConnect Parent Portal

> **Part 3 — DEBE Technical Assessment**  
> A production-quality parent-facing tutoring session reschedule widget built with Next.js 16 App Router, TypeScript (strict mode), and Tailwind CSS.

---

## Overview

This project implements a **Session Reschedule Widget** for a tutoring platform's parent-facing portal. Parents can view their child's next 3 upcoming sessions and submit a reschedule request with full validation — including a 2-hour lead-time lockout policy enforced in a timezone-safe, DST-safe manner.

The Firebase Cloud Function (`requestReschedule`) is mocked locally with a typed Promise-based stub that mirrors the real callable signature, including artificial network delay and structured error responses.

---

## Features

- **Session Dashboard** — Displays the next 3 upcoming tutoring sessions, filtered and sorted from a mock data array
- **Reschedule Modal** — Opens per-session with a date/time picker and reason dropdown
- **2-Hour Lockout** — Blocks reschedule requests within 2 hours of the current moment; enforced at both UI level (datepicker `minDate` + `filterTime`) and submit-time (defensive guard)
- **Timezone-Safe UTC Handling** — Displays times in the parent's local browser timezone; transmits and stores as UTC ISO-8601 strings
- **Mocked Cloud Function** — Simulates `requestReschedule` Firebase callable with 1.2s delay and server-side validations
- **Loading & Error States** — Inline spinner during submission, typed error messages on failure, animated success confirmation
- **Strict TypeScript** — Zero `any` types; `noImplicitAny` and `noUncheckedIndexedAccess` enabled

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v3 |
| Date Picker | `react-datepicker` |
| Mock Backend | Local Promise-based stub (Firebase Callable signature) |
| Font | Geist (via `next/font`) |

---

## Project Structure

```
src/
├── types/
│   └── index.ts                        # Shared types — single source of truth
├── data/
│   └── mockSessions.ts                 # Mock session array with dynamic UTC timestamps
├── lib/
│   ├── timeUtils.ts                    # UTC conversion, lockout logic, local formatting
│   └── cloudFunctions/
│       └── requestReschedule.ts        # Mocked Firebase callable function
├── components/
│   ├── SessionList.tsx                 # Filters, sorts, slices mock data → next 3 sessions
│   ├── SessionCard.tsx                 # Individual session card with reschedule trigger
│   ├── RescheduleModal.tsx             # Modal overlay with success/form state
│   └── RescheduleForm.tsx              # Date picker, reason dropdown, submit logic
└── app/
    ├── globals.css                     # Tailwind directives + react-datepicker overrides
    ├── layout.tsx                      # Root layout with font and background
    ├── page.tsx                        # Root redirect → /sessions
    └── sessions/
        └── page.tsx                    # Parent portal page with SEO metadata
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Navigate to the project directory
cd part3

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects automatically to `/sessions`.

### Type Check

```bash
npx tsc --noEmit
```

### Production Build

```bash
npm run build
npm start
```

---

## Key Technical Decisions

### 1. UTC Storage vs. Local Display

All session datetimes are stored and transmitted as UTC ISO-8601 strings (e.g., `"2026-08-10T11:00:00.000Z"`). Display is handled by `Intl.DateTimeFormat(undefined, ...)` which resolves automatically to the parent's browser/OS timezone — no hardcoded timezone, no locale drift.

**Why UTC?** A local string like `"4:30 PM"` carries no timezone offset. A server in UTC+0 and a parent in UTC+5:30 would interpret it as different moments. A UTC timestamp means exactly the same instant everywhere on Earth.

**Relevant code:**
- `src/lib/timeUtils.ts` → `toUtcIsoString()` and `formatLocalDateTime()`
- `src/components/RescheduleForm.tsx` → `handleSubmit()` (the conversion point)

---

### 2. DST-Safe 2-Hour Lockout

The lockout check compares raw UTC milliseconds:

```typescript
// src/lib/timeUtils.ts
export function isWithinTwoHourLockout(date: Date): boolean {
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
  return date.getTime() < Date.now() + TWO_HOURS_MS;
}
```

**Why not compare local hours?** `getHours() + 2` overflows at midnight (`23 + 2 = 25`). During Daylight Saving Time, clocks jump forward by 1 hour — a "local hour" is skipped, making arithmetic on local hours unreliable. UTC milliseconds are always monotonically increasing with no gaps.

---

### 3. Mocked Firebase Cloud Function

`src/lib/cloudFunctions/requestReschedule.ts` mirrors the exact signature of a Firebase Callable:

```typescript
async function requestReschedule(
  payload: RescheduleRequest
): Promise<RescheduleResponse>
```

It includes:
- **1.2s artificial delay** to simulate network latency
- **Past-slot validation** (UTC ms comparison)
- **Identical-slot validation** (exact UTC string match)
- **Typed `RescheduleResponse`** — never throws unstructured errors; always returns `{ success, error? }`

Swapping in a real Firebase callable requires changing only this one file.

---

### 4. Type Architecture

`src/types/index.ts` is the single source of truth. Both the UI components and the mock Cloud Function import from this file, ensuring the request/response contract cannot drift between layers.

---

### 5. Tailwind Token Architecture

Custom design tokens are defined in `tailwind.config.ts`:

| Token | Value | Used For |
|-------|-------|----------|
| `bg-bg-base` | `#f5f6ff` | Page background |
| `bg-bg-surface` | `#ffffff` | Card / modal background |
| `bg-bg-surface2` | `#f0f1ff` | Input backgrounds |
| `text-content-primary` | `#1e1b4b` | Primary headings |
| `text-content-secondary` | `#4b5563` | Body copy |
| `brand` | `#6366f1` | CTA buttons, accents |

Custom keyframe animations (`slideUp`, `popIn`, `shakeIn`, `fadeIn`) are registered in the config and consumed as `animate-slide-up`, `animate-pop-in`, etc.

---

## Validation Rules

| Rule | Where Enforced |
|------|---------------|
| New slot must be ≥ 2 hours from now | UI (`minDate`, `filterTime`) + submit guard + Cloud Function |
| New slot cannot be in the past | Cloud Function |
| New slot cannot match existing slot | Cloud Function |
| A date must be selected before submit | Button disabled until `selectedDate !== null` |

---

## Assessment Scope

This is **Part 3** of the DEBE Technical Assessment. Parts 1 and 2 are located in sibling directories:

```
debe-assessment/
├── part1/   # Part 1
├── part2/   # Part 2 — Debug exercise (original.ts)
└── part3/   # Part 3 — Session Reschedule Widget (this project)
```
