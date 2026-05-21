"use client";

import type { QuizDiagram as IQuizDiagram } from "@/types/quiz.types";

interface QuizDiagramProps {
  diagram: IQuizDiagram;
  className?: string;
}

// Strip <script> tags dari SVG sebelum render — defense in depth
function sanitizeSVG(svg: string): string {
  return svg.replace(/<script[\s\S]*?<\/script>/gi, "");
}

export function QuizDiagram({ diagram, className }: QuizDiagramProps) {
  if (diagram.type !== "svg" || !diagram.content.trim().startsWith("<svg")) {
    return null;
  }

  return (
    <div
      className={`flex justify-center items-center rounded-2xl bg-gray-50 border border-gray-100 p-4 overflow-hidden ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: sanitizeSVG(diagram.content) }}
    />
  );
}
