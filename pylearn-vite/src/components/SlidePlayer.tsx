'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Slide, CourseMeta, isPracticeSlide } from '@/lib/types'
import { api } from '@/lib/api'
import Header from './layout/Header'
import Footer from './layout/Footer'
import LeftPanel from './layout/LeftPanel'
import RightPanel from './layout/RightPanel'
import TopicSidebar from './layout/TopicSidebar'
import VizEngine from './viz/VizEngine'
import QuestionBlock from './content/QuestionBlock'
import ExplanationBlock from './content/ExplanationBlock'

interface Props {
  slides: Slide[]
  meta: CourseMeta
  courseSlug: string
}

export default function SlidePlayer({ slides, meta, courseSlug }: Props) {
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    presenterMode,
    fontSize,
    theme,
    toggleSidebar,
    zoomedPanel,
    setZoomedPanel,
    viewMode
  } = useAppStore()
  const slide = slides[currentSlide]

  // Keyboard navigation
  const handleKey = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'TEXTAREA' || tag === 'INPUT') return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide(slides.length)
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevSlide()
    if (e.key === 'p' || e.key === 'P') useAppStore.getState().togglePresenterMode()
    if (e.key === 'm' || e.key === 'M') toggleSidebar()
    if (e.key === 'Escape') {
      if (useAppStore.getState().sidebarOpen) {
        useAppStore.getState().setSidebarOpen(false)
        return
      }
      if (zoomedPanel !== 'none') setZoomedPanel('none')
    }
  }, [nextSlide, prevSlide, slides.length, toggleSidebar, zoomedPanel, setZoomedPanel])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
    document.documentElement.style.setProperty('--font-scale', String(fontSize / 14))
  }, [theme, fontSize])

  // Always keep the left menu bar closed by default on load
  useEffect(() => {
    useAppStore.getState().setSidebarOpen(false)
  }, [courseSlug])

  // Automatically sync progress to cloud when student visits or completes a slide
  useEffect(() => {
    if (slide) {
      api.syncProgress(courseSlug, slide.id, true)
    }
  }, [currentSlide, courseSlug, slide])

  if (!slide) return <div className="h-screen flex items-center justify-center text-[var(--text-muted)]">No slides found.</div>

  const isPractice = isPracticeSlide(slide)
  // In practice questions, 'content-visual' has no code editor, so automatically bring to 4-screen (all-four) layout
  const effectiveViewMode = (isPractice && viewMode === 'content-visual') ? 'all-four' : viewMode

  const isEditorFullscreen = zoomedPanel === 'editor'
  const isAnyFullscreen = isEditorFullscreen || effectiveViewMode === 'content'

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] overflow-hidden">
      {!presenterMode && (
        <Header
          meta={meta}
          currentSlide={currentSlide}
          totalSlides={slides.length}
          slide={slide}
          courseSlug={courseSlug}
        />
      )}

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Collapsible Topics Sidebar (hidden in full content or editor fullscreen to maximize view) */}
        {!isAnyFullscreen && (
          <TopicSidebar slides={slides} meta={meta} currentSlide={currentSlide} />
        )}

        {/* VIEW MODE 1: Show only content page fully */}
        {effectiveViewMode === 'content' && (
          <div className="w-full h-full flex flex-col overflow-hidden bg-[#121316]">
            <QuestionBlock slide={slide} />
            <div className="flex-1 overflow-y-auto px-8 md:px-16 py-8">
              <ExplanationBlock explanation={slide.explanation} isFullscreen={true} />
            </div>
          </div>
        )}

        {/* VIEW MODE 2: Show live and content side by side */}
        {effectiveViewMode === 'content-visual' && (
          <div className="flex-1 flex h-full overflow-hidden min-h-0">
            {/* Left 50%: Content */}
            <div className="w-1/2 flex flex-col h-full overflow-hidden border-r-2 border-black bg-[#121316]">
              <QuestionBlock slide={slide} />
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <ExplanationBlock explanation={slide.explanation} isFullscreen={false} />
              </div>
            </div>

            {/* Right 50%: Live Interactive Visual in Full Height */}
            <div className="w-1/2 flex flex-col h-full overflow-hidden bg-[#14151e]">
              <VizEngine viz={slide.viz} solution={slide.solution} slideId={String(slide.id)} />
            </div>
          </div>
        )}

        {/* VIEW MODE 3: All 4 thing (Content, Visual, Code Editor, Terminal) */}
        {effectiveViewMode === 'all-four' && (
          isEditorFullscreen ? (
            <div className="w-full flex flex-col h-full overflow-hidden min-h-0">
              <RightPanel slide={slide} key={`right-${slide.id}`} />
            </div>
          ) : (
            <div className="flex-1 flex h-full overflow-hidden min-h-0">
              {/* Left Column (50%): Content (Top) + Live Visual (Bottom) */}
              <div className="w-1/2 flex flex-col h-full overflow-hidden min-h-0">
                <LeftPanel slide={slide} key={`left-${slide.id}`} />
              </div>

              {/* Right Column (50%): Code Editor (Top) + Terminal (Bottom) */}
              <div className="w-1/2 flex flex-col h-full overflow-hidden min-h-0">
                <RightPanel slide={slide} key={`right-${slide.id}`} />
              </div>
            </div>
          )
        )}
      </div>

      {!presenterMode && (
        <Footer
          currentSlide={currentSlide}
          totalSlides={slides.length}
          slides={slides}
          tip={slide.tip}
        />
      )}
    </div>
  )
}
