import React, { useState } from 'react';

// Module with detailed marks
interface PlannerModule {
  id: string;
  name: string;
  credits: number;
  caMarks: number;
  caWeight: number;
  finalWeight: number;
  finalMarks?: number;
}

// Grade info
interface GradeInfo {
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
}

const GRADES: GradeInfo[] = [
  { grade: 'A+', minMarks: 90, maxMarks: 100, gradePoint: 4.0 },
  { grade: 'A', minMarks: 80, maxMarks: 89, gradePoint: 4.0 },
  { grade: 'A-', minMarks: 75, maxMarks: 79, gradePoint: 3.7 },
  { grade: 'B+', minMarks: 70, maxMarks: 74, gradePoint: 3.3 },
  { grade: 'B', minMarks: 65, maxMarks: 69, gradePoint: 3.0 },
  { grade: 'B-', minMarks: 60, maxMarks: 64, gradePoint: 2.7 },
  { grade: 'C+', minMarks: 55, maxMarks: 59, gradePoint: 2.3 },
  { grade: 'C', minMarks: 45, maxMarks: 54, gradePoint: 2.0 },
  { grade: 'C-', minMarks: 40, maxMarks: 44, gradePoint: 1.7 },
  { grade: 'D+', minMarks: 35, maxMarks: 39, gradePoint: 1.3 },
  { grade: 'D', minMarks: 30, maxMarks: 34, gradePoint: 1.0 },
  { grade: 'E', minMarks: 0, maxMarks: 29, gradePoint: 0.0 },
];

const GpaPlanner: React.FC = () => {
  const [modules, setModules] = useState<PlannerModule[]>([]);
  const [formSets, setFormSets] = useState<PlannerModule[]>([
    {
      id: Date.now().toString(),
      name: '',
      credits: 0,
      caMarks: 0,
      caWeight: 50,
      finalWeight: 50,
    }
  ]);

  // Get grade from total marks
  const getGrade = (totalMarks: number): string => {
    const gradeInfo = GRADES.find(g => totalMarks >= g.minMarks && totalMarks <= g.maxMarks);
    return gradeInfo?.grade || 'E';
  };

  // Get grade point from grade
  const getGradePoint = (grade: string): number => {
    const gradeInfo = GRADES.find(g => g.grade === grade);
    return gradeInfo?.gradePoint || 0;
  };

  // Calculate final marks needed for target grade
  const calculateFinalNeeded = (caMarks: number, caWeight: number, targetMarks: number): number => {
    const finalWeight = 100 - caWeight;
    const targetTotal = targetMarks;
    const caContribution = (caMarks * caWeight) / 100;
    const remainingNeeded = targetTotal - caContribution;
    const finalMarksNeeded = (remainingNeeded / finalWeight) * 100;
    return Math.max(0, Math.min(100, finalMarksNeeded));
  };

  // Get risk status
  const getRiskStatus = (module: PlannerModule): { status: string; message: string; color: string } => {
    if (module.caMarks < 45) {
      return {
        status: 'Prorata',
        message: 'Risk of Prorata (CA < 45%) - Need to repeat CA',
        color: 'red'
      };
    }

    const finalNeeded = calculateFinalNeeded(module.caMarks, module.caWeight, 45);

    if (finalNeeded > 100) {
      return {
        status: 'Critical',
        message: 'Cannot pass even with 100% in final exam',
        color: 'red'
      };
    }

    if (module.finalMarks) {
      const totalMarks = ((module.caMarks * module.caWeight) + (module.finalMarks * module.finalWeight)) / 100;
      if (totalMarks < 45) {
        return {
          status: 'Final Repeat',
          message: 'Risk of Final Repeat - Need to reattempt final exam',
          color: 'orange'
        };
      }
      return {
        status: 'Safe',
        message: 'Safe Zone - Will pass',
        color: 'green'
      };
    }

    return {
      status: 'Pending',
      message: 'Enter final marks to check status',
      color: 'gray'
    };
  };

  // Add new module form
  const addNewForm = () => {
    setFormSets([
      ...formSets,
      {
        id: Date.now().toString(),
        name: '',
        credits: 0,
        caMarks: 0,
        caWeight: 50,
        finalWeight: 50,
      }
    ]);
  };

  // Remove module form
  const removeForm = (id: string) => {
    if (formSets.length > 1) {
      setFormSets(formSets.filter(fs => fs.id !== id));
    }
  };

  // Update form field and auto-save to modules if valid
  const updateForm = (id: string, field: keyof PlannerModule, value: any) => {
    const updatedFormSets = formSets.map(fs => 
      fs.id === id ? { ...fs, [field]: value } : fs
    );
    setFormSets(updatedFormSets);

    // Auto-save if module is complete
    const updatedFormSet = updatedFormSets.find(fs => fs.id === id);
    if (updatedFormSet && updatedFormSet.name && updatedFormSet.credits > 0) {
      // Check if module already exists in modules list
      const existingModule = modules.find(m => m.id === id);
      if (existingModule) {
        // Update existing module
        setModules(modules.map(m => m.id === id ? { ...updatedFormSet, id: id } : m));
      } else {
        // Add new module
        setModules([...modules, { ...updatedFormSet, id: updatedFormSet.id }]);
      }
    }
  };



  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2 font-display">GPA Planner</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Plan your academic journey with SLIIT's grading system. Track CA marks, predict final results, and avoid prorata or repeat risks.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 border-b border-slate-800/80 pb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">Add Module</h3>
        </div>

        <div className="space-y-3">
          {formSets.map((formSet, index) => (
            <div key={formSet.id} className="p-3 sm:p-4 bg-[#131C2E] rounded border border-slate-800">
              <div className="grid grid-cols-12 gap-2 sm:gap-3 items-end">
                <div className="col-span-5">
                  <label className="block text-sm font-bold text-slate-200 mb-2">Module Name</label>
                  <input
                    type="text"
                    value={formSet.name}
                    onChange={(e) => updateForm(formSet.id, 'name', e.target.value)}
                    placeholder="e.g., Software Engineering"
                    className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-200 mb-2">Credits</label>
                  <input
                    type="number"
                    value={formSet.credits || ''}
                    onChange={(e) => updateForm(formSet.id, 'credits', parseInt(e.target.value) || 0)}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm text-center"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-200 mb-2">CA Marks (%)</label>
                  <input
                    type="number"
                    value={formSet.caMarks || ''}
                    onChange={(e) => updateForm(formSet.id, 'caMarks', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm text-center"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-200 mb-2">
                    CA Weight <span className="text-xs font-normal text-slate-400">(Final: {formSet.finalWeight}%)</span>
                  </label>
                  <input
                    type="number"
                    value={formSet.caWeight}
                    onChange={(e) => {
                      const caWeight = parseInt(e.target.value) || 50;
                      const finalWeight = 100 - caWeight;
                      // Update both weights at once
                      const updatedFormSets = formSets.map(fs => 
                        fs.id === formSet.id 
                          ? { ...fs, caWeight, finalWeight }
                          : fs
                      );
                      setFormSets(updatedFormSets);

                      // Auto-save if module is complete
                      const updatedFormSet = updatedFormSets.find(fs => fs.id === formSet.id);
                      if (updatedFormSet && updatedFormSet.name && updatedFormSet.credits > 0) {
                        const existingModule = modules.find(m => m.id === formSet.id);
                        if (existingModule) {
                          setModules(modules.map(m => m.id === formSet.id ? { ...updatedFormSet, id: formSet.id } : m));
                        } else {
                          setModules([...modules, { ...updatedFormSet, id: updatedFormSet.id }]);
                        }
                      }
                    }}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm text-center"
                  />
                </div>

                <div className="col-span-1 flex justify-end">
                  {formSets.length > 1 && (
                    <button
                      onClick={() => removeForm(formSet.id)}
                      className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center font-bold"
                      title="Remove this module"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <button
              onClick={addNewForm}
              className="bg-primary text-black border-2 border-primary px-6 py-2.5 rounded hover:bg-primary/95 transition-colors font-bold flex items-center gap-2 text-sm"
            >
              <span>+</span>
              Add Another Module
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {modules.length > 0 && (
        <div className="space-y-4">
          {modules.map((module) => {
            const finalNeeded = calculateFinalNeeded(module.caMarks, module.caWeight, 45);
            const riskStatus = getRiskStatus(module);
            const totalMarks = module.finalMarks 
              ? ((module.caMarks * module.caWeight) + (module.finalMarks * module.finalWeight)) / 100
              : (module.caMarks * module.caWeight) / 100;
            const grade = getGrade(totalMarks);
            const gradePoint = getGradePoint(grade);

            return (
              <div key={module.id} className="bg-[#0F1626] rounded border-2 border-slate-800 p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">{module.name}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* CA Info */}
                  <div>
                    <div className="bg-[#131C2E] border border-blue-900/40 rounded p-4 mb-4">
                      <div className="text-sm text-blue-400 font-bold mb-2">CA Marks</div>
                      <div className="text-2xl font-bold text-blue-200">{module.caMarks}%</div>
                      <div className="text-xs text-blue-400/80 mt-1">Weight: {module.caWeight}%</div>
                    </div>

                    {/* Risk Indicator */}
                    <div className={`p-3 rounded border mb-4 ${
                      riskStatus.color === 'red' ? 'bg-red-950/20 border-red-900/50 text-red-400' :
                      riskStatus.color === 'orange' ? 'bg-orange-950/20 border-orange-900/50 text-orange-400' :
                      riskStatus.color === 'green' ? 'bg-green-950/20 border-green-900/50 text-green-400' :
                      'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}>
                      <div className="text-sm font-bold mb-1">
                        {riskStatus.status}
                      </div>
                      <div className="text-xs opacity-90">
                        {riskStatus.message}
                      </div>
                    </div>

                    {/* Final Needed */}
                    {module.finalMarks === undefined && (
                      <div className="bg-primary/5 border border-primary/20 rounded p-4">
                        <div className="text-sm text-primary font-bold mb-2">Final Exam Needed</div>
                        <div className="text-2xl font-bold text-primary">{finalNeeded.toFixed(1)}%</div>
                        <div className="text-xs text-primary/70 mt-1">To pass with C grade</div>
                      </div>
                    )}
                  </div>

                  {/* Final Info */}
                  <div>
                    <div className="bg-[#131C2E] border border-green-900/40 rounded p-4 mb-4">
                      <div className="text-sm text-green-400 font-bold mb-2">Final Marks</div>
                      <input
                        type="number"
                        value={module.finalMarks || ''}
                        onChange={(e) => {
                          const updatedModules = modules.map(m => 
                            m.id === module.id 
                              ? { ...m, finalMarks: parseFloat(e.target.value) || undefined }
                              : m
                          );
                          setModules(updatedModules);
                        }}
                        placeholder="Enter final marks"
                        min="0"
                        max="100"
                        className="text-2xl font-bold text-green-200 w-full bg-transparent border-none outline-none"
                      />
                      <div className="text-xs text-green-400/80 mt-1">Weight: {module.finalWeight}%</div>
                    </div>

                    {/* Total & Grade */}
                    <div className="bg-[#1C132E] border border-purple-900/40 rounded p-4 mb-4">
                      <div className="text-sm text-purple-400 font-bold mb-2">Total Grade</div>
                      <div className="text-3xl font-bold text-purple-200 mb-1">{totalMarks.toFixed(1)}%</div>
                      <div className="text-lg font-bold text-purple-300">{grade}</div>
                      <div className="text-xs text-purple-400/80 mt-1">{gradePoint.toFixed(1)} GPA points</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GpaPlanner;
