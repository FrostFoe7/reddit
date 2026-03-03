import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="text-center py-24 px-4">
      <div className="w-[100px] h-[100px] rounded-full bg-reddit-orange/10 flex items-center justify-center mx-auto mb-8 text-reddit-orange">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[56px] h-[56px]">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <h1 className="text-[32px] sm:text-[40px] font-bold text-text-primary tracking-tight mb-4">Page not found</h1>
      <p className="text-[17px] text-text-secondary font-medium mb-10">The page you requested does not exist or has been moved.</p>
      <Link to="/" className="inline-block bg-text-primary text-bg-primary h-14 px-8 rounded-full font-bold text-[16px] leading-[56px] hover:opacity-80 transition-opacity shadow-sm">
        Back to Home
      </Link>
    </div>
  );
};
