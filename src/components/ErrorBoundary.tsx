import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; label?: string }
type State = { error: Error | null }

/** Prevent a single page crash from blanking the whole app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', this.props.label ?? 'app', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page-pad wrap">
          <h1 className="font-display text-2xl font-bold">Oups — section en panne</h1>
          <p className="mt-3 text-sm text-muted">
            {this.props.label ? `Zone : ${this.props.label}. ` : null}
            Recharge la page ou reviens à l’accueil.
          </p>
          <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-red-200">
            {this.state.error.message}
          </pre>
          <a href="/" className="mt-6 inline-block text-cyan underline">
            Retour accueil
          </a>
        </div>
      )
    }
    return this.props.children
  }
}
