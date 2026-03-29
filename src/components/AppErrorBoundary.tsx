import React from 'react';

type AppErrorBoundaryState = {
  hasError: boolean;
};

class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed with runtime error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FBFA] p-6">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-lg">
            <h1 className="text-xl font-black text-slate-900">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-600">
              The app hit a temporary issue. Please reload once.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
