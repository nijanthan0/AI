import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallbackTitle?: string
  fallbackMessage?: string
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-[#181926] border-2 border-black rounded-xl text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center mb-3 shadow-brutal-sm text-black">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-sm font-black font-mono uppercase text-white mb-1">
            {this.props.fallbackTitle || 'Visualization Unavailable'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mb-4">
            {this.props.fallbackMessage ||
              'A rendering glitch occurred with this interactive diagram. You can still use the code runner and view the solution.'}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e] text-black text-xs font-mono font-bold rounded-lg border-2 border-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <RefreshCw size={12} />
            <span>RETRY RENDER</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
