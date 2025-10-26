import React, { useState } from 'react';
import GpaCalculator from './components/GpaCalculator';
import GpaPlanner from './components/GpaPlanner';

// Main app component with navbar and content sections
function App() {
  const [activeTab, setActiveTab] = useState('calculator'); // track which tab is active

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Navigation bar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-200/50 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center">
              {/* Logo/brand */}
              <h1 className="text-lg sm:text-2xl font-semibold text-text flex items-center gap-1 sm:gap-2 font-display">
                <span className="text-primary">🎓</span>
                <span className="hidden sm:inline">GPA Calculator & Planner</span>
                <span className="sm:hidden">GPA Calc</span>
              </h1>
            </div>
            
            {/* Navigation tabs */}
            <div className="flex space-x-1 sm:space-x-3">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 min-w-[80px] sm:min-w-[140px] ${
                  activeTab === 'calculator'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105'
                    : 'text-slate-600 hover:text-primary hover:bg-orange-50 border border-slate-200 hover:border-primary/30'
                }`}
              >
                <span className="hidden sm:inline">GPA Calculator</span>
                <span className="sm:hidden">Calc</span>
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 min-w-[80px] sm:min-w-[140px] ${
                  activeTab === 'planner'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105'
                    : 'text-slate-600 hover:text-primary hover:bg-orange-50 border border-slate-200 hover:border-primary/30'
                }`}
              >
                <span className="hidden sm:inline">GPA Planner</span>
                <span className="sm:hidden">Plan</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 pt-20 sm:pt-24">
        {activeTab === 'calculator' && (
          <div>
            <div className="text-center mb-6 sm:mb-8 relative mt-6 sm:mt-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-200/20 rounded-3xl blur-3xl -z-10"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 font-display">Calculate your GPA</h2>
              <p className="text-base sm:text-lg text-slate-600 mx-auto leading-relaxed max-w-4xl px-4">
                Track your academic progress and calculate your GPA with our intuitive grade calculator
              </p>
            </div>
            {/* GPA Calculator component */}
            <GpaCalculator />
          </div>
        )}
        
        {activeTab === 'planner' && <GpaPlanner />}
      </main>
    </div>
  );
}

export default App;
