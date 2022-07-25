import React, { ReactElement } from "react";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorMessage } from "./ErrorMessage";

type DataBoundaryProps = {
  children: ReactElement;
  data: undefined | unknown;
  loading: boolean;
  error: boolean;
  onPressRetry: () => void;
  onPressSettings?: () => void;
  errorMessage?: string;
};

type LoadingStateProps = Omit<DataBoundaryProps, "children" | "onPressRetry">;
type LoadingState = "loading" | "error" | "data";

function deviceLoadingState({ error, data }: LoadingStateProps): LoadingState {
  if (data) {
    return "data";
  }

  if (error) {
    return "error";
  }

  return "loading";
}

export function DataBoundary({
  loading,
  error,
  errorMessage,
  data,
  children,
  onPressRetry,
  onPressSettings,
}: DataBoundaryProps) {
  const state = deviceLoadingState({ loading, error, data });

  return (
    <>
      {state === "loading" && <LoadingIndicator />}
      {state === "error" && (
        <ErrorMessage errorMessage={errorMessage} onPressRetry={onPressRetry} onPressSettings={onPressSettings} />
      )}
      {state === "data" && children}
    </>
  );
}
