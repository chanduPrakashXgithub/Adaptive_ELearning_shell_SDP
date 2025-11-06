import React from "react";

interface ErrorBoundaryProps {
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: any) {
        // You can integrate logging here (Sentry, console, etc.)
        // Keep it silent in production or forward to toast
        // eslint-disable-next-line no-console
        console.error("ErrorBoundary caught error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return <>{this.props.fallback}</>;
            return (
                <div className="p-4 bg-red-50 text-red-800 rounded">
                    <strong>Unable to render content.</strong>
                    <div className="text-sm mt-2">An error occurred while rendering this content. Please try again or contact support.</div>
                </div>
            );
        }
        return this.props.children as React.ReactElement;
    }
}

export default ErrorBoundary;
