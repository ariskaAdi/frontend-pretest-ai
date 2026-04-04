"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenLine } from "lucide-react";
import { Textarea } from "@/components/shared/Textarea";
import { Button } from "@/components/shared/Button";
import { useUpdateSummaryMutation } from "@/queries/useModuleQuery";
import { useToast } from "@/components/shared/Toast";

const summarySchema = z.object({
  summary: z.string().min(1, "Summary tidak boleh kosong"),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

interface SummaryEditorProps {
  moduleId: string;
  initialSummary: string;
}

export function SummaryEditor({
  moduleId,
  initialSummary,
}: SummaryEditorProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [summary, setSummary] = React.useState(initialSummary);
  const { toast } = useToast();

  const { mutate: updateSummary, isPending } =
    useUpdateSummaryMutation(moduleId);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: { summary: initialSummary },
  });

  const onSubmit = (values: SummaryFormValues) => {
    updateSummary(
      { summary: values.summary },
      {
        onSuccess: () => {
          setSummary(values.summary);
          setIsEditing(false);
          toast.success("Summary berhasil diperbarui");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(
            error.response?.data?.error || "Gagal memperbarui summary",
          );
        },
      },
    );
  };

  const handleCancel = () => {
    resetForm({ summary });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl border shadow-md border-gray-100  overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 ">
          <span className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
            <PenLine size={16} />
          </span>
          AI Summary
        </h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-md font-bold">
            Edit Summary
          </Button>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              {...register("summary")}
              className="min-h-100 leading-relaxed rounded-2xl p-4 focus:ring-primary/20 text-black"
              placeholder="Tulis summary di sini..."
            />
            {errors.summary && (
              <p className="text-xs text-danger ml-1 mt-1">
                {errors.summary.message}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isPending}>
                Batal
              </Button>
              <Button
                type="submit"
                loading={isPending}
                className="px-8 shadow-sm shadow-primary/20">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
        )}
      </div>
    </div>
  );
}