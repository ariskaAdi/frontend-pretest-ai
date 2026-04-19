"use client";
import type { APIError } from '@/types/api.types'

import * as React from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { useGenerateQuizMutation } from "@/queries/useQuizQuery";
import { useToast } from "@/components/shared/Toast";

interface GenerateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  moduleId: string;
}

export function GenerateQuizModal({
  isOpen,
  onClose,
  moduleTitle,
  moduleId,
}: GenerateQuizModalProps) {
  const t = useTranslations("GenerateQuizModal");
  const [numQuestions, setNumQuestions] = React.useState<20 | 40 | 50>(20);
  const [duration, setDuration] = React.useState<30 | 60>(30);
  const { mutate: generateQuiz, isPending } = useGenerateQuizMutation();
  const { toast } = useToast();

  const handleStart = () => {
    generateQuiz(
      { module_id: moduleId, num_questions: numQuestions },
      {
        onSuccess: (res) => {
          const quiz = res.data.data;
          try {
            localStorage.setItem(`quiz-session-${quiz.id}`, JSON.stringify(quiz));
            localStorage.setItem(
              `quiz-timer-${quiz.id}`,
              JSON.stringify({
                durationMinutes: duration,
                startTime: new Date().toISOString(),
              })
            );
          } catch { /* localStorage unavailable */ }
          toast.success(t("toastSuccess"));
          window.open(`/take/${quiz.id}`, `quiz-${quiz.id}`);
          onClose();
        },
        onError: (error: APIError) => {
          toast.error(error.response?.data?.error || t("toastError"));
        },
      }
    );
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={t("title")}>
      <div className="space-y-6 pt-2">
        <div>
          <p className="text-sm text-gray-400 mb-1">{t("selectedModule")}</p>
          <p className="font-bold text-gray-900">{moduleTitle}</p>
        </div>

        {/* Question count */}
        <div>
          <p className="text-sm text-gray-400 mb-4">{t("selectQuestions")}</p>
          <div className="grid grid-cols-3 gap-3">
            {([20, 40, 50] as const).map((num) => (
              <button
                key={num}
                onClick={() => setNumQuestions(num)}
                className={`
                  py-4 rounded-2xl border-2 transition-all duration-200 font-bold text-lg
                  ${
                    numQuestions === num
                      ? "border-primary bg-white text-primary shadow-sm"
                      : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white"
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <p className="text-sm text-gray-400 mb-4">{t("selectDuration")}</p>
          <div className="grid grid-cols-2 gap-3">
            {([30, 60] as const).map((min) => (
              <button
                key={min}
                onClick={() => setDuration(min)}
                className={`
                  py-4 rounded-2xl border-2 transition-all duration-200 font-bold text-lg
                  ${
                    duration === min
                      ? "border-primary bg-white text-primary shadow-sm"
                      : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white"
                  }
                `}
              >
                {min} {t("minutes")}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 italic text-center">
          {t("aiNote")}
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1 rounded-xl text-red-600 border-none border-red-600 font-bold bg-white hover:bg-red-50"
            onClick={onClose}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            className="flex-1 rounded-xl font-bold"
            onClick={handleStart}
            loading={isPending}
          >
            {t("start")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
