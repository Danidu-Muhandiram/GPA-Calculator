import React from 'react';
import GpaCalculator from './components/GpaCalculator';

// Main app component with navbar and content sections
function App() {
  return (
    <div className="min-h-screen bg-[#080C14] text-text">
      {/* Navigation bar */}
      <nav className="bg-[#0F1626] border-b-2 border-slate-800 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center">
              {/* Logo/brand */}
              <h1 className="text-lg sm:text-2xl font-bold text-text flex items-center gap-1 sm:gap-2 font-display">
                <span className="hidden sm:inline">GPA Calculator</span>
                <span className="sm:hidden">GPA Calc</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 pt-20 sm:pt-24">
        <div>
          <div className="text-center mb-6 sm:mb-8 mt-6 sm:mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2 font-display">Calculate your GPA</h2>
            <p className="text-base sm:text-lg text-slate-400 mx-auto leading-relaxed max-w-4xl px-4">
              Track your academic progress and calculate your GPA with our intuitive grade calculator
            </p>
          </div>
          {/* GPA Calculator component */}
          <GpaCalculator />
        </div>
      </main>
    </div>
  );
}

export default App;
