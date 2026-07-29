import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Assuming you have this context

const NavbarPage = () => {
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
            <div className="max-w-[1280px] mx-auto px-[24px] h-[72px] flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center min-w-[160px] group cursor-pointer" onClick={() => navigate('/')}>
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

                {/* Navigation Links - Center */}
                <div className="hidden md:flex items-center gap-6">
                    {/* <Link 
                        to="/dashboard" 
                        className="text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors"
                    >
                        Dashboard
                    </Link> */}
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
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.fullName || 'User'}
                                        className="w-8 h-8 rounded-full object-cover"
                                        key={user.avatar}
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
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
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
                        // User not logged in
                        <>
                            <Link to="/login" className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors mr-1">
                                Sign In
                            </Link>
                            <Button size="md" variant="primary" onClick={() => navigate('/register')} className="btn-shine shadow-md shadow-blue-500/10">
                                Sign Up Free
                            </Button>
                        </>
                    )}

                    {/* Hamburger Button for Mobile/Tablet */}
                    <button
                        className="md:hidden p-2 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default NavbarPage;