import React, { ReactElement } from "react";
import { ErrorScreen } from "../screens/ErrorScreen";

type ErrorBoundaryProps = {
  children: ReactElement;
};
type ErrorBoundaryState = {
  error: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError() {
    return { error: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <ErrorScreen />;
    }

    return this.props.children;
  }
}
