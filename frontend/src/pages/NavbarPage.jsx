import React, { useState, useRef, useEffect } from 'react';
import athenuraLogo from '../assets/athenura-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Assuming you have this context
import { Menu, X } from 'lucide-react';

const NavbarPage = () => {
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get user initials for avatar
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
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="w-full border-b border-[#E5E7EB] dark:border-white/10 transition-colors duration-300 bg-white/60 dark:bg-[#070B14]/60 backdrop-blur-lg sticky top-0 z-50 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.02)]">
            <div className="max-w-[1280px] mx-auto px-[24px] h-[72px] flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center min-w-[160px] group cursor-pointer" onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/');
                }}>
                    <img 
                        src={athenuraLogo}
                        alt="Athenura"
                        className="h-10 w-auto object-contain"
                        style={{ 
                            maxWidth: '160px',
                            filter: isDark 
                                ? 'brightness(10)' 
                                : 'brightness(0.2)',
                            opacity: '0.95'
                        }}
                    />
                </div>

                {/* Navigation Links - Center */}
                <div className="hidden md:flex items-center gap-6">
                    <Link 
                        to="/" 
                        className="text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors"
                    >
                        Home
                    </Link>
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

                {/* Right Side - Auth/User */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    
                    {user ? (
                        // User is logged in
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                {/* Avatar */}
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

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 w-[220px] bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl shadow-xl z-[100] py-2 min-w-max">
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
                        // User not logged in (Desktop only buttons)
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors mr-1">
                                Sign In
                            </Link>
                            <Button size="md" variant="primary" onClick={() => navigate('/register')} className="btn-shine shadow-md shadow-blue-500/10">
                                Sign Up Free
                            </Button>
                        </div>
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

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-[#0F172A] border-t border-[#E5E7EB] dark:border-white/5 px-6 py-4 space-y-4 animate-fade-in shadow-lg">
                    <Link 
                        to="/" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="block text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors py-2"
                    >
                        Home
                    </Link>
                    <Link 
                        to="/about" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="block text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors py-2"
                    >
                        About
                    </Link>
                    <Link 
                        to="/contact" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="block text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors py-2"
                    >
                        Contact
                    </Link>
                    <Link 
                        to="/help" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="block text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors py-2"
                    >
                        Help
                    </Link>
                    
                    {!user ? (
                        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                            <Link 
                                to="/login" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center w-full py-2.5 text-sm font-bold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors"
                            >
                                Sign In
                            </Link>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate('/register');
                                }}
                                className="block w-full text-center px-4 py-2.5 bg-[#0D6EFD] hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-[0_4px_12px_rgba(13,110,253,0.15)] cursor-pointer"
                            >
                                Get Started Free
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                            <Link 
                                to="/profile" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center py-2.5 text-sm font-bold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="block w-full text-center px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default NavbarPage;