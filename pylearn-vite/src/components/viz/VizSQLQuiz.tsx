import React, { useState } from 'react'
import { CheckCircle2, XCircle, HelpCircle, RotateCcw } from 'lucide-react'

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number // index of correct option
  explanation: string
}

interface Props {
  data?: {
    quizTitle?: string
    questions: QuizQuestion[]
  }
}

export default function VizSQLQuiz({ data }: Props) {
  const questions = data?.questions || []
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({})

  if (!questions.length) {
    return (
      <div className="p-4 text-center text-[var(--text-muted)] text-sm">
        No quiz questions available for this module.
      </div>
    )
  }

  const handleSelect = (qIdx: number, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
    setShowExplanation(prev => ({ ...prev, [qIdx]: true }))
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setShowExplanation({})
  }

  const answeredCount = Object.keys(selectedAnswers).length
  const correctCount = questions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.answer ? acc + 1 : acc
  }, 0)

  return (
    <div className="h-full flex flex-col p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4 flex-shrink-0">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle size={14} /> Concept Mastery Quiz
          </div>
          <div className="text-sm font-semibold text-[var(--text)]">
            {data?.quizTitle || 'Test Your Knowledge'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            Score: {correctCount} / {questions.length}
          </div>
          {answeredCount > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 transition-colors"
              title="Reset Quiz"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {questions.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx]
          const isAnswered = selected !== undefined
          const isCorrect = isAnswered && selected === q.answer

          return (
            <div
              key={qIdx}
              className={`p-4 rounded-xl border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-rose-500/5 border-rose-500/30'
                  : 'bg-[var(--bg-alt)] border-[var(--border)]'
              }`}
            >
              <div className="flex items-start gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="text-sm font-medium text-[var(--text)] leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 ml-7">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-blue-500/40 hover:text-[var(--text)]'

                  if (isAnswered) {
                    if (optIdx === q.answer) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                    } else if (selected === optIdx) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through'
                    } else {
                      btnStyle = 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-dim)] opacity-50'
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && optIdx === q.answer && (
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 ml-2" />
                      )}
                      {isAnswered && selected === optIdx && optIdx !== q.answer && (
                        <XCircle size={14} className="text-rose-400 flex-shrink-0 ml-2" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation Reveal */}
              {showExplanation[qIdx] && (
                <div className={`mt-3 ml-7 p-2.5 rounded-lg text-xs leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-200 border border-rose-500/20'
                }`}>
                  <span className="font-bold">{isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}</span>
                  {q.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
