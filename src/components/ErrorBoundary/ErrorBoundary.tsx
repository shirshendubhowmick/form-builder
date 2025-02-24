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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    return this.state.hasError ? (
      <h1>Something went wrong, please try again</h1>
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
