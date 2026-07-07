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
      setModules(prevModules => prevModules.filter(module => module.id !== formSetId));
      
      setFormSets(formSets.filter(fs => fs.id !== formSetId));
    }
  };

  // Save module to the list
  const addModule = (formSetId: string) => {
    const formSet = formSets.find(fs => fs.id === formSetId);
    if (formSet && formSet.module.name && formSet.module.credits > 0 && formSet.module.grade) {
      const newModule = {
        ...formSet.module,
        id: formSetId
      };
      setModules(prevModules => {
        const existingIndex = prevModules.findIndex(module => module.id === formSetId);
        if (existingIndex >= 0) {
          const nextModules = [...prevModules];
          nextModules[existingIndex] = newModule;
          return nextModules;
        }

        return [...prevModules, newModule];
      });
      
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
    const updatedFormSets = formSets.map(fs => 
      fs.id === formSetId 
        ? { ...fs, module: { ...fs.module, [field]: value } }
        : fs
    );

    setFormSets(updatedFormSets);

    const updatedFormSet = updatedFormSets.find(fs => fs.id === formSetId);
    if (updatedFormSet?.module.name && updatedFormSet.module.credits > 0 && updatedFormSet.module.grade) {
      setModules(prevModules => prevModules.map(module => 
        module.id === formSetId
          ? { ...updatedFormSet.module, id: formSetId }
          : module
      ));
    }
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
      <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-4 sm:p-8">
        <div className="mb-6 sm:mb-8 border-b border-slate-800/80 pb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">Add New Module</h3>
        </div>

        {/* Module Input Table */}
        <div className="bg-[#131C2E] rounded border border-slate-800 p-4">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-7">
              <h4 className="text-sm font-bold text-slate-200">Module Name</h4>
            </div>
            <div className="col-span-2 text-center">
              <h4 className="text-sm font-bold text-slate-200">Credits</h4>
            </div>
            <div className="col-span-2 text-center">
              <h4 className="text-sm font-bold text-slate-200">Grade</h4>
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
                    className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm"
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
                    className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm text-center"
            />
          </div>

          {/* Grade Select */}
              <div className="col-span-2 px-2">
            <select
                  value={formSet.module.grade}
                  onChange={(e) => updateFormSet(formSet.id, 'grade', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white focus:outline-none focus:border-primary transition-colors duration-200 text-sm text-center"
            >
              <option value="" className="bg-[#0A0E1A]">Select Grade</option>
                  <option value="A+" className="bg-[#0A0E1A]">A+</option>
                  <option value="A" className="bg-[#0A0E1A]">A</option>
                  <option value="A-" className="bg-[#0A0E1A]">A-</option>
                  <option value="B+" className="bg-[#0A0E1A]">B+</option>
                  <option value="B" className="bg-[#0A0E1A]">B</option>
                  <option value="B-" className="bg-[#0A0E1A]">B-</option>
                  <option value="C+" className="bg-[#0A0E1A]">C+</option>
                  <option value="C" className="bg-[#0A0E1A]">C</option>
                  <option value="C-" className="bg-[#0A0E1A]">C-</option>
                  <option value="D+" className="bg-[#0A0E1A]">D+</option>
                  <option value="D" className="bg-[#0A0E1A]">D</option>
                  <option value="F" className="bg-[#0A0E1A]">F</option>
            </select>
          </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-center">
                {formSets.length > 1 && (
                  <button
                    onClick={() => removeFormSet(formSet.id)}
                    className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center font-bold"
                  >
                    <span className="text-lg">−</span>
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
                className="bg-primary text-black px-6 py-2.5 rounded hover:bg-primary/95 transition-colors font-bold flex items-center gap-2 text-sm border-2 border-primary"
              >
                <span className="text-base font-extrabold">+</span>
            Add Module
          </button>
              {errorMessage && (
                <div className="text-red-400 text-sm font-bold bg-red-950/20 px-3 py-2 rounded border border-red-900/50">
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
          <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-8 sm:p-16 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4 sm:mb-6 font-display">Ready to calculate your GPA?</h3>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Add your first module above to start tracking your academic progress and see your GPA in real-time!
            </p>
            <div className="inline-flex items-center gap-3 text-primary font-bold bg-primary/10 px-6 sm:px-8 py-4 sm:py-5 rounded border-2 border-primary/20 text-base sm:text-lg">
              <span>Start by adding a module above</span>
            </div>
          </div>
        )}

        {/* Modules Summary */}
        {modules.length > 0 && (
          <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-6 sm:p-10">
            <div className="mb-8 border-b border-slate-800/80 pb-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">Your Modules</h3>
              <p className="text-slate-300 text-sm sm:text-base mt-1">Track your academic progress</p>
            </div>
            
            <div className="space-y-3">
              {modules.map((module, index) => {
                const gradePoint = getGradePoint(module.grade);
                const getGradeColor = (grade: string) => {
                  const point = getGradePoint(grade);
                  if (point >= 3.7) return 'border-l-green-500 bg-[#131C2E]';
                  if (point >= 3.0) return 'border-l-primary bg-[#131C2E]';
                  if (point >= 2.0) return 'border-l-orange-400 bg-[#131C2E]';
                  return 'border-l-red-500 bg-[#131C2E]';
                };
                
                return (
                  <div key={module.id} className={`group flex items-center gap-4 p-4 rounded border-2 border-slate-800 border-l-4 ${getGradeColor(module.grade)}`}>
                    {/* Module Number Badge */}
                    <div className="w-8 h-8 bg-slate-800 text-white rounded flex items-center justify-center text-sm font-bold flex-shrink-0 border border-slate-700">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-slate-200 text-base truncate">{module.name}</h4>
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          gradePoint >= 3.7 ? 'bg-green-500 text-black' :
                          gradePoint >= 3.0 ? 'bg-primary text-black' :
                          gradePoint >= 2.0 ? 'bg-orange-400 text-black' :
                          'bg-red-500 text-white'
                        }`}>
                          {module.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                        <span>{module.credits} Credits</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GPA Circular Progress */}
        <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-6 sm:p-10">
          <div className="mb-8 border-b border-slate-800/80 pb-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">GPA Overview</h3>
            <p className="text-slate-300 text-sm sm:text-base mt-1">Track your academic performance</p>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Speedometer-style Progress */}
            <div className="relative w-36 h-24 sm:w-48 sm:h-32 mb-4 sm:mb-6">
              <svg className="w-36 h-24 sm:w-48 sm:h-32" viewBox="0 0 200 100">
                {/* Background Arc */}
                <path
                  d="M 20 80 A 80 80 0 0 1 180 80"
                  stroke="#1E293B"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Progress Arc */}
                <path
                  d="M 20 80 A 80 80 0 0 1 180 80"
                  stroke={
                    calculateGPA() >= 3.7 ? '#22C55E' : '#FF7A00'
                  }
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(calculateGPA() / 4.0) * 251.2} 251.2`}
                />
              </svg>
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 sm:pt-8">
                <div className={`text-2xl sm:text-4xl font-bold font-display ${
                  calculateGPA() >= 3.7 ? 'text-green-500' : 'text-primary'
                }`}>
                  {modules.length > 0 ? calculateGPA().toFixed(2) : '0.00'}
              </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">Cumulative GPA</div>
              </div>
            </div>
            
            {/* GPA Range */}
            <div className="flex justify-between w-full max-w-36 sm:max-w-48 mb-4 sm:mb-6 px-2 sm:px-4">
              <span className="text-xs sm:text-sm text-slate-300">0.0</span>
              <span className="text-xs sm:text-sm text-slate-300">4.0</span>
            </div>

            {/* Summary Stats */}
            {modules.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full">
                <div className="bg-[#131C2E] rounded border border-slate-800 p-4 sm:p-6 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-100">{modules.length}</div>
                  <div className="text-sm sm:text-base font-bold text-slate-300">Modules</div>
                </div>
                <div className="bg-[#131C2E] rounded border border-slate-800 p-4 sm:p-6 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-100">
                    {modules.reduce((sum, module) => sum + module.credits, 0)}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-300">Credits</div>
                </div>
                <div className="bg-[#131C2E] rounded border border-slate-800 p-4 sm:p-6 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-100">
                    {modules.length > 0 ? calculateTotalGradePoints().toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-300">Points</div>
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

