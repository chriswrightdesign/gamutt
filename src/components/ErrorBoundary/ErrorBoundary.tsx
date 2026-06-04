import React from "react";
import "./ErrorBoundary.css";

interface ErrorBoundaryProps {
    /** Changing this clears a caught error and retries — e.g. a serialized control state. */
    resetKey?: string;
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    error: Error | null;
}

// Error boundaries must be class components — there's no hook equivalent for componentDidCatch.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {error: null};

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {error};
    }

    componentDidCatch(error: Error): void {
        console.error("[gamutt] example threw:", error);
    }

    componentDidUpdate(previousProps: ErrorBoundaryProps): void {
        if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
            this.setState({error: null});
        }
    }

    render(): React.ReactNode {
        if (this.state.error) {
            return (
                <div className="gmt-stage-error" role="alert">
                    <p className="gmt-stage-error__title">This example threw an error</p>
                    <pre className="gmt-stage-error__message">{this.state.error.message}</pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export {ErrorBoundary};
