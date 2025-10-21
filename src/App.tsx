import React, { useState } from 'react';
import GpaCalculator from './components/GpaCalculator';

// Main app component with navbar and content sections
function App() {
  const [activeTab, setActiveTab] = useState('calculator'); // track which tab is active

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Navigation bar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-200/50 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {/* Logo/brand */}
              <h1 className="text-2xl font-semibold text-text flex items-center gap-2 font-display">
                <span className="text-primary">🎓</span>
                GPA Calculator & Planner
              </h1>
            </div>
            
            {/* Navigation tabs */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 min-w-[140px] ${
                  activeTab === 'calculator'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105'
                    : 'text-slate-600 hover:text-primary hover:bg-orange-50 border border-slate-200 hover:border-primary/30'
                }`}
              >
                GPA Calculator
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 min-w-[140px] ${
                  activeTab === 'planner'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:scale-105'
                    : 'text-slate-600 hover:text-primary hover:bg-orange-50 border border-slate-200 hover:border-primary/30'
                }`}
              >
                GPA Planner
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto py-8 px-6 pt-24">
        {activeTab === 'calculator' && (
          <div>
            <div className="text-center mb-8 relative mt-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-200/20 rounded-3xl blur-3xl -z-10"></div>
              <h2 className="text-3xl font-bold text-slate-800 mb-1 font-display">Calculate your GPA</h2>
              <p className="text-lg text-slate-600 mx-auto leading-relaxed whitespace-nowrap max-w-none">
                Track your academic progress and calculate your GPA with our intuitive grade calculator
              </p>
            </div>
            {/* GPA Calculator component */}
            <GpaCalculator />
          </div>
        )}
        
        {activeTab === 'planner' && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-slate-800 mb-4 font-display">Plan your GPA</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Plan your future grades to reach your target GPA
              </p>
            </div>
            {/* GPA Planner component will go here */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-text mb-2">GPA Planner Coming Soon</h3>
              <p className="text-text-secondary">Advanced planning features are in development!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
