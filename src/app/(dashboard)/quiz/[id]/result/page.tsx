/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Trophy, RotateCcw, Download, Pencil, FileDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useQuizResultQuery,
  useRetryQuizMutation,
} from "@/queries/useQuizQuery";
import { QuizResult } from "@/components/features/quiz";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Spinner } from "@/components/shared/Spinner";
import { Modal } from "@/components/shared/Modal";
import { useToast } from "@/components/shared/Toast";
import {
  generateQuizPdf,
  questionsToMarkdown,
} from "@/lib/generateQuizPdf";

export default function QuizResultPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useTranslations("QuizResultPage");

  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  const cachedResult = queryClient.getQueryData(["quiz", "result", id]);
  const { data: result, isLoading } = useQuizResultQuery(id);
  const displayData = (cachedResult || result) as any;

  const { mutate: retryQuiz, isPending: isRetrying } = useRetryQuizMutation();

  const handleRetry = () => {
    retryQuiz(id, {
      onSuccess: (res) => {
        const newQuiz = res.data.data;
        toast.success(t("toastRetrying"));
        router.push(`/quiz/${newQuiz.id}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || t("toastRetryFailed"));
      },
    });
  };

  const getQuestions = () =>
    (displayData?.questions ?? []).map((q: any) => ({
      text: q.text,
      options: q.options,
    }));

  const handleDownloadPdf = () => {
    const questions = getQuestions();
    if (!questions.length) { toast.error(t("toastNoQuestions")); return; }
    generateQuizPdf(displayData.module_title ?? "Quiz", questions);
    setIsExportModalOpen(false);
  };

  const handleEditQuiz = () => {
    const questions = getQuestions();
    if (!questions.length) { toast.error(t("toastNoQuestions")); return; }
    const md = questionsToMarkdown(displayData.module_title ?? "Quiz", questions);
    sessionStorage.setItem("quiz_edit_content", md);
    sessionStorage.setItem("quiz_edit_title", displayData.module_title ?? "Quiz");
    setIsExportModalOpen(false);
    router.push("/quiz/edit");
  };

  if (isLoading && !cachedResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{t("notFound")}</p>
        <Button onClick={() => router.push("/quiz")} className="mt-4">{t("back")}</Button>
      </div>
    );
  }

  const isPassed = displayData.score >= 70;

  return (
    <div className="max-w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Score Header */}
      <Card className="p-10 border-none shadow-lg shadow-primary/5 rounded-[40px] bg-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-warning/10 rounded-full translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">
            {t("finalScore")}
          </p>
          <div className="flex flex-col items-center justify-center mb-6">
            <span className={`text-8xl font-black ${isPassed ? "text-success" : "text-danger"}`}>
              {displayData.score}
            </span>
            <span className="text-gray-300 font-bold">{t("outOf")}</span>
          </div>

          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-wider mb-8
            ${isPassed ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {isPassed ? (
              <><Trophy size={16} /> {t("passed")}</>
            ) : (
              <><RotateCcw size={16} /> {t("tryAgain")}</>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={handleRetry}
              className="flex-1 rounded-2xl font-bold py-6 text-base shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              loading={isRetrying}>
              <RotateCcw size={20} /> {t("retryQuiz")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsExportModalOpen(true)}
              className="flex-1 rounded-2xl font-bold py-6 text-base flex items-center justify-center gap-2">
              <Download size={18} /> {t("downloadQuiz")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/modules")}
              className="flex-1 rounded-2xl font-bold py-6 text-base">
              {t("backToModules")}
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm text-center">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{t("totalQuestions")}</p>
          <p className="text-2xl font-black text-gray-900">{displayData.num_questions}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm text-center">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{t("correct")}</p>
          <p className="text-2xl font-black text-success">
            {displayData.questions.filter((q: any) => q.is_correct).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm text-center col-span-2 md:col-span-1">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{t("incorrect")}</p>
          <p className="text-2xl font-black text-danger">
            {displayData.questions.filter((q: any) => !q.is_correct).length}
          </p>
        </div>
      </div>

      {/* Detail Review */}
      <QuizResult questions={displayData.questions} />

      {/* Export Modal */}
      <Modal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={t("exportModalTitle")}
        size="sm">
        <div className="flex flex-col gap-3 py-2">
          <button
            onClick={handleEditQuiz}
            className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-left group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <Pencil size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{t("editQuiz")}</p>
              <p className="text-xs text-gray-400">{t("editQuizDesc")}</p>
            </div>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-left group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <FileDown size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{t("downloadPdf")}</p>
              <p className="text-xs text-gray-400">{t("downloadPdfDesc")}</p>
            </div>
          </button>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all duration-200 text-left group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-red-500 flex items-center justify-center shrink-0">
              <X size={18} />
            </div>
            <div>
              <p className="font-bold text-red-500 text-sm">{t("cancel")}</p>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  );
}
