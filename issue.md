# 📋 ISSUE: Frontend — Zod Validation on UploadForm

## Status

`open`

## Priority

`medium`

## Assignee

_unassigned_

---

## Background

`UploadForm` saat ini tidak memiliki validasi di sisi frontend — form langsung mengirim request ke backend, baru mendapat error dari sana. Akibatnya setiap typo di title (misal kurang dari 3 karakter) selalu menghasilkan network request yang sia-sia.

Tambahkan Zod schema + react-hook-form ke `UploadForm` agar validasi terjadi di client sebelum request dikirim, dan tampilkan error inline di bawah masing-masing field.

**Jangan ubah logic upload, drag-drop, atau mutation yang sudah ada.**

---

## Install Dependencies

```bash
npm install zod react-hook-form @hookform/resolvers
```

Tambahkan ke `package.json` dependencies (bukan devDependencies).

---

## Zod Schema

Buat schema di dalam `UploadForm.tsx` (tidak perlu file terpisah karena hanya dipakai di sini):

```ts
import { z } from "zod";

const uploadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be at most 255 characters"),
  file: z
    .instanceof(File, { message: "PDF file is required" })
    .refine((f) => f.type === "application/pdf", "Only PDF files are allowed")
    .refine(
      (f) => f.size <= 20 * 1024 * 1024,
      "File size must not exceed 20MB",
    ),
});

type UploadFormValues = z.infer<typeof uploadSchema>;
```

---

## Implementasi react-hook-form

### Setup

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const {
  register,
  handleSubmit,
  setValue,
  watch,
  formState: { errors },
  reset,
} = useForm<UploadFormValues>({
  resolver: zodResolver(uploadSchema),
});
```

### Hapus useState untuk title dan file

```tsx
// HAPUS ini:
const [title, setTitle] = React.useState("");
const [file, setFile] = React.useState<File | null>(null);

// GANTI dengan:
const file = watch("file") ?? null; // untuk keperluan UI drag-drop yang sudah ada
```

### Title field — pakai register

```tsx
<Input
  id="title"
  {...register("title")}
  placeholder="Masukkan judul modul (contoh: Biologi Sel Bab 1)"
  className="rounded-2xl h-12"
/>;
{
  errors.title && (
    <p className="text-xs text-danger ml-1 mt-1">{errors.title.message}</p>
  );
}
```

> Hapus prop `value`, `onChange`, dan `required` yang lama — sudah dihandle oleh `register`.

### File field — pakai setValue

File input menggunakan custom drag-drop UI, sehingga tidak bisa pakai `register` langsung. Gunakan `setValue` setiap kali file dipilih/di-drop:

```tsx
// Di handleDrop — ganti setFile(droppedFile) dengan:
setValue("file", droppedFile, { shouldValidate: true });

// Di handleFileChange — ganti setFile(selectedFile) dengan:
setValue("file", selectedFile, { shouldValidate: true });

// Di tombol "Ganti File" — ganti setFile(null) dengan:
setValue("file", undefined as any, { shouldValidate: false });
```

Tampilkan error file di bawah drop zone:

```tsx
{
  errors.file && (
    <p className="text-xs text-danger ml-1 mt-1">{errors.file.message}</p>
  );
}
```

### handleSubmit

```tsx
// Ganti:
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!title || !file) return
  ...
}

// Dengan:
const onSubmit = (values: UploadFormValues) => {
  const formData = new FormData()
  formData.append('title', values.title)
  formData.append('file', values.file)

  uploadModule(formData, {
    onSuccess: () => {
      toast.success('Modul berhasil diupload dan sedang diproses')
      reset()
      onSuccess?.()
      router.push('/modules')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Terjadi kesalahan saat mengupload modul')
    }
  })
}
```

Pada form element, ganti `onSubmit={handleSubmit}` dengan:

```tsx
<form onSubmit={handleSubmit(onSubmit)} ...>
```

### Button disabled state

```tsx
// Ganti:
disabled={!title || !file || isPending}

// Dengan:
disabled={isPending}
// react-hook-form + zod handles validation — tombol boleh diklik, error akan muncul inline
```

---

## Hasil Akhir — Tampilan Error Inline

```
┌─────────────────────────────────────────┐
│ Judul Modul                             │
│ ┌─────────────────────────────────────┐ │
│ │ ab                                  │ │
│ └─────────────────────────────────────┘ │
│ ⚠ Title must be at least 3 characters  │
│                                         │
│ File PDF                                │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│   Klik atau drop file PDF untuk upload  │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
│ ⚠ PDF file is required                  │
└─────────────────────────────────────────┘
```

Error muncul inline di bawah field saat submit, bukan sebagai toast. Toast hanya untuk error dari backend (network/server error).

---

## File yang Dikerjakan

```
frontend-pretest-ai/
├── package.json                          ← tambah zod, react-hook-form, @hookform/resolvers
└── src/
    └── components/
        └── features/
            └── module/
                └── UploadForm.tsx        ← refactor dengan zod + react-hook-form
```

---

## Definition of Done

- [ ] `zod`, `react-hook-form`, `@hookform/resolvers` terinstall
- [ ] Schema Zod mencakup title (min 3, max 255) dan file (PDF, max 20MB)
- [ ] Error inline muncul di bawah field title dan file
- [ ] Tidak ada network request terkirim jika form tidak valid
- [ ] Logic upload, drag-drop, dan mutation tidak berubah
- [ ] `reset()` dipanggil setelah upload berhasil (form bersih saat modal dibuka ulang)
- [ ] Tidak ada error TypeScript (`tsc --noEmit`)
