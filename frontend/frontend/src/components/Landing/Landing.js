import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/library-hero.js';

// Landing page simplified to show only the main hero photo and primary text

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left hero */}
          <div className="relative z-10 order-2 lg:order-1">
            {/* Breadcrumb */}
            <nav className="inline-flex items-center gap-2 text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              <span>Home</span>
              <span>/</span>
              <span className="font-medium text-gray-700">Library</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Expand your mind,
              <br />
              <span className="text-gray-900">reading a book</span>
              <span className="text-amber-500"> →</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              Build your personal library: track books, log progress, and keep your collection beautifully organized.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="font-semibold text-indigo-700 hover:text-indigo-800"
              >
                Register
              </Link>
            </div>

            {/* Feature highlights */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-indigo-100 bg-white/80 p-4">
                <div className="text-2xl">📚</div>
                <div className="mt-2 font-semibold text-gray-900">Track Collection</div>
                <p className="text-sm text-gray-600">Add, categorize, and review your books.</p>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-white/80 p-4">
                <div className="text-2xl">🕒</div>
                <div className="mt-2 font-semibold text-gray-900">Reading Progress</div>
                <p className="text-sm text-gray-600">Log sessions and finish more titles.</p>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-white/80 p-4">
                <div className="text-2xl">🔒</div>
                <div className="mt-2 font-semibold text-gray-900">Secure & Private</div>
                <p className="text-sm text-gray-600">Your library, safely accessible anywhere.</p>
              </div>
            </div>
          </div>

          {/* Right hero visuals */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative bg-gradient-to-b from-gray-100 to-white rounded-3xl p-4 md:p-6 shadow-inner overflow-hidden">
              <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />
              <div className="absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
              <div className="relative rounded-2xl border border-gray-200 overflow-hidden">
                <img src={heroImage} alt="Cozy library shelves" className="w-full h-[320px] md:h-[420px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;