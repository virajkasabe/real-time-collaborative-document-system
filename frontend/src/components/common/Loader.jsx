import React from 'react';

export default function Loader({
  fullScreen = false,
  size = 'md', // sm | md | lg
  text = 'Loading...'
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-3 select-none">
      <div className={`border-solid border-[#0D6EFD] border-t-transparent rounded-full animate-spin ${sizeClasses[size]}`} />
      {text && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8] transition-colors duration-300">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7FAFF] dark:bg-[#070B14] transition-colors duration-300">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {loaderContent}
    </div>
  );
}
