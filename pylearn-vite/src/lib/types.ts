export interface VizData {
  type: string
  data: any
}

export interface SlideExplanation {
  points: string[]
  highlight: string
}

export interface SlideSolution {
  approach: string
  code: string
  timeComplexity?: string
  spaceComplexity?: string
  explanationPoints?: string[]
}

export interface Slide {
  id: string | number
  language?: 'python' | 'sql'
  section?: string
  topic?: string
  step?: string
  category: string
  categoryLabel: string
  tag: string
  question: string
  explanation: SlideExplanation
  code: string
  tip: string
  viz: VizData
  solution?: SlideSolution
}

export function isPracticeSlide(slide?: Slide | null): boolean {
  if (!slide) return false
  return Boolean(
    slide.solution ||
    slide.viz?.type === 'solution' ||
    slide.category === 'practice' ||
    (typeof slide.step === 'string' && slide.step.includes('-P')) ||
    (typeof slide.tag === 'string' && slide.tag.toLowerCase().includes('practice')) ||
    (typeof slide.question === 'string' && slide.question.toLowerCase().startsWith('practice'))
  )
}

export interface CourseMeta {
  id: string
  title: string
  subtitle: string
  emoji: string
  color: string
  level: string
  estimatedTime: string
  topics: string[]
  description: string
}
