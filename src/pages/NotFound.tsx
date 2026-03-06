import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-10 text-primary shadow-inner">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12 sm:w-16 sm:h-16"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight mb-4">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Page not found</h2>
      <p className="text-base sm:text-base text-muted-foreground font-medium mb-12 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or has been moved to a different community.
      </p>
      <Link
        to="/"
        className="inline-block bg-primary text-primary-foreground h-14 px-10 rounded-full font-bold text-base leading-[56px] hover:opacity-90 transition-all active:scale-95 shadow-lg"
      >
        Back to Home
      </Link>
    </div>
  );
};
