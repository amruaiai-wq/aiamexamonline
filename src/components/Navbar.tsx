// src/components/Navbar.tsx
'use client'

import Link from "next/link";
import AuthStatus from "./AuthStatus";
import NamePrompt from "./NamePrompt";

export default function Navbar() {
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text hover:scale-105 transition-transform"
            >
              Ekorsob.com
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">

              {/* Auth Status */}
              <AuthStatus />
            </div>
          </div>
        </div>
      </nav>

      {/* Name Prompt Modal */}
      <NamePrompt />
    </>
  );
}