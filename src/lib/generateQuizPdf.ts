import { jsPDF } from "jspdf";

export interface PdfQuestion {
  text: string;
  options: string[];
}

export function generateQuizPdf(title: string, questions: PdfQuestion[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const marginY = 14;
  const contentW = pageW - marginX * 2;
  const numIndent = 6;   // indent for question number prefix
  const optIndent = 10;  // indent for A/B/C/D options

  let y = marginY;

  // ── helpers ────────────────────────────────────────────────────────────
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - marginY) {
      doc.addPage();
      y = marginY;
    }
  };

  const text = (
    str: string,
    x: number,
    yPos: number,
    opts?: { align?: "center" | "left" | "right"; maxWidth?: number },
  ) => doc.text(str, x, yPos, opts as Parameters<typeof doc.text>[3]);

  const wrap = (str: string, maxW: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(str, maxW);
  };

  // ── Title block ─────────────────────────────────────────────────────────
  doc.setFillColor(242, 242, 242);
  doc.roundedRect(marginX, y, contentW, 20, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  text(title, pageW / 2, y + 8, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  text(`${questions.length} Questions`, pageW / 2, y + 15, { align: "center" });

  y += 26;

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(marginX, y, marginX + contentW, y);
  y += 6;

  // ── Questions ──────────────────────────────────────────────────────────
  questions.forEach((q, idx) => {
    const num = `${idx + 1}.`;
    const questionMaxW = contentW - numIndent;

    // Measure question lines
    const qLines = wrap(q.text, questionMaxW, 9);
    const optLines = q.options.map((opt) => wrap(opt, contentW - optIndent, 8.5));
    const blockH =
      qLines.length * 4.8 +
      optLines.reduce((s, l) => s + l.length * 4.5, 0) +
      8; // bottom padding

    ensureSpace(blockH);

    // Question number + text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    text(num, marginX, y);

    qLines.forEach((line, li) => {
      text(line, marginX + numIndent, y + li * 4.8);
    });
    y += qLines.length * 4.8 + 2;

    // Options
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);

    optLines.forEach((lines) => {
      lines.forEach((line, li) => {
        text(line, marginX + optIndent, y + li * 4.5);
      });
      y += lines.length * 4.5 + 0.5;
    });

    y += 5; // gap between questions
  });

  // ── Footer on every page ───────────────────────────────────────────────
  const totalPages =
    (doc.internal as unknown as { pages: unknown[] }).pages.length - 1;

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.line(marginX, pageH - 10, marginX + contentW, pageH - 10);
    text(
      `${title}  —  Page ${p} of ${totalPages}`,
      pageW / 2,
      pageH - 5,
      { align: "center" },
    );
  }

  const safe = title
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  doc.save(`${safe || "quiz"}.pdf`);
}

// ── Markdown → PdfQuestion ─────────────────────────────────────────────────
export function markdownToQuestions(md: string): PdfQuestion[] {
  const questions: PdfQuestion[] = [];
  let current: PdfQuestion | null = null;

  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (qMatch) {
      if (current) questions.push(current);
      current = { text: qMatch[2], options: [] };
      continue;
    }

    const optMatch = line.match(/^(?:\*\*)?([A-Ea-e])[.)]\s*\*?\*?(.+)/);
    if (optMatch && current) {
      current.options.push(`${optMatch[1].toUpperCase()}. ${optMatch[2].trim()}`);
    }
  }

  if (current) questions.push(current);
  return questions;
}

// ── Questions → Markdown ────────────────────────────────────────────────────
export function questionsToMarkdown(
  moduleTitle: string,
  questions: { text: string; options: string[] }[],
): string {
  const header = `# ${moduleTitle}\n\n`;
  const body = questions
    .map((q, i) => `${i + 1}. ${q.text}\n${q.options.join("\n")}`)
    .join("\n\n");
  return header + body;
}
