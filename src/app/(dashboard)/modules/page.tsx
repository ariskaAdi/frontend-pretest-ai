"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  ModuleList,
  ModuleEmpty,
  UploadForm,
} from "@/components/features/module";
import { useModulesQuery } from "@/queries/useModuleQuery";
import { Button } from "@/components/shared/Button";
import { Spinner } from "@/components/shared/Spinner";
import { Modal } from "@/components/shared/Modal";
import { Lightbulb } from "lucide-react";

export default function ModulesPage() {
  const t = useTranslations("ModulesPage");
  const { data: modules, isLoading } = useModulesQuery();
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-gray-500">{t("subtitle")}</p>
        </div>
        <Button
          onClick={() => setIsUploadOpen(true)}
          className="rounded-2xl px-6 shadow-md shadow-primary/20 font-bold">
          {t("uploadButton")}
        </Button>
        <Modal
          size="xl"
          open={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          title={t("uploadModalTitle")}>
          <div className="space-y-6">
            <UploadForm onSuccess={() => setIsUploadOpen(false)} />

            <div className="bg-primary-light/30 border border-primary-light rounded-2xl p-4 flex gap-4">
              <div className="text-primary">
                <Lightbulb size={24} />
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-primary italic">{t("uploadTipsLabel")} </span>
                {t("uploadTips")}
              </div>
            </div>
          </div>
        </Modal>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">
            {t("loading")}
          </p>
        </div>
      ) : !modules || modules.length === 0 ? (
        <ModuleEmpty />
      ) : (
        <ModuleList modules={modules} />
      )}
    </div>
  );
}
