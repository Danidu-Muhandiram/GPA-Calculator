import React, { useState } from 'react';

// Interface for a single module
interface Module {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

// Interface for form sets
interface FormSet {
  id: string;
  module: Module;
  isEditing: boolean;
}

// Main GPA Calculator component
const GpaCalculator: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [formSets, setFormSets] = useState<FormSet[]>([
    {
      id: 'default',
      module: { id: '', name: '', credits: 0, grade: '' },
      isEditing: true
    }
  ]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Create another module form
  const addNewFormSet = () => {
    const newFormSet: FormSet = {
      id: Date.now().toString(),
      module: { id: '', name: '', credits: 0, grade: '' },
      isEditing: true
    };
    setFormSets([...formSets, newFormSet]);
  };

  // Delete a module form
  const removeFormSet = (formSetId: string) => {
    if (formSets.length > 1) {
      const formSetToRemove = formSets.find(fs => fs.id === formSetId);
      
      // If this form has module data, find and remove the matching module from the list
      if (formSetToRemove?.module.name && formSetToRemove.module.credits > 0 && formSetToRemove.module.grade) {
        const matchingModule = modules.find(module => 
          module.name === formSetToRemove.module.name &&
          module.credits === formSetToRemove.module.credits &&
          module.grade === formSetToRemove.module.grade
        );
        
        if (matchingModule) {
          setModules(prevModules => prevModules.filter(module => module.id !== matchingModule.id));
        }
      }
      
      setFormSets(formSets.filter(fs => fs.id !== formSetId));
    }
  };

  // Save module to the list
  const addModule = (formSetId: string) => {
    const formSet = formSets.find(fs => fs.id === formSetId);
    if (formSet && formSet.module.name && formSet.module.credits > 0 && formSet.module.grade) {
      // Don't add duplicates
      const existingModule = modules.find(module => 
        module.name === formSet.module.name &&
        module.credits === formSet.module.credits &&
        module.grade === formSet.module.grade
      );
      
      if (existingModule) {
        return;
      }
      
      const newModule = {
        ...formSet.module,
        id: Date.now().toString()
      };
      setModules([...modules, newModule]);
      
      // Mark this form as completed
      setFormSets(formSets.map(fs => 
        fs.id === formSetId 
          ? { ...fs, module: { ...newModule }, isEditing: false }
          : fs
      ));
    }
  };

  // Handle input changes
  const updateFormSet = (formSetId: string, field: keyof Module, value: string | number) => {
    setFormSets(formSets.map(fs => 
      fs.id === formSetId 
        ? { ...fs, module: { ...fs.module, [field]: value } }
        : fs
    ));
  };


  // Old function - keeping for compatibility
  const handleInputChange = (field: keyof Module, value: string | number) => {
    // Not used anymore
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
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="text-xl sm:text-2xl">📚</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">Add New Module</h3>
        </div>

        {/* Module Input Table */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-7">
              <h4 className="text-sm font-semibold text-slate-700">Module Name</h4>
            </div>
            <div className="col-span-2 text-center">
              <h4 className="text-sm font-semibold text-slate-700">Credits</h4>
            </div>
            <div className="col-span-2 text-center">
              <h4 className="text-sm font-semibold text-slate-700">Grade</h4>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Module Rows */}
          {formSets.map((formSet, index) => (
            <div key={formSet.id} className="grid grid-cols-12 mb-4 items-center">
          {/* Module Name Input */}
              <div className="col-span-7 pr-4">
            <input
              type="text"
                    value={formSet.module.name}
                    onChange={(e) => updateFormSet(formSet.id, 'name', e.target.value)}
                    placeholder="Module name (required)"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white hover:border-slate-400 text-sm"
            />
          </div>

          {/* Credits Input */}
              <div className="col-span-2 px-2">
            <input
              type="number"
                    value={formSet.module.credits || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (value >= 0) {
                        updateFormSet(formSet.id, 'credits', value);
                      }
                    }}
              placeholder="3"
                    min="0"
              max="10"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white hover:border-slate-400 text-sm text-center"
            />
          </div>

          {/* Grade Select */}
              <div className="col-span-2 px-2">
            <select
                  value={formSet.module.grade}
                  onChange={(e) => updateFormSet(formSet.id, 'grade', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white hover:border-slate-400 text-sm text-center"
            >
              <option value="">Select Grade</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
            </select>
          </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-center">
                {formSets.length > 1 && (
                  <button
                    onClick={() => removeFormSet(formSet.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 flex items-center justify-center"
                  >
                    <span className="text-sm">−</span>
                  </button>
                )}
              </div>
        </div>
          ))}

        {/* Add Module Button */}
        <div className="mt-4">
            <div className="flex items-center gap-3">
          <button
                onClick={() => {
                  // Check if all modules are valid before adding
                  const invalidModules: string[] = [];
                  formSets.forEach((formSet, index) => {
                    if (!formSet.module.name || formSet.module.credits <= 0 || !formSet.module.grade) {
                      invalidModules.push(`Module ${index + 1}`);
                    }
                  });

                  if (invalidModules.length === 0) {
                    // Add all valid modules at once
                    formSets.forEach(formSet => {
                      if (formSet.module.name && formSet.module.credits > 0 && formSet.module.grade) {
                        addModule(formSet.id);
                      }
                    });
                    // Add new empty form
                    addNewFormSet();
                    setErrorMessage(''); // Clear any previous error
                  } else {
                    // Show error message for invalid modules
                    setErrorMessage(`Please fill in all required fields for: ${invalidModules.join(', ')}`);
                  }
                }}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
              >
                <span>+</span>
            Add Module
          </button>
              {errorMessage && (
                <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200 animate-pulse">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Empty State and GPA Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Empty State */}
        {modules.length === 0 && (
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border border-slate-200/50 p-8 sm:p-16 text-center animate-scale-in backdrop-blur-sm">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-orange-200/30 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
              <span className="text-4xl sm:text-5xl">📚</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6 font-display">Ready to calculate your GPA?</h3>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Add your first module above to start tracking your academic progress and see your GPA in real-time!
            </p>
            <div className="inline-flex items-center gap-3 text-primary font-bold bg-gradient-to-r from-primary/10 to-orange-100/50 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl border-2 border-primary/20 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <span className="text-xl">⬆️</span>
              <span>Start by adding a module above</span>
              </div>
          </div>
        )}

        {/* Modules Summary */}
        {modules.length > 0 && (
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border border-slate-200/50 p-6 sm:p-10 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-orange-200/30 rounded-2xl shadow-lg">
                <span className="text-2xl sm:text-3xl">📊</span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-display">Your Modules</h3>
                <p className="text-slate-600 text-sm sm:text-base mt-1">Track your academic progress</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {modules.map((module, index) => {
                const gradePoint = getGradePoint(module.grade);
                const getGradeColor = (grade: string) => {
                  const point = getGradePoint(grade);
                  if (point >= 3.7) return 'border-l-green-500 bg-gradient-to-r from-green-50/80 to-emerald-50/60';
                  if (point >= 3.0) return 'border-l-primary bg-gradient-to-r from-orange-50/80 to-orange-100/60';
                  if (point >= 2.0) return 'border-l-orange-400 bg-gradient-to-r from-orange-100/80 to-yellow-50/60';
                  return 'border-l-red-400 bg-gradient-to-r from-red-50/80 to-pink-50/60';
                };
                
                return (
                  <div key={module.id} className={`group relative flex items-center gap-4 p-4 rounded-2xl border-l-4 ${getGradeColor(module.grade)} hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] bg-white/90 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50`}>
                    {/* Module Number Badge */}
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-slate-800 text-base truncate group-hover:text-primary transition-colors duration-200">{module.name}</h4>
                        <span className={`px-3 py-1.5 rounded-xl text-sm font-bold shadow-md ${
                          gradePoint >= 3.7 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                          gradePoint >= 3.0 ? 'bg-gradient-to-r from-primary to-orange-600 text-white' :
                          gradePoint >= 2.0 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' :
                          'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        }`}>
                          {module.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <span className="text-primary">⚖️</span>
                        <span>{module.credits} credits</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GPA Circular Progress */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border border-slate-200/50 p-6 sm:p-10 animate-scale-in backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-orange-200/30 rounded-2xl shadow-lg">
              <span className="text-2xl sm:text-3xl">🎯</span>
              </div>
              <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-display">GPA Overview</h3>
              <p className="text-slate-600 text-sm sm:text-base mt-1">Track your academic performance</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Speedometer-style Progress */}
            <div className="relative w-36 h-24 sm:w-48 sm:h-32 mb-4 sm:mb-6">
              <svg className="w-36 h-24 sm:w-48 sm:h-32" viewBox="0 0 200 100">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 sm:pt-8">
                <div className={`text-2xl sm:text-4xl font-bold font-display ${
                  calculateGPA() >= 3.7 ? 'text-green-600' :
                  calculateGPA() >= 3.0 ? 'text-primary' :
                  calculateGPA() >= 2.0 ? 'text-primary' :
                  'text-primary'
                }`}>
                  {modules.length > 0 ? calculateGPA().toFixed(2) : '0.00'}
              </div>
                <div className="text-xs sm:text-sm font-semibold text-text-secondary">Cumulative GPA</div>
              </div>
            </div>
            
            {/* GPA Range */}
            <div className="flex justify-between w-full max-w-36 sm:max-w-48 mb-4 sm:mb-6 px-2 sm:px-4">
              <span className="text-xs sm:text-sm text-text-secondary">0.0</span>
              <span className="text-xs sm:text-sm text-text-secondary">4.0</span>
            </div>

            {/* Summary Stats */}
            {modules.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border border-slate-200/50 shadow-lg backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">{modules.length}</div>
                  <div className="text-sm sm:text-base font-semibold text-slate-600">Modules</div>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border border-slate-200/50 shadow-lg backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">
                    {modules.reduce((sum, module) => sum + module.credits, 0)}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-slate-600">Credits</div>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border border-slate-200/50 shadow-lg backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">
                    {modules.length > 0 ? calculateTotalGradePoints().toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-slate-600">Points</div>
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

