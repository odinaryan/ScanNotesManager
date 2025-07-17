import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

const ErrorBanner: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Get any global error from query cache
  const errorQueries = queryClient
    .getQueryCache()
    .findAll({ 
      predicate: (query) => !!query.state.error 
    });

  // For now, we'll just show a simple implementation
  // In a real app, you might want to use a more sophisticated error boundary
  // or global error state management for non-query errors
  
  const firstError = errorQueries[0]?.state.error;

  if (!firstError || !(firstError instanceof Error)) {
    return null;
  }

  const clearError = () => {
    // Reset all error queries
    errorQueries.forEach(query => {
      queryClient.resetQueries({ queryKey: query.queryKey });
    });
  };

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{firstError.message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={clearError}
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBanner; 