'use client'

import * as React from 'react'
import { PenLine } from 'lucide-react'
import { Textarea } from '@/components/shared/Textarea'
import { Button } from '@/components/shared/Button'
import { useUpdateSummaryMutation } from '@/queries/useModuleQuery'
import { useToast } from '@/components/shared/Toast'

interface SummaryEditorProps {
  moduleId: string
  initialSummary: string
}

export function SummaryEditor({ moduleId, initialSummary }: SummaryEditorProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [summary, setSummary] = React.useState(initialSummary)
  const [draft, setDraft] = React.useState(initialSummary)
  const { toast } = useToast()
  
  const { mutate: updateSummary, isPending } = useUpdateSummaryMutation(moduleId)

  const handleSave = () => {
    if (!draft.trim()) {
      toast.error('Summary tidak boleh kosong')
      return
    }

    updateSummary({ summary: draft }, {
      onSuccess: () => {
        setSummary(draft)
        setIsEditing(false)
        toast.success('Summary berhasil diperbarui')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui summary')
      }
    })
  }

  const handleCancel = () => {
    setDraft(summary)
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/30">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
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
            className="text-xs font-bold"
          >
            Edit Summary
          </Button>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[400px] leading-relaxed rounded-2xl p-4 focus:ring-primary/20 text-black"
              placeholder="Tulis summary di sini..."
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleCancel} disabled={isPending}>
                Batal
              </Button>
              <Button 
                onClick={handleSave} 
                loading={isPending}
                className="px-8 shadow-sm shadow-primary/20"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
        )}
      </div>
    </div>
  )
}
