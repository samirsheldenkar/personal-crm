import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  resetLabel?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error boundary caught an exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h2>{this.props.title || 'Something went wrong'}</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred. Please try again.'}</p>
          <button type="button" className="btn btn-primary" onClick={this.handleReset}>
            {this.props.resetLabel || 'Try again'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
