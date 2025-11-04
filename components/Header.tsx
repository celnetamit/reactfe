import React from 'react';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const NanoschoolLogo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15.5v-5l-4 4L5 15l4-4-4-4 1.5-1.5 4 4v-5h3v5l4-4L19 9l-4 4 4 4-1.5 1.5-4-4v5h-3z" fill="currentColor"/>
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <NanoschoolLogo />
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        AI-Powered LCA Dashboard
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden lg:block">An Educational Tool for Sustainability</p>
                    <button
                        onClick={toggleTheme}
                        className="w-12 h-6 rounded-full p-1 bg-gray-300 dark:bg-gray-600 relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Toggle theme"
                    >
                        <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'transform translate-x-6' : ''}`}></span>
                        <span className="absolute left-1.5 top-1.5 text-yellow-500 opacity-100 dark:opacity-0 transition-opacity duration-300">
                           <i className="fas fa-sun text-xs"></i>
                        </span>
                        <span className="absolute right-1.5 top-1.5 text-blue-300 opacity-0 dark:opacity-100 transition-opacity duration-300">
                           <i className="fas fa-moon text-xs"></i>
                        </span>

                    </button>
                </div>
            </div>
        </header>
    );
};