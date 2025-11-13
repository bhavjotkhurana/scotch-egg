# Scotch Egg Worksheets Frontend

This Vite + React app powers the public Scotch Egg worksheet library: a browsable catalog of free SAT/Algebra practice sets with downloadable PDFs, reflection pages, and branded preview art.

## Highlights

- **Standardized worksheets** – Every unit topic PDF now shares the Unit 1 layout (extarticle 14 pt, Helvetica, reflection page hook, and next-topic CTA).
- **Unit metadata** – `common-things/unit-topic-index.json` maps every unit/topic to its friendly title, enabling automated linking, sorting, and preview uploads.
- **Browse experience upgrades**
  - Difficulty/category filters plus a Sort control (A→Z, Z→A, Difficulty).
  - Worksheet cards show downloads, tags, and preview thumbnails (1200 × 900 PNGs).
  - About page rewritten with brand typography/colors.
- **Preview automation** – `scripts/uploadPreviews.js` uploads `preview-images/UxTy.png` to Supabase Storage and patches `preview_image_url` for the matching worksheet row.

## Getting Started

```bash
cd math-worksheets
npm install
npm run dev
```

The app expects Supabase credentials in `math-worksheets/.env.admin` (already used by the upload scripts). For local browsing only, the public anon key can be placed in `.env.local` via Vite-style `VITE_` vars.

## Useful Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server. |
| `npm run build` / `npm run preview` | Production build & preview. |
| `node scripts/uploadWorksheet.js ...` | Existing CLI to create worksheet rows (PDF uploads). |
| `node scripts/uploadPreviews.js` | Uploads PNG previews from `preview-images/` and updates Supabase records (requires `.env.admin`). |

### Preview Upload Instructions

1. Export preview art as `preview-images/U{unit}T{topic}.png` (e.g., `U1T3.png` for Unit 1 Topic 3).
2. Run:

   ```bash
   node scripts/uploadPreviews.js
   ```

   The script will:
   - Read `unit-topic-index.json` to resolve the worksheet title.
   - Upload the PNG to the `worksheet-files` Supabase bucket (`previews/...` path).
   - Update `preview_image_url` on the matching `worksheets` row.

3. Refresh the app; cards will show the new thumbnail automatically.

## Project Structure

```
math-worksheets/
├─ src/
│  ├─ pages/
│  │  ├─ Home.jsx (filters, sorting, cards)
│  │  ├─ Upload.jsx (admin uploader)
│  │  └─ About.jsx + About.css
│  ├─ components/worksheets/WorksheetCard.jsx
│  ├─ api/base44Client.js (Supabase client helpers)
│  └─ ...
├─ scripts/
│  ├─ uploadWorksheet.js
│  └─ uploadPreviews.js
├─ preview-images/ (generated PNGs, not committed)
└─ README.md
```

## Styling & Assets

- Primary font stack: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
- Core palette: `#613613` (primary), `#4A290E`, `#FFDF5B`, `#EEC847`, `#1F1F1F`, `#FFF8E1`, `#FEFCF5`.
- Preview images look best at 4:3 (1200 × 900) with centered text and gold/brown ribbon accents to match the cards.

---

Questions or bugs? Reach out at **hello@scotchegg.co**. Every download helps us improve the free library! 🎓🥚
