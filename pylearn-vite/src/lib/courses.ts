import { CourseMeta, Slide } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

export interface CourseTopicGroup {
  topic: string
  slides: Slide[]
}

export interface CourseSection {
  section: string
  order: number
  topics: CourseTopicGroup[]
}

export interface CourseSummary {
  slug: string
  meta: CourseMeta
  slideCount: number
  sectionCount: number
}

export interface CourseData {
  slug: string
  meta: CourseMeta
  sections: CourseSection[]
  slides: Slide[]
}

let cachedCatalog: CourseSummary[] | null = null
const courseCache = new Map<string, CourseData>()

export async function fetchAllCourses(): Promise<CourseSummary[]> {
  if (cachedCatalog) return cachedCatalog

  const res = await fetch(`${API_BASE}/courses`)
  if (!res.ok) {
    throw new Error(`Failed to fetch courses (${res.status})`)
  }
  const data = await res.json()
  cachedCatalog = data.courses || []
  return cachedCatalog!
}

export async function fetchCourseBySlug(slug: string): Promise<CourseData | null> {
  if (courseCache.has(slug)) {
    return courseCache.get(slug)!
  }

  const res = await fetch(`${API_BASE}/courses/${encodeURIComponent(slug)}`)
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch course '${slug}' (${res.status})`)
  }

  const data: CourseData = await res.json()
  courseCache.set(slug, data)
  return data
}
