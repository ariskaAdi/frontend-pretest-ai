"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { WelcomeBanner } from "@/components/features/dashboard/WelcomeBanner";
import { StatCard } from "@/components/features/dashboard/StatCard";
import { useModulesQuery } from "@/queries/useModuleQuery";
import { useQuizHistoryQuery } from "@/queries/useQuizQuery";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Spinner } from "@/components/shared/Spinner";
import {
  BookOpen,
  CheckCircle2,
  Zap,
  FileText,
  Target,
  Shield,
} from "lucide-react";
import { useGetMeQuery } from "@/queries/useUserQuery";
import type { Module } from "@/types/module.types";
import Link from "next/link";

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");
  const { data: user } = useGetMeQuery();
  const { data: modules, isLoading: isLoadingModules } = useModulesQuery();
  const { data: quizHistory, isLoading: isLoadingQuiz } = useQuizHistoryQuery();

  const stats = React.useMemo(() => {
    const totalModules = modules?.length || 0;
    const finishedQuizzes = quizHistory?.length || 0;
    const avgScore = quizHistory?.length
      ? Math.round(
          quizHistory.reduce((acc, q) => acc + (q.score || 0), 0) /
            quizHistory.length,
        )
      : 0;

    const baseStats = [
      {
        label: t("statTotalModules"),
        value: totalModules,
        icon: <BookOpen size={20} />,
        variant: "info" as const,
        description: t("statTotalModulesDesc"),
      },
      {
        label: t("statCompletedQuizzes"),
        value: finishedQuizzes,
        icon: <CheckCircle2 size={20} />,
        variant: "success" as const,
        description: t("statCompletedQuizzesDesc"),
      },
      {
        label: t("statAvgScore"),
        value: `${avgScore}%`,
        icon: <Zap size={20} />,
        variant: "warning" as const,
        description: t("statAvgScoreDesc"),
      },
    ];

    if (user?.role === "admin") {
      return [
        ...baseStats,
        {
          label: t("statAdminAccess"),
          value: t("statAdminAccessValue"),
          icon: <Shield size={20} />,
          variant: "default" as const,
          description: t("statAdminAccessDesc"),
        },
      ];
    }

    return baseStats;
  }, [modules, quizHistory, user, t]);

  if (isLoadingModules || isLoadingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium animate-pulse text-sm">
          {t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <WelcomeBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${i * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Two Column Layout for Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Modules */}
        <Card className="p-6 border-none shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">{t("recentModules")}</h3>
            <Link href="/modules">
              <button className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                {t("viewAll")}
              </button>
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {!modules || modules.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-400 text-sm">{t("noModules")}</p>
              </div>
            ) : (
              (modules as Module[]).slice(0, 3).map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                      <FileText size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary-hover transition-colors">
                        {module.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(module.created_at).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={module.is_summarized ? "success" : "warning"}
                    className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
                    {module.is_summarized ? t("moduleReady") : t("moduleProcessing")}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Quizzes */}
        <Card className="p-6 border-none shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">{t("recentQuizzes")}</h3>
            <Link href="/quiz">
              <button className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                {t("viewAll")}
              </button>
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {!quizHistory || quizHistory.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-400 text-sm">{t("noQuizzes")}</p>
              </div>
            ) : (
              quizHistory.slice(0, 3).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                      <Target size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-warning transition-colors">
                        {quiz.module_title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {quiz.num_questions} {t("quizQuestions")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-gray-900">
                      {quiz.score ?? "-"}
                      {quiz.score !== null ? "%" : ""}
                    </p>
                    <p className="text-[10px] text-gray-400">{t("score")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
