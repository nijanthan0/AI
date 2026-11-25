import React from 'react'

interface Props {
  className?: string
  size?: number
}

export default function PythonLogo({ className = 'w-full h-full', size }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 110"
      width={size}
      height={size}
      className={className}
      aria-label="Python Logo"
    >
      <defs>
        <linearGradient id="pyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#387eb8" />
          <stop offset="100%" stopColor="#366994" />
        </linearGradient>
        <linearGradient id="pyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe873" />
          <stop offset="100%" stopColor="#ffd43b" />
        </linearGradient>
      </defs>
      {/* Top / Blue Snake Segment */}
      <path
        fill="url(#pyBlue)"
        d="M53.166 0C23.593 0 26.12 13.125 26.12 13.125l.031 13.063h26.438V28.5H24.344S0 27.563 0 55.438c0 27.875 22.031 26.906 22.031 26.906h7.938V69.188s-.406-15.406 15.281-15.406h26.25s14.781.25 14.781-14.219V14.563S79.604 0 53.166 0zm-14.594 8.688a4.781 4.781 0 1 1 0 9.563 4.781 4.781 0 0 1 0-9.563z"
      />
      {/* Bottom / Yellow Snake Segment */}
      <path
        fill="url(#pyYellow)"
        d="M56.834 110c29.573 0 27.047-13.125 27.047-13.125l-.031-13.063H57.412v-2.312h28.244s24.344.938 24.344-26.938c0-27.875-22.031-26.906-22.031-26.906h-7.938v13.156s.406 15.406-15.281 15.406h-26.25s-14.781-.25-14.781 14.219v20.406S30.396 110 56.834 110zm14.594-8.688a4.781 4.781 0 1 1 0-9.563 4.781 4.781 0 0 1 0 9.563z"
      />
    </svg>
  )
}
