import React from 'react';
import GpaCalculator from './components/GpaCalculator';

type ActiveView = 'modules' | 'overall';

// Main app component with navbar and content sections
function App() {
  const [activeView, setActiveView] = React.useState<ActiveView>('modules');

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
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setActiveView('modules')}
                className={`px-3 sm:px-4 py-2 rounded border text-xs sm:text-sm font-bold transition-colors ${
                  activeView === 'modules'
                    ? 'bg-primary text-black border-primary'
                    : 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                GPA
              </button>
              <button
                type="button"
                onClick={() => setActiveView('overall')}
                className={`px-3 sm:px-4 py-2 rounded border text-xs sm:text-sm font-bold transition-colors ${
                  activeView === 'overall'
                    ? 'bg-primary text-black border-primary'
                    : 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                Overall GPA
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 pt-20 sm:pt-24">
        <div>
          <div className="text-center mb-6 sm:mb-8 mt-6 sm:mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2 font-display">
              {activeView === 'modules' ? 'Calculate your GPA' : 'Calculate your overall GPA'}
            </h2>
            <p className="text-base sm:text-lg text-slate-400 mx-auto leading-relaxed max-w-4xl px-4">
              {activeView === 'modules'
                ? 'Track your academic progress and calculate your GPA with our intuitive grade calculator'
                : 'Use cumulative credits and cumulative grade points to calculate the correct overall GPA'}
            </p>
          </div>
          {/* GPA Calculator component */}
          <GpaCalculator activeView={activeView} />
        </div>
      </main>
    </div>
  );
}

export default App;
