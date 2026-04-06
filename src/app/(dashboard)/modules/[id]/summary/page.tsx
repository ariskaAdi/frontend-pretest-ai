"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useModuleDetailQuery } from "@/queries/useModuleQuery";
import { SummaryEditor } from "@/components/features/module";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/shared/Button";
import { Loader2, Target } from "lucide-react";

export default function ModuleSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("ModuleSummaryPage");
  const id = params.id as string;

  const { data: module, isLoading } = useModuleDetailQuery(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t("notFound")}</h3>
        <Link href="/modules">
          <Button variant="ghost" className="mt-4">{t("backToCollection")}</Button>
        </Link>
      </div>
    );
  }

  if (!module.is_summarized) {
    return (
      <div className="flex flex-col items-center justify-center py-40 max-w-md mx-auto text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="w-20 h-20 bg-warning/10 text-warning rounded-3xl flex items-center justify-center mb-6">
          <Loader2 className="animate-spin" size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t("aiProcessing")}</h3>
        <p className="text-gray-500 mb-8 leading-relaxed">{t("aiProcessingDesc")}</p>
        <Link href={`/modules/${id}`}>
          <Button variant="ghost">{t("cancelBack")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col gap-2">
        <Link
          href={`/modules/${id}`}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors w-fit group">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {t("backToDetail")}
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight line-clamp-2">
              {t("summaryPrefix")} {module.title}
            </h1>
            <p className="text-sm text-gray-500">{t("summaryDesc")}</p>
          </div>
        </div>
      </div>

      <SummaryEditor moduleId={id} initialSummary={module.summary} />

      <div className="flex justify-center pt-8">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500 italic">{t("quoteText")}</p>
          <Link href={`/quiz?module_id=${id}`}>
            <Button
              size="lg"
              className="px-12 rounded-2xl font-bold shadow-md shadow-primary/20 flex items-center gap-2">
              {t("continueQuiz")} <Target size={20} strokeWidth={2.5} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
