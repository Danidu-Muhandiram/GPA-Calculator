import React, { useState } from 'react';
import GpaCalculator from './components/GpaCalculator';
import GpaPlanner from './components/GpaPlanner';

// Main app component with navbar and content sections
function App() {
  const [activeTab, setActiveTab] = useState('calculator'); // track which tab is active

  return (
    <div className="min-h-screen bg-[#080C14] text-text">
      {/* Navigation bar */}
      <nav className="bg-[#0F1626] border-b-2 border-slate-800 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center">
              {/* Logo/brand */}
              <h1 className="text-lg sm:text-2xl font-bold text-text flex items-center gap-1 sm:gap-2 font-display">
                <span className="hidden sm:inline">GPA Calculator & Planner</span>
                <span className="sm:hidden">GPA Calc</span>
              </h1>
            </div>
            
            {/* Navigation tabs */}
            <div className="flex space-x-1 sm:space-x-3">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded border-2 text-xs sm:text-sm font-bold transition-colors duration-200 min-w-[80px] sm:min-w-[140px] ${
                  activeTab === 'calculator'
                    ? 'bg-primary text-black border-primary'
                    : 'text-slate-400 hover:text-primary hover:bg-[#1A2333] border-slate-800'
                }`}
              >
                <span className="hidden sm:inline">GPA Calculator</span>
                <span className="sm:hidden">Calc</span>
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded border-2 text-xs sm:text-sm font-bold transition-colors duration-200 min-w-[80px] sm:min-w-[140px] ${
                  activeTab === 'planner'
                    ? 'bg-primary text-black border-primary'
                    : 'text-slate-400 hover:text-primary hover:bg-[#1A2333] border-slate-800'
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
            <div className="text-center mb-6 sm:mb-8 mt-6 sm:mt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2 font-display">Calculate your GPA</h2>
              <p className="text-base sm:text-lg text-slate-400 mx-auto leading-relaxed max-w-4xl px-4">
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
