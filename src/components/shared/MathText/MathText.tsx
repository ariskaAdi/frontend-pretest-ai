'use client'

import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface MathTextProps {
  text: string
  className?: string
}

// Split teks menjadi segmen: teks biasa, $inline$, atau $$block$$
function parseSegments(text: string): Array<{ type: 'text' | 'inline' | 'block'; content: string }> {
  const segments: Array<{ type: 'text' | 'inline' | 'block'; content: string }> = []
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    const raw = match[0]
    if (raw.startsWith('$$')) {
      segments.push({ type: 'block', content: raw.slice(2, -2) })
    } else {
      segments.push({ type: 'inline', content: raw.slice(1, -1) })
    }
    lastIndex = match.index + raw.length
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return segments
}

export function MathText({ text, className }: MathTextProps) {
  const segments = parseSegments(text)
  const hasBlock = segments.some(s => s.type === 'block')

  // Jika ada block math, render sebagai div; jika tidak, render inline
  const Tag = hasBlock ? 'div' : 'span'

  return (
    <Tag className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'block') {
          return (
            <div key={i} className="my-2 overflow-x-auto">
              <BlockMath math={seg.content} />
            </div>
          )
        }
        if (seg.type === 'inline') {
          return <InlineMath key={i} math={seg.content} />
        }
        return <span key={i}>{seg.content}</span>
      })}
    </Tag>
  )
}
