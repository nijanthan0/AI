import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchCourseBySlug, CourseData } from '../lib/courses'
import SlidePlayer from '../components/SlidePlayer'
import { ErrorBoundary } from '../components/common/ErrorBoundary'

export default function CoursePage() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (!courseSlug) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    fetchCourseBySlug(courseSlug)
      .then((data) => {
        if (active) {
          setCourse(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load course')
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [courseSlug])

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#121316] text-white font-mono gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#facc15] border-2 border-black shadow-brutal-sm flex items-center justify-center text-black font-black animate-bounce">
          ⚡
        </div>
        <p className="text-sm font-bold text-zinc-300">Loading course from PyLearn API...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] gap-4">
        <h1 className="text-2xl font-bold">{error ? 'Failed to Load Course' : 'Course Not Found'}</h1>
        <p className="text-[var(--text-muted)] text-sm">
          {error || `Could not find course with slug: "${courseSlug}"`}
        </p>
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-fg)] font-semibold text-sm"
        >
          ← Return to Home
        </Link>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallbackTitle="Course Session Interrupted"
      fallbackMessage="An unexpected error occurred while loading this slide. Click retry or return to dashboard."
      onReset={() => window.location.reload()}
    >
      <SlidePlayer
        slides={course.slides}
        meta={course.meta}
        courseSlug={course.slug}
      />
    </ErrorBoundary>
  )
}
