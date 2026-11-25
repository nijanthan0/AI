'use client'

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/lib/store'
import { Slide, CourseMeta, isPracticeSlide } from '@/lib/types'
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Sun,
  Moon,
  Presentation,
  Menu,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  CreditCard,
  Cloud,
  BookOpen,
  LayoutGrid,
  Columns
} from 'lucide-react'
import AuthModal from '@/components/modals/AuthModal'
import PythonLogo from '@/components/common/PythonLogo'

const CATEGORY_STICKERS: Record<string, { bg: string; text: string }> = {
  basics:      { bg: 'bg-[#a3e635]', text: 'text-black' },
  collections: { bg: 'bg-[#38bdf8]', text: 'text-black' },
  oop:         { bg: 'bg-[#f472b6]', text: 'text-black' },
  functions:   { bg: 'bg-[#facc15]', text: 'text-black' },
  concepts:    { bg: 'bg-[#c084fc]', text: 'text-black' },
  ml:          { bg: 'bg-[#2dd4bf]', text: 'text-black' },
  sql:         { bg: 'bg-[#38bdf8]', text: 'text-black' },
}

interface Props {
  meta: CourseMeta
  currentSlide: number
  totalSlides: number
  slide: Slide
  courseSlug: string
}

export default function Header({ meta, currentSlide, totalSlides, slide, courseSlug }: Props) {
  const {
    toggleTheme,
    theme,
    togglePresenterMode,
    sidebarOpen,
    toggleSidebar,
    nextSlide,
    prevSlide,
    openProModal,
    isPro,
    user,
    openAuthModal,
    logout,
    viewMode,
    setViewMode
  } = useAppStore()

  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false)
  const catSticker = CATEGORY_STICKERS[slide.category] || CATEGORY_STICKERS.basics

  const isPractice = isPracticeSlide(slide)
  // In practice questions, 'content-visual' has no code editor, so studio mode is effective
  const effectiveViewMode = (isPractice && viewMode === 'content-visual') ? 'all-four' : viewMode

  return (
    <header className="flex items-center justify-between gap-2 px-3 lg:px-4 py-2 border-b-2 border-black bg-[#181920] flex-shrink-0 select-none z-20 shadow-brutal-sm">
      {/* Left: Navigation & Track Identity */}
      <div className="flex items-center gap-1.5 lg:gap-2.5 min-w-0">
        {/* Topics Drawer Button */}
        <button
          onClick={toggleSidebar}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all border-2 border-black whitespace-nowrap flex-shrink-0 ${
            sidebarOpen
              ? 'bg-[#facc15] text-black shadow-none translate-x-[1px] translate-y-[1px]'
              : 'bg-white text-black shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5'
          }`}
          title="Toggle Topics Menu (M)"
        >
          <Menu size={14} />
          <span className="hidden sm:inline">TOPICS</span>
        </button>

        {/* Back to Catalog */}
        <Link
          to="/"
          className="px-2 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#27272a] text-zinc-200 border-2 border-black shadow-brutal-sm hover:bg-[#3f3f46] hover:text-white transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0"
        >
          <ChevronLeft size={14} />
          <span className="hidden lg:inline">CATALOG</span>
        </Link>

        {/* Course Title */}
        <div className="flex items-center gap-2 pl-0.5 min-w-0">
          {courseSlug === 'python-basics' || meta.id === 'python-basics' ? (
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <PythonLogo className="w-5 h-5" />
            </div>
          ) : (
            <span className="text-xl flex-shrink-0">{meta.emoji}</span>
          )}
          <span className="font-extrabold text-sm text-white tracking-tight hidden xl:inline whitespace-nowrap truncate max-w-[180px] 2xl:max-w-none">
            {meta.title}
          </span>
        </div>

        {/* Category Sticker */}
        <span className={`sticker-badge ${catSticker.bg} ${catSticker.text} text-[10px] hidden 2xl:inline-flex whitespace-nowrap flex-shrink-0`}>
          ⚡ {slide.categoryLabel}
        </span>
      </div>

      {/* Center Group: 3 Layout Mode Selector Buttons & Slide Stepper */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Collapsible Windows / Layout Selector Dropdown */}
        <div className="relative" onMouseLeave={() => setLayoutMenuOpen(false)}>
          <button
            onClick={() => setLayoutMenuOpen(!layoutMenuOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-black rounded-xl border-2 border-black shadow-brutal-sm transition-all whitespace-nowrap ${
              effectiveViewMode === 'content'
                ? 'bg-[#a3e635] text-black'
                : effectiveViewMode === 'content-visual'
                ? 'bg-[#38bdf8] text-black'
                : 'bg-[#facc15] text-black'
            }`}
            title="Switch Window Layout"
          >
            {effectiveViewMode === 'content' ? (
              <BookOpen size={13} />
            ) : effectiveViewMode === 'content-visual' ? (
              <Columns size={13} />
            ) : (
              <LayoutGrid size={13} />
            )}
            <span>
              {effectiveViewMode === 'content'
                ? '1. CONTENT ONLY'
                : effectiveViewMode === 'content-visual'
                ? '2. CONTENT + LIVE'
                : '3. ALL 4 (STUDIO)'}
            </span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-150 ${layoutMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {layoutMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-56 bg-[#181920] border-2 border-black rounded-xl shadow-brutal-lg p-1.5 z-50 font-mono text-xs space-y-1">
              <button
                onClick={() => {
                  setViewMode('content')
                  setLayoutMenuOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg font-bold transition-all text-left border ${
                  effectiveViewMode === 'content'
                    ? 'bg-[#a3e635] text-black font-black border-black shadow-brutal-sm'
                    : 'bg-transparent text-zinc-300 hover:bg-[#27272a] hover:text-white border-transparent'
                }`}
              >
                <BookOpen size={14} />
                <div className="flex flex-col">
                  <span>1. CONTENT ONLY</span>
                  <span className="text-[10px] opacity-75 font-normal">Full reading view</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setViewMode('content-visual')
                  setLayoutMenuOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg font-bold transition-all text-left border ${
                  effectiveViewMode === 'content-visual'
                    ? 'bg-[#38bdf8] text-black font-black border-black shadow-brutal-sm'
                    : 'bg-transparent text-zinc-300 hover:bg-[#27272a] hover:text-white border-transparent'
                }`}
              >
                <Columns size={14} />
                <div className="flex flex-col">
                  <span>2. CONTENT + LIVE</span>
                  <span className="text-[10px] opacity-75 font-normal">Side-by-side visual</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setViewMode('all-four')
                  setLayoutMenuOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg font-bold transition-all text-left border ${
                  effectiveViewMode === 'all-four'
                    ? 'bg-[#facc15] text-black font-black border-black shadow-brutal-sm'
                    : 'bg-transparent text-zinc-300 hover:bg-[#27272a] hover:text-white border-transparent'
                }`}
              >
                <LayoutGrid size={14} />
                <div className="flex flex-col">
                  <span>3. ALL 4 (STUDIO)</span>
                  <span className="text-[10px] opacity-75 font-normal">Content, Visual, Code &amp; Shell</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Slide Stepper Box */}
        <div className="flex items-center gap-1 bg-[#121316] border-2 border-black rounded-xl px-1.5 py-0.5 shadow-brutal-sm flex-shrink-0">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-1 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-20 disabled:pointer-events-none transition-all"
            title="Previous slide (↑ Up)"
          >
            <ChevronUp size={15} />
          </button>

          <div className="flex items-center gap-1 px-1.5 font-mono text-xs font-black whitespace-nowrap">
            <span className="text-[#facc15] text-sm min-w-[2ch] text-center">
              {currentSlide + 1}
            </span>
            <span className="text-zinc-600 font-bold">/</span>
            <span className="text-zinc-400">{totalSlides}</span>
          </div>

          <button
            onClick={() => nextSlide(totalSlides)}
            disabled={currentSlide === totalSlides - 1}
            className="p-1 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-20 disabled:pointer-events-none transition-all"
            title="Next slide (↓ Down)"
          >
            <ChevronDown size={15} />
          </button>
        </div>
      </div>

      {/* Right: Controls & User Authentication */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Pro Badge */}
        <button
          onClick={() => openProModal('header_badge')}
          className={`sticker-badge text-[11px] font-mono font-black transition-transform whitespace-nowrap flex-shrink-0 ${
            isPro
              ? 'bg-[#a3e635] text-black shadow-brutal-sm'
              : 'bg-[#f472b6] text-black rotate-[-2deg] hover:rotate-0'
          }`}
          title={isPro ? "Pro Active Membership" : "Unlock Pro Access"}
        >
          <Sparkles size={12} />
          <span className="hidden lg:inline">{isPro ? (user?.planType === 'annual' ? 'PRO ANNUAL' : 'PRO PASS') : 'UPGRADE PRO'}</span>
          <span className="lg:hidden">{isPro ? 'PRO' : 'PRO'}</span>
        </button>

        {/* User Account / Profile Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white border-2 border-black shadow-brutal-sm font-mono text-xs font-bold transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-[#38bdf8] border border-black flex items-center justify-center text-[10px] text-black font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline max-w-[80px] truncate">{user.name}</span>
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-[#181920] border-2 border-black rounded-xl shadow-brutal-lg p-3 z-50 font-mono text-xs space-y-3"
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <div className="border-b-2 border-black pb-2.5">
                  <div className="font-black text-white text-sm truncate">{user.name}</div>
                  <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className={`sticker-badge text-[9px] ${
                        isPro ? 'bg-[#a3e635] text-black font-black' : 'bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {isPro ? '⭐ PRO SUBSCRIBER' : 'FREE TIER'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => { setProfileMenuOpen(false); openProModal('manage_plan'); }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white font-bold transition-all text-left"
                  >
                    <CreditCard size={14} className="text-[#facc15]" />
                    <span>{isPro ? 'Manage Subscription' : 'Upgrade to Pro'}</span>
                  </button>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#121316] border border-zinc-800 text-zinc-400 text-[11px]">
                    <Cloud size={14} className="text-[#38bdf8]" />
                    <span>Cloud Sync: Active</span>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-2">
                  <button
                    onClick={() => { logout(); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 font-bold transition-all text-left"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-black rounded-lg bg-[#facc15] hover:bg-[#eab308] text-black border-2 border-black shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all whitespace-nowrap flex-shrink-0"
          >
            <User size={13} />
            <span>SIGN IN</span>
          </button>
        )}

        {/* Presenter Mode */}
        <button
          onClick={togglePresenterMode}
          className="w-8 h-8 rounded-lg bg-[#27272a] text-zinc-300 hover:text-white border-2 border-black shadow-brutal-sm flex items-center justify-center transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
          title="Presenter Mode (P)"
        >
          <Presentation size={15} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg bg-[#27272a] text-zinc-300 hover:text-white border-2 border-black shadow-brutal-sm flex items-center justify-center transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Global Auth Modal */}
      <AuthModal />
    </header>
  )
}
