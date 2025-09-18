'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    document.documentElement.classList.add('page-transition-exit-active');
    document.documentElement.classList.add('page-transition-exit');

    setTimeout(() => {
      router.push(path);
      // Remove exit classes after navigation, and add enter classes for the new page
      document.documentElement.classList.remove('page-transition-exit-active');
      document.documentElement.classList.remove('page-transition-exit');
      document.documentElement.classList.add('page-transition-enter');
      document.documentElement.classList.add('page-transition-enter-active');

      // Remove enter classes after animation completes
      setTimeout(() => {
        document.documentElement.classList.remove('page-transition-enter');
        document.documentElement.classList.remove('page-transition-enter-active');
      }, 500); // Match transition duration

    }, 500); // Match transition duration
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-10">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          Dream Crown Logo
        </div>
        <div className="flex space-x-4">
          <button onClick={() => handleNavigation('/')} className="text-gray-800 hover:text-blue-600">Highlight</button>
          <button onClick={() => handleNavigation('/software')} className="text-gray-800 hover:text-blue-600">Software</button>
          <button onClick={() => handleNavigation('/games')} className="text-gray-800 hover:text-blue-600">Games</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
