'use client'

import { Slide } from '@/lib/types'
import CodeEditorPanel from '@/components/editor/CodeEditorPanel'

interface Props { slide: Slide }

export default function RightPanel({ slide }: Props) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <CodeEditorPanel slide={slide} />
    </div>
  )
}
