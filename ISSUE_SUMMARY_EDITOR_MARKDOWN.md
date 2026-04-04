# ISSUE: SummaryEditor — Ganti Textarea dengan Markdown Editor (`@uiw/react-md-editor`)

## Status
`open`

## Priority
`medium`

## Assignee
_unassigned_

## Dependency
- `ISSUE_FRONTEND_MODULE.md` selesai (`SummaryEditor.tsx` sudah ada dan berfungsi)

---

## Background

Saat ini `SummaryEditor` menggunakan `<Textarea>` biasa untuk mengedit hasil summary dari AI. Summary yang dihasilkan backend kemungkinan sudah berformat Markdown (heading, bullet, bold, dsb), tapi tampilan view-mode hanya pakai `whitespace-pre-wrap` sehingga Markdown tidak dirender dengan benar.

Solusi: ganti editor dengan `@uiw/react-md-editor` agar user bisa edit dengan toolbar Markdown dan hasil preview dirender sebagai HTML. Toolbar dibatasi — **tidak boleh ada aksi upload/embed image atau video** agar database tetap bersih (backend tidak menangani penyimpanan media).

---

## Instalasi

```bash
npm install @uiw/react-md-editor
```

> Tidak perlu install dependency tambahan — `@uiw/react-md-editor` sudah bundling `@uiw/react-markdown-preview` di dalamnya.

---

## Perubahan di `SummaryEditor.tsx`

### Sebelum

```tsx
import { Textarea } from "@/components/shared/Textarea";

// mode edit:
<Textarea
  {...register("summary")}
  className="min-h-100 leading-relaxed rounded-2xl p-4 focus:ring-primary/20 text-black"
  placeholder="Tulis summary di sini..."
/>

// mode view:
<div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
  {summary}
</div>
```

### Sesudah

```tsx
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenLine } from "lucide-react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { Button } from "@/components/shared/Button";
import { useUpdateSummaryMutation } from "@/queries/useModuleQuery";
import { useToast } from "@/components/shared/Toast";

const summarySchema = z.object({
  summary: z.string().min(1, "Summary tidak boleh kosong"),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

interface SummaryEditorProps {
  moduleId: string;
  initialSummary: string;
}

// Toolbar tanpa image/video — hanya teks & struktur
const ALLOWED_COMMANDS = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  commands.divider,
  commands.title1,
  commands.title2,
  commands.title3,
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
  commands.divider,
  commands.code,
  commands.codeBlock,
  commands.quote,
  commands.divider,
  commands.link,
];

const ALLOWED_EXTRA_COMMANDS = [
  commands.codeEdit,
  commands.codeLive,
  commands.codePreview,
];

export function SummaryEditor({ moduleId, initialSummary }: SummaryEditorProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [summary, setSummary] = React.useState(initialSummary);
  const { toast } = useToast();

  const { mutate: updateSummary, isPending } = useUpdateSummaryMutation(moduleId);

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: { summary: initialSummary },
  });

  const onSubmit = (values: SummaryFormValues) => {
    updateSummary(
      { summary: values.summary },
      {
        onSuccess: () => {
          setSummary(values.summary);
          setIsEditing(false);
          toast.success("Summary berhasil diperbarui");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Gagal memperbarui summary");
        },
      },
    );
  };

  const handleCancel = () => {
    resetForm({ summary });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 rounded-3xl border shadow-md border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
            <PenLine size={16} />
          </span>
          AI Summary
        </h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-md font-bold">
            Edit Summary
          </Button>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div data-color-mode="light">
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={(val) => field.onChange(val ?? "")}
                    commands={ALLOWED_COMMANDS}
                    extraCommands={ALLOWED_EXTRA_COMMANDS}
                    height={400}
                    preview="live"
                  />
                )}
              />
            </div>
            {errors.summary && (
              <p className="text-xs text-danger ml-1 mt-1">
                {errors.summary.message}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isPending}>
                Batal
              </Button>
              <Button
                type="submit"
                loading={isPending}
                className="px-8 shadow-sm shadow-primary/20">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        ) : (
          <div data-color-mode="light">
            <MDEditor.Markdown
              source={summary}
              className="prose prose-sm max-w-none text-gray-600 !bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Penjelasan Perubahan Kunci

### 1. Ganti `register` → `Controller`
`@uiw/react-md-editor` adalah **controlled component** — tidak kompatibel dengan `register()` dari react-hook-form. Wajib pakai `<Controller>` agar nilai field tersinkron dengan form state.

### 2. `ALLOWED_COMMANDS` — toolbar tanpa media
Toolbar dibuild manual dari `commands.*` tanpa mengikutsertakan:
- `commands.image` — insert image (`![alt](url)`)
- Tidak ada command video bawaan di library ini, tapi dengan mendefinisikan toolbar secara eksplisit, semua command di luar daftar otomatis tidak muncul.

> **Kenapa penting:** Jika pakai toolbar default (`commands.getCommands()`), tombol image akan muncul. User bisa embed URL image eksternal ke dalam Markdown — walaupun tidak disimpan sebagai file di DB, tapi string Markdown yang mengandung `![](url)` tetap membebani kolom `summary` dengan URL panjang dan menciptakan dependensi ke resource eksternal. Dengan membatasi toolbar, user tidak tergoda untuk melakukannya.

### 3. `data-color-mode="light"`
Atribut ini wajib ada di wrapper `div`. Tanpanya, `@uiw/react-md-editor` akan membaca preferensi sistem (dark/light) dan mungkin menampilkan background hitam yang bertabrakan dengan desain aplikasi.

### 4. Mode view pakai `MDEditor.Markdown`
Ganti `whitespace-pre-wrap` div dengan `MDEditor.Markdown` agar Markdown yang tersimpan dirender sebagai HTML yang proper (heading, bullet, bold, dsb). Class `!bg-transparent` di-override agar background tidak putih solid di atas wrapper gray.

---

## Potensi Masalah

### WARN-1: CSS `@uiw/react-md-editor` perlu diimport manual di Next.js
Library tidak auto-inject stylesheet. Tambahkan import di `app/layout.tsx` atau `globals.css`:

```ts
// app/layout.tsx atau file CSS global
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
```

Tanpa ini, editor akan muncul tanpa styling (toolbar berantakan, preview tidak terbaca).

### WARN-2: SSR conflict — `"use client"` sudah ada, tapi verifikasi
`@uiw/react-md-editor` tidak kompatibel dengan SSR. `SummaryEditor.tsx` sudah punya `"use client"` di baris pertama, jadi aman. Pastikan tidak ada parent server component yang mengimport `SummaryEditor` secara langsung tanpa batas client boundary.

### WARN-3: Ukuran bundle
`@uiw/react-md-editor` menambah ~150-200KB ke bundle client. Pertimbangkan `next/dynamic` dengan `ssr: false` jika halaman summary mulai terasa lambat:

```ts
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
```

---

## Definition of Done

- [ ] `@uiw/react-md-editor` terinstall di `package.json`
- [ ] CSS library diimport di layout atau globals
- [ ] Mode edit menggunakan `MDEditor` dengan toolbar terbatas (tanpa image/video)
- [ ] Mode view menggunakan `MDEditor.Markdown` — Markdown dirender sebagai HTML
- [ ] Nilai editor tersinkron dengan react-hook-form via `Controller`
- [ ] Validasi zod tetap berjalan (field kosong ditolak)
- [ ] Tidak ada error TypeScript
- [ ] Tampilan tidak broken di light mode (wrapper `data-color-mode="light"` terpasang)
