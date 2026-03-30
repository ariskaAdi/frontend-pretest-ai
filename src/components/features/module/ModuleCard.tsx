"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Trash2, RotateCcw } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import {
  useDeleteModuleMutation,
  useRetrySummarizeMutation,
} from "@/queries/useModuleQuery";
import { useToast } from "@/components/shared/Toast";
import type { Module } from "@/types/module.types";

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const { mutate: deleteModule, isPending } = useDeleteModuleMutation();
  const { mutate: retrySummarize, isPending: isRetrying } =
    useRetrySummarizeMutation();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteModule(module.id, {
      onSuccess: () => {
        toast.success("Modul berhasil dihapus");
        setIsDeleteModalOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || "Gagal menghapus modul");
      },
    });
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    retrySummarize(module.id, {
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

  return (
    <>
      <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl p-5 bg-white flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">
            <FileText size={24} strokeWidth={2.5} />
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
              ? "Ringkas"
              : module.summarize_failed
                ? "Gagal"
                : "Proses"}
          </Badge>
        </div>

        <div className="flex-1 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {module.title}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(module.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {module.summarize_failed && (
            <p className="text-[10px] text-danger mt-2 font-medium flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
              Gagal merangkum. Silakan coba lagi.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <Link href={`/modules/${module.id}`} className="flex-1">
            <Button className="w-full text-sm font-bold rounded-xl py-2.5">
              Detail
            </Button>
          </Link>
          {module.summarize_failed && (
            <Button
              variant="secondary"
              size="sm"
              className="px-3 rounded-xl border-danger/30 text-danger hover:bg-danger-light hover:text-danger font-bold text-[10px] flex items-center gap-1.5"
              onClick={handleRetry}
              loading={isRetrying}>
              <RotateCcw size={12} /> Retry
            </Button>
          )}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2.5 text-gray-400 hover:text-danger hover:bg-danger-light rounded-xl transition-all duration-200"
            aria-label="Hapus modul">
            <Trash2 size={20} />
          </button>
        </div>
      </Card>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Modul">
        <div className="p-1">
          <p className="text-sm text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus modul{" "}
            <span className="font-bold text-gray-900">
              &quot;{module.title}&quot;
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
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
              loading={isPending}
              className="px-6 shadow-sm shadow-danger/20">
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
