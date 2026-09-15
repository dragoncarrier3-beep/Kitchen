import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    this.setState({ hasError: true })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full min-h-[280px] items-center justify-center bg-[#121214] p-8 text-center">
            <div>
              <p className="font-display text-2xl text-[#f4efe6]">Preview unavailable</p>
              <p className="mt-2 text-sm text-[#9a9388]">
                The interactive view could not start. Configuration controls remain available.
              </p>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
