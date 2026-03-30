/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useModuleDetailQuery,
  useDeleteModuleMutation,
  useRetrySummarizeMutation,
} from "@/queries/useModuleQuery";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";
import { Modal } from "@/components/shared/Modal";
import { Spinner } from "@/components/shared/Spinner";
import { useToast } from "@/components/shared/Toast";
import { cn } from "@/lib/utils";
import {
  FileText,
  PenLine,
  Target,
  Calendar,
  Search,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const { data: module, isLoading } = useModuleDetailQuery(id);
  const { mutate: deleteModule, isPending: isDeleting } =
    useDeleteModuleMutation();
  const { mutate: retrySummarize, isPending: isRetrying } =
    useRetrySummarizeMutation();

  const handleDelete = () => {
    deleteModule(id, {
      onSuccess: () => {
        toast.success("Modul berhasil dihapus");
        router.push("/modules");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || "Gagal menghapus modul");
      },
    });
  };

  const handleRetry = () => {
    retrySummarize(id, {
      onSuccess: () => {
        toast.success("Proses summarize dimulai ulang");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.error || "Gagal memulai ulang proses",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Memuat detail modul...
        </p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-4">
          <Search size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Modul tidak ditemukan
        </h3>
        <Link href="/modules">
          <Button variant="ghost">Kembali ke Koleksi</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col gap-2">
        <Link
          href="/modules"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors w-fit group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Kembali ke Koleksi
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {module.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} className="text-gray-400" />
                {new Date(module.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <Badge
                variant={
                  module.is_summarized
                    ? "success"
                    : module.summarize_failed
                      ? "danger"
                      : "warning"
                }
                className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
                {module.is_summarized
                  ? "Ringkasan Tersedia"
                  : module.summarize_failed
                    ? "Gagal Merangkum"
                    : "Sedang Diproses AI"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6  shadow-sm rounded-3xl bg-gray-50 border-dashed border-2 flex flex-col items-center text-center group cursor-pointer hover:shadow-md transition-all duration-300">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform font-bold">
            <FileText size={32} strokeWidth={1.5} />
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Buka File PDF</h4>
          <p className="text-xs text-gray-400 mb-4">
            Lihat dokumen asli materi Anda
          </p>
          <a
            href={module.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full">
            <Button variant="ghost" className="w-full rounded-xl">
              Buka Link
            </Button>
          </a>
        </Card>

        <Card className="p-6  shadow-sm rounded-3xl bg-gray-50 border-dashed border-2 flex flex-col items-center text-center group cursor-pointer hover:shadow-md transition-all duration-300">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform font-bold",
              module.is_summarized
                ? "bg-amber-50 text-amber-600"
                : "bg-gray-50 text-gray-400",
            )}>
            <PenLine size={32} strokeWidth={1.5} />
          </div>
          <h4 className="font-bold text-gray-900 mb-1">AI Summary</h4>
          <p className="text-xs text-gray-400 mb-4">
            {module.summarize_failed
              ? "Terjadi kesalahan saat merangkum materi."
              : "Lihat rangkuman cerdas dari AI"}
          </p>
          <div className="w-full space-y-2">
            <Link href={`/modules/${module.id}/summary`} className="w-full">
              <Button
                variant="ghost"
                className="w-full rounded-xl"
                disabled={!module.is_summarized}>
                Lihat Rangkuman
              </Button>
            </Link>
            {module.summarize_failed && (
              <Button
                variant="ghost"
                className="w-full rounded-xl border-danger/30 text-danger hover:bg-danger-light hover:text-danger font-bold text-xs flex items-center justify-center gap-2"
                onClick={handleRetry}
                loading={isRetrying}>
                <RotateCcw size={14} /> Coba Lagi
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6  shadow-sm rounded-3xl bg-gray-50 border-dashed border-2 flex flex-col items-center text-center group cursor-pointer hover:shadow-md transition-all duration-300">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform font-bold",
              module.is_summarized
                ? "bg-success-light text-success"
                : "bg-gray-50 text-gray-400",
            )}>
            <Target size={32} strokeWidth={1.5} />
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Generate Quiz</h4>
          <p className="text-xs text-gray-400 mb-4">
            Uji pemahaman dengan latihan soal
          </p>
          <Link href={`/quiz?module_id=${module.id}`} className="w-full">
            <Button
              className="w-full rounded-xl font-bold"
              disabled={!module.is_summarized}>
              Buat Quiz
            </Button>
          </Link>
        </Card>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <div className="flex items-center justify-between p-6 bg-danger-light/20 rounded-3xl border border-danger-light/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-danger shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-danger mb-1">Zona Bahaya</h4>
              <p className="text-xs text-gray-500">
                Hapus modul ini dan semua data terkaitnya secara permanen
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            className="px-8 rounded-2xl font-bold shadow-sm shadow-danger/10"
            onClick={() => setIsDeleteModalOpen(true)}>
            Hapus Modul
          </Button>
        </div>
      </div>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Modul Secara Permanen">
        <div className="p-1">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Apakah Anda yakin ingin menghapus modul{" "}
            <span className="font-bold text-gray-900">
              &quot;{module.title}&quot;
            </span>
            ? Semua ringkasan dan riwayat quiz terkait modul ini akan dihapus
            secara permanen.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6">
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
              className="px-6 shadow-sm shadow-danger/20">
              Ya, Hapus Sekarang
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
