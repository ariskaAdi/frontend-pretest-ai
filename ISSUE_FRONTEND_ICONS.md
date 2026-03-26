# ISSUE: Frontend — Replace Emojis with Lucide Icons

## Status
`open`

## Priority
`medium`

## Assignee
_unassigned_

---

## Background

Currently, the Pretest AI frontend application uses hardcoded emojis (e.g., 📄, 🎯, ✅, ❌, 📝, 📅, 🔍, ⚠️, 🔁) across various components (Dashboard, Module detail, Quiz features) to represent icons. While functional, this approach leads to an inconsistent and less professional UI experience, as emojis render differently across operating systems and browsers.

To improve the UI cleanliness, consistency, and overall premium feel of the application, we need to replace all these hardcoded emojis with standard vector icons from the `lucide-react` library.

---

## Objective

Replace **all** hardcoded emojis in the frontend React components with appropriate icons from `lucide-react`.

## 🚨 CRITICAL RULES FOR IMPLEMENTATION 🚨

1. **DO NOT TOUCH LOGIC**: Your sole responsibility is replacing the visual icon elements. Do not modify any state management, API calls, hooks, routing, or conditional rendering logic.
2. **MATCH EXISTING STYLING**: Ensure the new Lucide icons match the size, color, and CSS classes (especially Tailwind utility classes and animations like `group-hover:scale-110`) of the emojis they are replacing. Use the `className` prop on the Lucide icon components.
3. **NO NEW DEPENDENCIES**: `lucide-react` should already be installed or should be the only new dependency added if missing. Do not introduce any other icon libraries.

---

## Target Areas for Replacement

You will need to scan the `src/components`, `src/app`, and specific feature directories. Common areas where emojis are known to exist include:

### 1. Dashboard (`src/app/(dashboard)/dashboard/page.tsx`)
- Stat icons (Total Modul, Quiz Selesai, Rata-rata Skor, Modul Pending)
- Modul Terbaru list item icons (e.g., 📄)
- Quiz Terakhir list item icons (e.g., 🎯)

### 2. Module Flow
- `ModuleCard` components (e.g., 📄)
- `ModuleEmpty` state (e.g., 📁)
- Module detail page (`src/app/(dashboard)/modules/[id]/page.tsx`) action cards:
  - Buka PDF (📄)
  - AI Summary (📝)
  - Generate Quiz (🎯)
  - Delete warning (⚠️)

### 3. Quiz Flow
- `QuizCard` and `QuizEmpty` (e.g., 🎯)
- Quiz Session progress/warnings (e.g., ⚠️, ←, → if hardcoded)
- `QuizResult.tsx`:
  - Result status (✅, ❌, 🔴)
  - Options indicators
- Result summary page (`src/app/(dashboard)/quiz/[id]/result/page.tsx`):
  - Lulus/Gagal indicators (🎯, 💪)
  - Retry button (🔁)

---

## Suggested Lucide Icons Mapping

Here is a preliminary mapping of emojis to suggested `lucide-react` icons. You may choose better alternatives if they fit the design better, provided they are clean and modern.

| Hardcoded Emoji | Suggested `lucide-react` Component |
| :--- | :--- |
| 📄 (Document/PDF) | `FileText` or `File` |
| 🎯 (Target/Quiz) | `Target` or `Crosshair` |
| 📝 (Pencil/Summary) | `PenLine` or `FileEdit` |
| 📅 (Calendar) | `Calendar` |
| ✅ (Check/Success) | `CheckCircle2` or `Check` |
| ❌ / 🔴 (Cross/Fail) | `XCircle` or `X` |
| 🔍 (Search/Not Found) | `Search` or `FileQuestion` |
| ⚠️ (Warning) | `AlertTriangle` |
| 🔁 (Retry) | `RefreshCw` or `RotateCcw` |
| 💪 (Try Again) | `Dumbbell` or standard retry icon |
| 📁 (Empty Folder) | `FolderOpen` |

---

## Example Implementation

**Before (Emoji):**
```tsx
<div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
  📄
</div>
```

**After (Lucide Icon):**
```tsx
import { FileText } from 'lucide-react';

// ... inside component ...
<div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
  <FileText size={32} strokeWidth={1.5} />
</div>
```

## Definition of Done

- [ ] All hardcoded emojis in the `frontend-pretest-ai` project codebase have been identified.
- [ ] Every identified emoji is replaced with a relevant `lucide-react` icon.
- [ ] The new icons inherit the correct sizing, coloring, and hover animations from the previous implementation.
- [ ] **NO application logic has been altered.**
- [ ] The UI renders cleanly without errors or console warnings related to icons.
- [ ] The application successfully builds (`npm run build`).
