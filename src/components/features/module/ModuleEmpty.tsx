"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared";
import { UploadForm } from "./UploadForm";

export function ModuleEmpty() {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
        <BookOpen size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Belum ada modul diupload
      </h3>
      <p className="text-gray-500 max-w-sm mb-8">
        Upload materi belajar Anda dalam format PDF untuk dirangkum secara
        otomatis oleh AI dan generate quiz latihan.
      </p>
      <Button
        onClick={() => setIsUploadOpen(true)}
        className="rounded-2xl px-6 shadow-md shadow-primary/20 font-bold">
        + Upload Modul
      </Button>
      <Modal
        size="xl"
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Modul Baru">
        <div className="space-y-6">
          <UploadForm onSuccess={() => setIsUploadOpen(false)} />

          <div className="bg-primary-light/30 border border-primary-light rounded-2xl p-4 flex gap-4">
            <div className="text-primary">
              <Lightbulb size={24} />
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              <span className="font-bold text-primary italic">Tips: </span>
              Pastikan PDF Anda memiliki teks yang dapat dibaca (bukan hasil
              scan gambar) agar AI dapat memberikan rangkuman yang lebih akurat
              dan berkualitas.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
