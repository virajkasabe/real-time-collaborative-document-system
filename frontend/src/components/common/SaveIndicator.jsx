import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SaveIndicator({ status }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
      {status === 'saving' && (
        <>
          <svg className="animate-spin w-3.5 h-3.5 text-blue-500 dark:text-blue-400"
            viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12"
              r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-blue-500 dark:text-blue-400">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <CheckCircle size={14} className="text-green-500 dark:text-green-400" />
          <span className="text-green-500 dark:text-green-400">Saved</span>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle size={14} className="text-red-500 dark:text-red-400" />
          <span className="text-red-500 dark:text-red-400">Save failed</span>
        </>
      )}
    </div>
  );
}
