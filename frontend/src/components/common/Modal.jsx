import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md', // max-w-sm | max-w-md | max-w-lg
  icon: Icon
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Dynamic dark backdrop mask */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#070B14]/40 dark:bg-[#070B14]/75 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Surface Container */}
      <div className={`glass-card w-full ${maxWidth} border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-xl relative z-10 overflow-hidden rounded-xl transition-all duration-300 transform scale-100`}>
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-white/10 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="p-1.5 bg-[#0D6EFD]/10 text-[#0D6EFD] rounded transition-colors duration-300">
                <Icon size={14} />
              </div>
            )}
            {title && (
              <h3 className="font-sans font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB] uppercase tracking-wider transition-colors duration-300">
                {title}
              </h3>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
