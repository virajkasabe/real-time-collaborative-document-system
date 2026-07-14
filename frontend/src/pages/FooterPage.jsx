import React from 'react';
import { Link } from 'react-router-dom';

const FooterPage = () => {
  return (
    <footer className="py-12 px-6 bg-slate-900 dark:bg-[#060D1A] border-t border-slate-800 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand Logo / Name */}
        <Link to="/" className="text-white font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity">
          Athenura
        </Link>
        
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-400 dark:text-gray-500">
          <Link to="/about" className="hover:text-white transition-colors duration-200">
            About
          </Link>
          <a href="/#features" className="hover:text-white transition-colors duration-200">
            Features
          </a>
          <a href="#" className="hover:text-white transition-colors duration-200">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors duration-200">
            Terms
          </a>
        </div>
        
        {/* Copyright notice */}
        <div className="text-slate-500 dark:text-gray-600 text-xs">
          &copy; 2026 Athenura. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;