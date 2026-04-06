"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  const [numQuestions, setNumQuestions] = React.useState<5 | 10 | 20>(5);
  const { mutate: generateQuiz, isPending } = useGenerateQuizMutation();
  const { toast } = useToast();
  const router = useRouter();

  const handleStart = () => {
    generateQuiz(
      { module_id: moduleId, num_questions: numQuestions },
      {
        onSuccess: (res) => {
          const quiz = res.data.data;
          toast.success(t("toastSuccess"));
          router.push(`/quiz/${quiz.id}`);
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || t("toastError"));
        },
      },
    );
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={t("title")}>
      <div className="space-y-6 pt-2">
        <div>
          <p className="text-sm text-gray-400 mb-1">{t("selectedModule")}</p>
          <p className="font-bold text-gray-900">{moduleTitle}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-4">{t("selectQuestions")}</p>
          <div className="grid grid-cols-3 gap-3">
            {[5, 10, 20].map((num) => (
              <button
                key={num}
                onClick={() => setNumQuestions(num as any)}
                className={`
                  py-4 rounded-2xl border-2 transition-all duration-200 font-bold text-lg
                  ${
                    numQuestions === num
                      ? "border-primary bg-white text-primary shadow-sm"
                      : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white"
                  }
                `}>
                {num}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-3 italic text-center">
            {t("aiNote")}
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1 rounded-xl text-red-600 border-none border-red-600 font-bold bg-white hover:bg-red-50"
            onClick={onClose}
            disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button
            className="flex-1 rounded-xl font-bold"
            onClick={handleStart}
            loading={isPending}>
            {t("start")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
