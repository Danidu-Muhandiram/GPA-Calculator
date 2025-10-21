import React, { useState } from 'react';

// Interface for a single module
interface Module {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

// Main GPA Calculator component
const GpaCalculator: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module>({
    id: '',
    name: '',
    credits: 0,
    grade: ''
  });

  // Add a new module to the list
  const addModule = () => {
    if (currentModule.name && currentModule.credits > 0 && currentModule.grade) {
      const newModule = {
        ...currentModule,
        id: Date.now().toString() // simple ID generation
      };
      setModules([...modules, newModule]);
      setCurrentModule({ id: '', name: '', credits: 0, grade: '' }); // reset form
    }
  };

  // Remove a module from the list
  const removeModule = (id: string) => {
    setModules(modules.filter(module => module.id !== id));
  };

  // Handle input changes
  const handleInputChange = (field: keyof Module, value: string | number) => {
    setCurrentModule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate GPA based on modules
  const calculateGPA = () => {
    if (modules.length === 0) return 0;
    
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    modules.forEach(module => {
      const gradePoint = getGradePoint(module.grade);
      totalGradePoints += gradePoint * module.credits;
      totalCredits += module.credits;
    });
    
    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  // Get grade point value for a grade
  const getGradePoint = (grade: string): number => {
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0,
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D+': 1.3,
      'D': 1.0,
      'F': 0.0
    };
    return gradePoints[grade] || 0;
  };

  // Calculate total grade points
  const calculateTotalGradePoints = () => {
    return modules.reduce((sum, module) => {
      return sum + (getGradePoint(module.grade) * module.credits);
    }, 0);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Add Course Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 font-display">Add New Module</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Module Name Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Module Name
            </label>
            <input
              type="text"
              value={currentModule.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Mathematics 101"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white hover:border-slate-400"
            />
          </div>

          {/* Credits Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Credits
            </label>
            <input
              type="number"
              value={currentModule.credits || ''}
              onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
              placeholder="3"
              min="1"
              max="10"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white hover:border-slate-400"
            />
          </div>

          {/* Grade Select */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Grade
            </label>
            <select
              value={currentModule.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white hover:border-slate-400"
            >
              <option value="">Select Grade</option>
              <option value="A+">A+ (4.0)</option>
              <option value="A">A (4.0)</option>
              <option value="A-">A- (3.7)</option>
              <option value="B+">B+ (3.3)</option>
              <option value="B">B (3.0)</option>
              <option value="B-">B- (2.7)</option>
              <option value="C+">C+ (2.3)</option>
              <option value="C">C (2.0)</option>
              <option value="C-">C- (1.7)</option>
              <option value="D+">D+ (1.3)</option>
              <option value="D">D (1.0)</option>
              <option value="F">F (0.0)</option>
            </select>
          </div>
        </div>

        {/* Add Module Button */}
        <div className="mt-6">
          <button
            onClick={addModule}
            className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <span>➕</span>
            Add Module
          </button>
        </div>
      </div>

      {/* Two Column Layout for Empty State and GPA Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Empty State */}
        {modules.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center animate-scale-in">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display">Ready to calculate your GPA?</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Add your first module above to start tracking your academic progress and see your GPA in real-time!
            </p>
            <div className="inline-flex items-center gap-2 text-primary font-semibold bg-primary/10 px-6 py-3 rounded-xl border border-primary/20">
              <span>⬆️</span>
              <span>Start by adding a module above</span>
            </div>
          </div>
        )}

        {/* Modules Summary */}
        {modules.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 font-display">Your Modules</h3>
            </div>
            
            <div className="space-y-4">
              {modules.map((module) => {
                const gradePoint = getGradePoint(module.grade);
                const getGradeColor = (grade: string) => {
                  const point = getGradePoint(grade);
                  if (point >= 3.7) return 'border-l-green-500 bg-green-50/50';
                  if (point >= 3.0) return 'border-l-primary bg-orange-50/50';
                  if (point >= 2.0) return 'border-l-orange-400 bg-orange-100/50';
                  return 'border-l-red-400 bg-red-50/50';
                };
                
                return (
                  <div key={module.id} className={`flex items-center justify-between p-5 rounded-xl border-l-4 ${getGradeColor(module.grade)} hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-slate-800">{module.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          gradePoint >= 3.7 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' :
                          gradePoint >= 3.0 ? 'bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg' :
                          gradePoint >= 2.0 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg' :
                          'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                        }`}>
                          {module.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>{module.credits} credits</span>
                        <span>•</span>
                        <span>{gradePoint.toFixed(1)} GPA points</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeModule(module.id)}
                      className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-3 rounded-xl transition-all duration-300"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GPA Circular Progress */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-scale-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 font-display">GPA Overview</h3>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Speedometer-style Progress */}
            <div className="relative w-48 h-32 mb-6">
              <svg className="w-48 h-32" viewBox="0 0 200 100">
                {/* Background Arc */}
                <path
                  d="M 20 80 A 80 80 0 0 1 180 80"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Progress Arc */}
                <path
                  d="M 20 80 A 80 80 0 0 1 180 80"
                  stroke={
                    calculateGPA() >= 3.7 ? '#22C55E' :
                    calculateGPA() >= 3.0 ? '#F88A22' :
                    calculateGPA() >= 2.0 ? '#F88A22' :
                    '#F88A22'
                  }
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(calculateGPA() / 4.0) * 251.2} 251.2`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <div className={`text-4xl font-bold font-display ${
                  calculateGPA() >= 3.7 ? 'text-green-600' :
                  calculateGPA() >= 3.0 ? 'text-primary' :
                  calculateGPA() >= 2.0 ? 'text-primary' :
                  'text-primary'
                }`}>
                  {modules.length > 0 ? calculateGPA().toFixed(2) : '0.00'}
                </div>
                <div className="text-sm font-semibold text-text-secondary">Cumulative GPA</div>
              </div>
            </div>
            
            {/* GPA Range */}
            <div className="flex justify-between w-full max-w-48 mb-6 px-4">
              <span className="text-sm text-text-secondary">0.0</span>
              <span className="text-sm text-text-secondary">4.0</span>
            </div>

            {/* Summary Stats */}
            {modules.length > 0 && (
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="bg-slate-50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 border border-slate-200">
                  <div className="text-xl font-bold text-slate-800">{modules.length}</div>
                  <div className="text-sm font-medium text-slate-600">Modules</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 border border-slate-200">
                  <div className="text-xl font-bold text-slate-800">
                    {modules.reduce((sum, module) => sum + module.credits, 0)}
                  </div>
                  <div className="text-sm font-medium text-slate-600">Credits</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 border border-slate-200">
                  <div className="text-xl font-bold text-slate-800">
                    {modules.length > 0 ? calculateTotalGradePoints().toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm font-medium text-slate-600">Points</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GpaCalculator;

