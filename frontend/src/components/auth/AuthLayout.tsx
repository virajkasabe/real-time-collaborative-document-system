import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
  <div className="min-h-screen flex items-center justify-center bg-[#060D1A] px-4 py-8 sm:px-6 font-sans w-full">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <img src="/favicon.png" alt="Logo" className="h-10 mx-auto mb-4" onError={(e) => {
          (e.target as HTMLImageElement).src = '/logo.svg';
        }} />
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {children}
      </div>
    </div>
  </div>
);
