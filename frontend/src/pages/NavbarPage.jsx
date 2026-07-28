import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ATHENURA_LOGO } from '../assets';
import { Menu, X } from 'lucide-react';

const NavbarPage = () => {
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    
    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const getUserInitials = () => {
        if (!user) return '';
        const fullName = user.fullName || '';
        const nameParts = fullName.split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return fullName.substring(0, 2).toUpperCase();
    };

    const handleLogout = async () => {
        try {
            await logout();
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="w-full border-b border-[#E5E7EB] dark:border-white/10 transition-colors duration-300 bg-white/60 dark:bg-[#070B14]/60 backdrop-blur-lg sticky top-0 z-50 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.02)]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-[24px] h-[64px] sm:h-[72px] flex items-center justify-between">
                {/* Logo - Left */}
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <img 
                        src={ATHENURA_LOGO}
                        alt="Athenura"
                        className="h-8 sm:h-10 w-auto object-contain"
                        style={{ 
                            maxWidth: '140px',
                            filter: isDark 
                                ? 'brightness(10)' 
                                : 'brightness(0.2)',
                            opacity: '0.95'
                        }}
                    />
                </div>

                {/* Navigation Links - Center (Desktop) */}
                <div className="hidden md:flex items-center gap-4 lg:gap-6">
                    <Link 
                        to="/about" 
                        className="text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors"
                    >
                        About
                    </Link>
                    <Link 
                        to="/contact" 
                        className="text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors"
                    >
                        Contact
                    </Link>
                    <Link 
                        to="/help" 
                        className="text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors"
                    >
                        Help
                    </Link>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    
                    {/* Mobile Menu Toggle - Sirf mobile mein */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-1.5 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    
                    {/* Auth - Desktop */}
                    {user ? (
                        <div className="hidden md:block relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.fullName || 'User'}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB] hidden sm:block">
                                    {user.fullName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                                </span>
                                <svg 
                                    className={`w-4 h-4 text-[#6B7280] dark:text-[#94A3B8] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0F172A] rounded-lg shadow-lg border border-[#E5E7EB] dark:border-white/10 py-1 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-white/10">
                                        <p className="text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">
                                            {user.fullName || 'User'}
                                        </p>
                                        <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] dark:text-[#E5E7EB] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </Link>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="text-sm font-bold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors">
                                Sign In
                            </Link>
                            <Button size="md" variant="primary" onClick={() => navigate('/register')} className="btn-shine shadow-md shadow-blue-500/10">
                                Sign Up Free
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu - Isme About, Contact, Help BHI dikhenge */}
            {isMobileMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    
                    <div 
                        ref={mobileMenuRef}
                        className="fixed top-[64px] sm:top-[72px] left-0 right-0 bg-white dark:bg-[#070B14] border-b border-[#E5E7EB] dark:border-white/10 z-40 md:hidden shadow-xl animate-slideDown"
                    >
                        <nav className="max-w-[1280px] mx-auto px-4 py-4">
                            <div className="flex flex-col space-y-1">
                                {/* Mobile mein bhi About, Contact, Help dikhenge */}
                                <Link 
                                    to="/about" 
                                    className="px-4 py-3 text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                                    onClick={handleNavLinkClick}
                                >
                                    About
                                </Link>
                                <Link 
                                    to="/contact" 
                                    className="px-4 py-3 text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                                    onClick={handleNavLinkClick}
                                >
                                    Contact
                                </Link>
                                <Link 
                                    to="/help" 
                                    className="px-4 py-3 text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                                    onClick={handleNavLinkClick}
                                >
                                    Help
                                </Link>
                                
                                <div className="h-px bg-[#E5E7EB] dark:bg-white/10 my-2" />
                                
                                {user ? (
                                    <>
                                        <div className="px-4 py-3 flex items-center gap-3">
                                            {user.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.fullName || 'User'}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                                    {getUserInitials()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">
                                                    {user.fullName || 'User'}
                                                </p>
                                                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to="/profile" 
                                            className="px-4 py-3 text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                                            onClick={handleNavLinkClick}
                                        >
                                            Profile
                                        </Link>
                                        
                                        <button 
                                            onClick={handleLogout}
                                            className="px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-left"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            to="/login" 
                                            className="px-4 py-3 text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                                            onClick={handleNavLinkClick}
                                        >
                                            Sign In
                                        </Link>
                                        <Link 
                                            to="/register" 
                                            className="px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all text-center shadow-md shadow-blue-500/20"
                                            onClick={handleNavLinkClick}
                                        >
                                            Sign Up Free
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

export default NavbarPage;