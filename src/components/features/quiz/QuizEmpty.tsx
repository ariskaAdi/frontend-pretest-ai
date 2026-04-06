import * as React from "react";
import Link from "next/link";
import { Target } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";

export function QuizEmpty() {
  const t = useTranslations("QuizEmpty");

  return (
    <Card className="flex flex-col items-center justify-center p-12 py-20 bg-gray-50 border-dashed border-2 border-gray-300 shadow-sm rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-24 h-24 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-6">
        <Target size={48} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{t("title")}</h3>
      <p className="text-gray-400 text-center max-w-sm mb-8">{t("desc")}</p>
      <Link href="/modules">
        <Button className="rounded-xl px-8 font-bold">{t("selectModule")}</Button>
      </Link>
    </Card>
  );
}
