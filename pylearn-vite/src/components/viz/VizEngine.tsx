'use client'

import React, { useState } from 'react'
import { VizData, SlideSolution } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import VizVariables from './VizVariables'
import VizList from './VizList'
import VizDict from './VizDict'
import VizFunction from './VizFunction'
import VizOOP from './VizOOP'
import VizInheritance from './VizInheritance'
import VizAIHierarchy from './VizAIHierarchy'
import VizTrainingLoop from './VizTrainingLoop'
import VizTuple from './VizTuple'
import VizSet from './VizSet'
import VizStack from './VizStack'
import VizDecorator from './VizDecorator'
import VizGateSecurity from './VizGateSecurity'
import VizDriverCar from './VizDriverCar'
import VizTypeCasting from './VizTypeCasting'
import VizLinkedList from './VizLinkedList'
import VizBST from './VizBST'
import VizHashTable from './VizHashTable'
import VizContextManager from './VizContextManager'
import VizAsyncEventLoop from './VizAsyncEventLoop'
import VizPydantic from './VizPydantic'
import VizRegex from './VizRegex'
import VizSorting from './VizSorting'
import VizHeap from './VizHeap'
import VizComprehensions from './VizComprehensions'
import VizSolution from './VizSolution'
import VizTestRunner from './VizTestRunner'
import VizSQLTable from './VizSQLTable'
import VizSQLJoin from './VizSQLJoin'
import VizSQLQuiz from './VizSQLQuiz'
import VizCaseFile from './VizCaseFile'
import VizSyntaxPEP8 from './VizSyntaxPEP8'
import VizStringSlicing from './VizStringSlicing'
import VizEqualityIdentity from './VizEqualityIdentity'
import VizLoopControl from './VizLoopControl'
import VizExceptionFlow from './VizExceptionFlow'
import VizGeneratorYield from './VizGeneratorYield'
import VizGILConcurrency from './VizGILConcurrency'
import VizPathEnv from './VizPathEnv'
import VizBitwise from './VizBitwise'
import VizTypeInspector from './VizTypeInspector'
import VizPackagingVenv from './VizPackagingVenv'
import VizKeywords from './VizKeywords'
import VizIdentifierRules from './VizIdentifierRules'
import VizArithmetic from './VizArithmetic'
import VizStringIndexing from './VizStringIndexing'
import VizBranching from './VizBranching'
import VizGradeEvaluator from './VizGradeEvaluator'
import VizLeapYear from './VizLeapYear'
import VizLinkedListReverse from './VizLinkedListReverse'
import VizCycleDetection from './VizCycleDetection'
import VizParentheses from './VizParentheses'
import VizLifoFifo from './VizLifoFifo'
import VizMinStack from './VizMinStack'
import VizExponentialBackoff from './VizExponentialBackoff'
import VizExecutionFlow from './VizExecutionFlow'
import VizTerminalSetup from './VizTerminalSetup'
import VizUserInputValidation from './VizUserInputValidation'
import VizConditionalsBranching from './VizConditionalsBranching'
import VizPackageManagers from './VizPackageManagers'
import { Sparkles, Lightbulb } from 'lucide-react'

interface Props {
  viz: VizData
  solution?: SlideSolution
  slideId?: string
  height?: number
  onSetHeight?: (h: number) => void
  initialRevealed?: boolean
  onHideSolution?: () => void
}

export default function VizEngine({
  viz,
  solution,
  slideId,
  height,
  onSetHeight,
  initialRevealed = false,
  onHideSolution
}: Props) {
  const [activeTab, setActiveTab] = useState<'viz' | 'solution'>('viz')
  const { zoomedPanel, setZoomedPanel } = useAppStore()
  const isVizFullscreen = zoomedPanel === 'viz'
  const isMinimized = height !== undefined && height <= 48

  const MAP: Record<string, React.ComponentType<{ data: any; solution?: SlideSolution; slideId?: string }>> = {
    variables:          VizVariables,
    list:               VizList,
    dict:               VizDict,
    function:           VizFunction,
    oop:                VizOOP,
    inheritance:        VizInheritance,
    tuple:              VizTuple,
    set:                VizSet,
    stack:              VizStack,
    decorator:          VizDecorator,
    gate:               VizConditionalsBranching,
    'driver-car':       VizDriverCar,
    'type-casting':     VizTypeCasting,
    'linked-list':      VizLinkedList,
    bst:                VizBST,
    'hash-table':       VizHashTable,
    'context-manager':  VizContextManager,
    'async-event-loop': VizAsyncEventLoop,
    pydantic:           VizPydantic,
    regex:              VizRegex,
    sorting:            VizSorting,
    heap:               VizHeap,
    comprehension:      VizComprehensions,
    solution:           VizSolution,
    'test-runner':      VizTestRunner,
    'ai-hierarchy':      VizAIHierarchy,
    'training-loop':     VizTrainingLoop,
    'sql-table':        VizSQLTable,
    'sql-join':         VizSQLJoin,
    'sql-quiz':         VizSQLQuiz,
    'case-file':        VizCaseFile,
    syntax:             VizSyntaxPEP8,
    'string-slicing':   VizStringSlicing,
    'equality-identity':VizEqualityIdentity,
    'loop-control':     VizLoopControl,
    'exception-flow':   VizExceptionFlow,
    'generator-yield':  VizGeneratorYield,
    'gil-concurrency':  VizGILConcurrency,
    'path-env':         VizPathEnv,
    bitwise:            VizBitwise,
    'type-inspector':   VizTypeInspector,
    'packaging-venv':   VizPackagingVenv,
    'keywords-matrix':  VizKeywords,
    'identifier-rules': VizIdentifierRules,
    'arithmetic-engine':VizArithmetic,
    'string-indexing':  VizStringIndexing,
    'branching-tree':   VizBranching,
    'grade-evaluator':  VizGradeEvaluator,
    'leap-year':        VizLeapYear,
    'linked-list-reverse': VizLinkedListReverse,
    'cycle-detection':  VizCycleDetection,
    'parentheses-matcher': VizParentheses,
    'lifo-fifo-compare':VizLifoFifo,
    'min-stack':        VizMinStack,
    'exponential-backoff': VizExponentialBackoff,
    'execution-flow':   VizExecutionFlow,
    'terminal-setup':   VizTerminalSetup,
    'user-input-validation': VizUserInputValidation,
    'conditionals-branching': VizConditionalsBranching,
    'package-managers': VizPackageManagers,
  }

  // If viz is 'solution', directly render solution view
  if (viz?.type === 'solution' || (!viz?.type && solution)) {
    return (
      <div className="p-3 h-full overflow-y-auto min-h-0 flex flex-col">
        <VizSolution
          data={viz?.data}
          solution={solution}
          slideId={slideId}
          initialRevealed={initialRevealed}
          onHide={onHideSolution}
        />
      </div>
    )
  }

  const Comp = MAP[viz?.type] || VizSolution

  // If both a visual and a solution exist, provide tabs
  const hasBoth = Boolean(solution) && viz?.type !== 'solution'

  return (
    <div className={`px-3.5 py-2.5 h-full overflow-hidden flex flex-col bg-[#14151e] ${isMinimized ? 'justify-center' : ''}`}>
      {hasBoth ? (
        <div className={`flex items-center justify-between ${isMinimized ? '' : 'mb-2.5 pb-2 border-b-2 border-black'}`}>
          <div className="flex items-center gap-2">
            {/* Traffic Light Dots (Same like Terminal) */}
            {onSetHeight && (
              <div className="flex gap-1.5 mr-1">
                <button
                  onClick={() => onSetHeight(38)}
                  title="Minimize Visualizer (38px)"
                  className="w-3 h-3 rounded-full bg-[#f87171] border border-black hover:opacity-80 transition-opacity"
                />
                <button
                  onClick={() => onSetHeight(320)}
                  title="Default Height (320px)"
                  className="w-3 h-3 rounded-full bg-[#facc15] border border-black hover:opacity-80 transition-opacity"
                />
                <button
                  onClick={() => onSetHeight(540)}
                  title="Large Height (540px)"
                  className="w-3 h-3 rounded-full bg-[#4ade80] border border-black hover:opacity-80 transition-opacity"
                />
              </div>
            )}

            <button
              onClick={() => setActiveTab('viz')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border-2 border-black ${
                activeTab === 'viz'
                  ? 'bg-[#22c55e] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#22232e] text-zinc-300 hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>LIVE VISUAL</span>
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border-2 border-black ${
                activeTab === 'solution'
                  ? 'bg-[#facc15] text-black shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                  : 'bg-[#22232e] text-zinc-300 hover:text-white'
              }`}
            >
              <Lightbulb size={13} />
              <span>OPTIMAL SOLUTION</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Height Presets (Same like Terminal) */}
            {onSetHeight && (
              <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 mr-1">
                <button
                  onClick={() => onSetHeight(38)}
                  className={`px-1.5 py-0.5 rounded hover:bg-[#27272a] hover:text-white text-xs transition-colors font-bold ${
                    isMinimized ? 'text-[#facc15] bg-[#27272a]' : ''
                  }`}
                  title="Minimize Visualizer (38px)"
                >
                  _
                </button>
                <button
                  onClick={() => onSetHeight(320)}
                  className={`px-1.5 py-0.5 rounded hover:bg-[#27272a] hover:text-white text-xs transition-colors ${
                    height === 320 ? 'text-[#a3e635] font-bold bg-[#27272a]' : ''
                  }`}
                  title="Default Height (320px)"
                >
                  ◻
                </button>
                <button
                  onClick={() => onSetHeight(540)}
                  className={`px-1.5 py-0.5 rounded hover:bg-[#27272a] hover:text-white text-xs transition-colors ${
                    height !== undefined && height >= 500 ? 'text-[#38bdf8] font-bold bg-[#27272a]' : ''
                  }`}
                  title="Large Height (540px)"
                >
                  ⤢
                </button>
                <span className="opacity-30">|</span>
              </div>
            )}

            <span className="sticker-badge bg-[#27272a] text-zinc-300 text-[10px]">
              #{activeTab === 'viz' ? viz.type : 'SOLUTION'}
            </span>
          </div>
        </div>
      ) : (
        <div className={`flex items-center justify-between ${isMinimized ? '' : 'mb-2 pb-1.5 border-b border-zinc-800'}`}>
          <div className="flex items-center gap-2">
            {/* Traffic Light Dots (Same like Terminal) */}
            {onSetHeight ? (
              <div className="flex gap-1.5 mr-1">
                <button
                  onClick={() => onSetHeight(38)}
                  title="Minimize Visualizer (38px)"
                  className="w-3 h-3 rounded-full bg-[#f87171] border border-black hover:opacity-80 transition-opacity"
                />
                <button
                  onClick={() => onSetHeight(320)}
                  title="Default Height (320px)"
                  className="w-3 h-3 rounded-full bg-[#facc15] border border-black hover:opacity-80 transition-opacity"
                />
                <button
                  onClick={() => onSetHeight(540)}
                  title="Large Height (540px)"
                  className="w-3 h-3 rounded-full bg-[#4ade80] border border-black hover:opacity-80 transition-opacity"
                />
              </div>
            ) : (
              <div className="flex gap-1.5 mr-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f87171] border border-black/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-black/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] border border-black/40" />
              </div>
            )}

            <span className="text-[11px] font-mono font-black text-white tracking-wider uppercase">
              🎨 Live Interactive Visual
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Height Presets (Same like Terminal) */}
            {onSetHeight && (
              <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 mr-1">
                <button
                  onClick={() => onSetHeight(38)}
                  className={`px-1.5 py-0.5 rounded hover:bg-[#27272a] hover:text-white text-xs transition-colors font-bold ${
                    isMinimized ? 'text-[#facc15] bg-[#27272a]' : ''
                  }`}
                  title="Minimize Visualizer (38px)"
                >
                  _
                </button>
                <button
                  onClick={() => onSetHeight(320)}
                  className={`px-1.5 py-0.5 rounded hover:bg-[#27272a] hover:text-white text-xs transition-colors ${
                    height === 320 ? 'text-[#a3e635] font-bold bg-[#27272a]' : ''
                  }`}
                  title="Default Height (320px)"
                >
                  ◻
                </button>
                <button
                  onClick={() => onSetHeight(540)}
                  className={`px-1.5 py-0.5 rounded hover:bg-[#27272a] hover:text-white text-xs transition-colors ${
                    height !== undefined && height >= 500 ? 'text-[#38bdf8] font-bold bg-[#27272a]' : ''
                  }`}
                  title="Large Height (540px)"
                >
                  ⤢
                </button>
                <span className="opacity-30">|</span>
              </div>
            )}

            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase">
              #{viz?.type}
            </span>
          </div>
        </div>
      )}

      {/* Visualizer content body (hidden when minimized) */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto min-h-0">
          <ErrorBoundary fallbackTitle="Diagram Visualizer Paused">
            {activeTab === 'solution' && solution ? (
              <VizSolution solution={solution} slideId={slideId} />
            ) : (
              <Comp data={viz?.data} solution={solution} slideId={slideId} />
            )}
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}
