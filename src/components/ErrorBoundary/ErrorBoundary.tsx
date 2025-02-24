import { Component } from "react";

class ErrorBoundary extends Component<
  {
    children: React.ReactNode;
  },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("ErrorBoundary caught an error", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    return this.state.hasError ? (
      <main className="flex h-screen w-screen items-center justify-center">
        <h1>Something went wrong, please try again</h1>
      </main>
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
