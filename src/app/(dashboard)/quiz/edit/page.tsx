"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import {
  generateQuizPdf,
  markdownToQuestions,
} from "@/lib/generateQuizPdf";

import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function QuizEditPage() {
  const router = useRouter();
  const params = useSearchParams();

  // The result page stores content in sessionStorage under this key
  const [value, setValue] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("Quiz");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const stored = sessionStorage.getItem("quiz_edit_content");
    const storedTitle = sessionStorage.getItem("quiz_edit_title");
    if (stored) setValue(stored);
    if (storedTitle) setTitle(storedTitle);
    setMounted(true);
  }, [params]);

  const handleDownloadPdf = () => {
    const questions = markdownToQuestions(value);
    generateQuizPdf(title, questions);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Edit Quiz</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Edit the content below, then download as PDF.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleDownloadPdf}
          leftIcon={<Download size={16} />}
          className="rounded-xl shadow-md shadow-primary/20">
          Download as PDF
        </Button>
      </div>

      {/* Title input */}
      <Card className="p-4 border-none shadow-sm">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
          Document Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 font-semibold"
          placeholder="Quiz title..."
        />
      </Card>

      {/* Format guide */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 flex gap-3">
        <FileText size={16} className="text-primary mt-0.5 shrink-0" />
        <div className="text-xs text-gray-600 leading-relaxed space-y-0.5">
          <p className="font-bold text-primary mb-1">Markdown Format Guide</p>
          <p><span className="font-mono bg-white/60 px-1 rounded">1. Question text</span> — question number and text</p>
          <p><span className="font-mono bg-white/60 px-1 rounded">A. Option text</span> — answer options (A–E)</p>
        </div>
      </div>

      {/* Editor */}
      {mounted && (
        <div
          data-color-mode="light"
          className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
          style={{ minHeight: 520 }}>
          <MDEditor
            value={value}
            onChange={(v) => setValue(v ?? "")}
            height={560}
            preview="edit"
            style={{ borderRadius: 0 }}
          />
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex gap-3 justify-end pb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleDownloadPdf}
          leftIcon={<Download size={16} />}
          className="shadow-md shadow-primary/20">
          Download as PDF
        </Button>
      </div>
    </div>
  );
}
