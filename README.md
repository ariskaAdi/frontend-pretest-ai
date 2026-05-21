# Pretest AI — Frontend

Frontend untuk aplikasi **Pretest AI**, platform belajar mahasiswa/pelajar yang membantu membuat ringkasan modul dan soal latihan secara otomatis menggunakan AI.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| i18n | next-intl |
| HTTP Client | Axios |

---

## Arsitektur

```
Frontend (Next.js :3000)
    ↓ HTTP
Backend API (:8080)
    ↓ HTTP
Genkit AI Service (:3400)
```

### Struktur Folder

```
src/
├── app/                  # Next.js App Router — halaman & layout
├── components/           # Reusable UI components
├── services/             # Axios instance + API calls
├── store/                # Zustand global state
├── hooks/                # Custom React hooks
├── i18n/                 # Konfigurasi next-intl
└── lib/                  # Utilities
messages/                 # File terjemahan (id.json, en.json)
public/                   # Static assets
```

---

## Prasyarat

- Node.js 20+
- Backend API sudah berjalan (lihat repo `backend-pretest-ai`)

---

## Setup & Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Buat `.env.local`

```bash
cp .env.example .env.local
```

Isi nilai berikut:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev      # Jalankan development server
npm run build    # Build production
npm run start    # Jalankan production build
npm run lint     # Lint semua file
```

---

## Environments

Frontend menggunakan 3 environment dengan deployment yang berbeda:

| Environment | Branch | Deployment | URL |
|---|---|---|---|
| **Development** | lokal | `npm run dev` | `localhost:3000` |
| **Staging** | `develop` | **Vercel** (otomatis) | `*.vercel.app` |
| **Production** | `main` | **Self-hosted Docker** | domain production |

### Staging — Vercel

Staging di-handle **otomatis oleh Vercel** saat push ke branch `develop`.

Setup di Vercel dashboard:
1. Import repo → pilih branch `develop` sebagai production branch Vercel
2. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://api-staging.pretestai.com
   ```
3. Setiap push ke `develop` → Vercel build & deploy otomatis

> GitHub Actions **tidak berjalan** untuk branch `develop` di repo ini.

### Production — Self-hosted Docker

Push ke `main` → GitHub Actions build Docker image → deploy ke server.

Image disimpan di **GitHub Container Registry (ghcr.io)**:
- `ghcr.io/<owner>/pretest-frontend:latest`

#### Build Lokal

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.pretestai.com \
  -t pretest-frontend .
```

#### Jalankan dengan Docker

```bash
docker run -d \
  --name pretest-frontend \
  -e NEXT_PUBLIC_API_URL=https://api.pretestai.com \
  -p 3000:3000 \
  pretest-frontend
```

### CI/CD Pipeline (Production)

File: `.github/workflows/deploy.yml`

```
push ke main
    ↓
[Job: build] — environment: production
  Build image dengan NEXT_PUBLIC_API_URL dari secrets
  Push ke ghcr.io:latest
    ↓
[Job: deploy] — environment: production
  SSH ke server production
  → docker pull → docker stop/rm → docker run
```

### GitHub Environment: `production`

Buat environment di repo → **Settings → Environments → production**:

| Secret | Keterangan |
|---|---|
| `FRONTEND_SERVER_HOST` | IP server frontend production |
| `SERVER_USER` | User SSH (misal: `ubuntu`) |
| `SERVER_SSH_KEY` | Private key SSH (`cat ~/.ssh/id_rsa`) |
| `NEXT_PUBLIC_API_URL` | URL backend API production |

### Setup Server (Sekali Saja)

```bash
# Buat Personal Access Token di GitHub → Settings → Developer Settings
# dengan scope: read:packages
echo "YOUR_PAT" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

---

## Environment Variables

| Variable | Contoh | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Base URL backend API |

> `NEXT_PUBLIC_*` di-bake saat build time. Pastikan nilainya sudah benar sebelum `docker build`.

---

## Catatan Penting

- **Jangan commit `.env.local`** — sudah ada di `.gitignore`
- **`output: standalone`** diaktifkan di `next.config.ts` untuk Docker image yang lebih kecil
- **`NEXT_PUBLIC_API_URL`** adalah satu-satunya env var yang dibutuhkan saat ini
