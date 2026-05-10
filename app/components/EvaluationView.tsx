
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, ProjectManager, ProjectCriterion, ProjectCriterionPairwiseEvaluation } from '../types';
import { pairwiseService } from '../services/pairwiseService';
import { projectCriterionService } from '../services/projectCriterionService';
import { Icons } from '../constants';

interface EvaluationViewProps {
  manager: ProjectManager;
  project: Project;
  onBack: () => void;
}

type MatrixState = Record<string, number>;

const EvaluationView: React.FC<EvaluationViewProps> = ({ manager, project, onBack }) => {
  const [criteria, setCriteria] = useState<ProjectCriterion[]>([]);
  const [matrix, setMatrix] = useState<MatrixState>({});
  const [loading, setLoading] = useState(true);
  const [savingPair, setSavingPair] = useState(false);
  const [calculatingCR, setCalculatingCR] = useState(false);
  const [crResult, setCrResult] = useState<{ cr: number; is_consistent: boolean } | null>(null);
  const [existingEvaluations, setExistingEvaluations] = useState<ProjectCriterionPairwiseEvaluation[]>([]);
  
  // Interaction states
  const [focusedPair, setFocusedPair] = useState<{ a: ProjectCriterion, b: ProjectCriterion } | null>(null);

  const getCellKey = (aId: number, bId: number) => `${aId}-${bId}`;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [criteriaRes, evalRes] = await Promise.all([
        projectCriterionService.getAll(1, project.id),
        pairwiseService.getAll(1, manager.id, project.id)
      ]);
      
      const criteriaList = criteriaRes.data;
      setCriteria(criteriaList);
      setExistingEvaluations(evalRes.data);

      const initialState: MatrixState = {};
      criteriaList.forEach(c1 => {
        criteriaList.forEach(c2 => {
          const key = getCellKey(c1.id, c2.id);
          if (c1.id === c2.id) {
            initialState[key] = 1;
          } else {
            const match = evalRes.data.find(e => 
              e.criterion_a_id === c1.id && e.criterion_b_id === c2.id
            );
            // If no match, we don't put a default 1 here to distinguish "untouched" cells
            if (match) {
               initialState[key] = Number(match.rating);
            }
          }
        });
      });
      setMatrix(initialState);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [project.id, manager.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculations for progress
  const requiredPairs = useMemo(() => {
    const pairs: { a: ProjectCriterion, b: ProjectCriterion }[] = [];
    for (let i = 0; i < criteria.length; i++) {
      for (let j = i + 1; j < criteria.length; j++) {
        pairs.push({ a: criteria[i], b: criteria[j] });
      }
    }
    return pairs;
  }, [criteria]);

  const pendingPairs = useMemo(() => {
    return requiredPairs.filter(p => !matrix[getCellKey(p.a.id, p.b.id)]);
  }, [requiredPairs, matrix]);

  const progressPercentage = useMemo(() => {
    if (requiredPairs.length === 0) return 0;
    return Math.round(((requiredPairs.length - pendingPairs.length) / requiredPairs.length) * 100);
  }, [requiredPairs, pendingPairs]);

  const updateLocalRating = (aId: number, bId: number, val: number) => {
    setMatrix(prev => ({
      ...prev,
      [getCellKey(aId, bId)]: val,
      [getCellKey(bId, aId)]: 1 / val
    }));
  };

  const persistPair = async () => {
    if (!focusedPair) return;
    setSavingPair(true);
    try {
      const currentRating = matrix[getCellKey(focusedPair.a.id, focusedPair.b.id)] || 1;
      const existing = existingEvaluations.find(e =>
        e.criterion_a_id === focusedPair.a.id && e.criterion_b_id === focusedPair.b.id
      );

      if (existing) {
        if (Number(existing.rating) !== currentRating) {
          await pairwiseService.update(existing.id, { rating: currentRating });
        }
      } else {
        await pairwiseService.create({
          manager_id: manager.id,
          criterion_a_id: focusedPair.a.id,
          criterion_b_id: focusedPair.b.id,
          rating: currentRating
        });
      }
      
      // Update local state to reflect new saved items
      const evalRes = await pairwiseService.getAll(1, manager.id, project.id);
      setExistingEvaluations(evalRes.data);
      
      // Auto-deselect and reset consistency result (stale)
      setFocusedPair(null);
      setCrResult(null);
    } catch (err) {
      alert('Error saving this judgment. Please check connection.');
    } finally {
      setSavingPair(false);
    }
  };

  const handleCalculateCR = async () => {
    setCalculatingCR(true);
    try {
      const result = await pairwiseService.calculateCR(manager.id, project.id);
      setCrResult(result);
    } catch (err) {
      alert('Failed to calculate Consistency Ratio. Ensure all pairs are filled.');
    } finally {
      setCalculatingCR(false);
    }
  };

  const mapSliderToSaaty = (val: number): number => {
    if (val === 0) return 1;
    if (val > 0) return val + 1;
    return 1 / (Math.abs(val) + 1);
  };

  const mapSaatyToSlider = (val: number): number => {
    if (val === 1) return 0;
    if (val > 1) return val - 1;
    return -(Math.round(1 / val) - 1);
  };

  const formatRating = (val: number | undefined) => {
    if (val === undefined) return "-";
    if (val === 1) return "1";
    if (val < 1) return `1/${Math.round(1/val)}`;
    return val.toString();
  };

  const getSliderLabel = (val: number) => {
    const abs = Math.abs(val);
    if (abs === 0) return "Equal Importance";
    let desc = "";
    if (abs <= 2) desc = "Moderate";
    else if (abs <= 4) desc = "Strong";
    else if (abs <= 6) desc = "Very Strong";
    else desc = "Extreme";
    return `${desc} preference for ${val > 0 ? 'Side A' : 'Side B'}`;
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800">Calibrating Judgment Engine</h3>
            <p className="text-slate-400">Loading criteria and existing matrices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Immersive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
            <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                Return to Project
            </button>
            <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">JUDGMENT MATRIX</h2>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full shadow-lg shadow-blue-200">Evaluator</div>
                    <span className="text-xl font-bold text-slate-600 tracking-tight">{manager.manager_name}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Matrix Progress</span>
                <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <span className="text-xs font-black text-slate-600 mt-1">{progressPercentage}% COMPLETED</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Matrix Visualization */}
        <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Criteria Relationship Map</span>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 rounded bg-blue-50 border border-blue-200"></div> Pending</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 rounded bg-blue-600"></div> Evaluated</div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="bg-slate-50/50 p-6 border-b border-r border-slate-200 text-[10px] font-black text-slate-400 text-center w-40">CRITERIA</th>
                                {criteria.map(c => (
                                    <th key={c.id} className="bg-slate-50/50 p-6 border-b border-r border-slate-200 text-[11px] font-black text-slate-800 uppercase tracking-tight text-center min-w-[120px]">
                                        {c.criteria_name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {criteria.map((rowC, rowIndex) => (
                                <tr key={rowC.id}>
                                    <td className="bg-slate-50/50 p-6 border-b border-r border-slate-200 text-[11px] font-black text-slate-800 uppercase text-center">
                                        {rowC.criteria_name}
                                    </td>
                                    {criteria.map((colC, colIndex) => {
                                        const isDiagonal = rowIndex === colIndex;
                                        const isUpper = colIndex > rowIndex;
                                        const key = getCellKey(rowC.id, colC.id);
                                        const val = matrix[key];
                                        const isFocused = focusedPair?.a.id === rowC.id && focusedPair?.b.id === colC.id;
                                        const hasVal = val !== undefined;

                                        return (
                                            <td 
                                                key={colC.id}
                                                onClick={() => isUpper && setFocusedPair({ a: rowC, b: colC })}
                                                className={`p-0 border-b border-r border-slate-200 text-center transition-all cursor-default ${
                                                    isDiagonal ? 'bg-slate-100/50' : 
                                                    isUpper ? (isFocused ? 'bg-blue-600 ring-4 ring-inset ring-blue-500' : hasVal ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'bg-white hover:bg-slate-50 cursor-pointer') : 
                                                    'bg-slate-50/30'
                                                }`}
                                            >
                                                <div className={`w-full h-full py-8 text-lg font-black tabular-nums transition-transform ${
                                                    isDiagonal ? 'text-slate-300' :
                                                    isUpper ? (isFocused ? 'text-white scale-110' : hasVal ? 'text-blue-600' : 'text-slate-200') :
                                                    'text-slate-400 opacity-60'
                                                }`}>
                                                    {formatRating(val)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Consistency Results Section */}
            {progressPercentage > 0 && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className={`p-5 rounded-[2rem] ${crResult ? (crResult.is_consistent ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600') : 'bg-blue-50 text-blue-600'}`}>
                            <Icons.Scale />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Consistency Intelligence</h4>
                            <p className="text-sm text-slate-500">
                                {crResult 
                                  ? `Matrix CR: ${crResult.cr.toFixed(4)}. Reliability: ${crResult.is_consistent ? 'Optimal' : 'Needs Review'}` 
                                  : pendingPairs.length > 0 
                                    ? `Evaluations in progress. ${pendingPairs.length} pairs remaining.` 
                                    : 'Ready to calculate mathematical consistency.'}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleCalculateCR}
                        disabled={pendingPairs.length > 0 || calculatingCR}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-30 flex items-center gap-3"
                    >
                        {calculatingCR ? (
                             <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : <Icons.Refresh />}
                        {pendingPairs.length > 0 ? 'COMPLETE MATRIX FIRST' : 'CALCULATE CONSISTENCY'}
                    </button>
                </div>
            )}
        </div>

        {/* Interaction Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            {!focusedPair ? (
                <div className="bg-slate-900 rounded-[2.5rem] p-10 h-full flex flex-col gap-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Icons.Layout /></div>
                    
                    <div>
                        <h4 className="text-white text-2xl font-black uppercase tracking-tight mb-2">Pending Actions</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Complete the following pairwise comparisons to unlock the consistency analytics.
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                        {pendingPairs.length === 0 ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 text-center">
                                <div className="text-emerald-400 mb-2 flex justify-center"><Icons.Sparkles /></div>
                                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Matrix 100% Completed</p>
                            </div>
                        ) : (
                            pendingPairs.map(p => (
                                <button
                                    key={getCellKey(p.a.id, p.b.id)}
                                    onClick={() => setFocusedPair(p)}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all group flex items-center justify-between"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[8px] font-black text-blue-400 uppercase tracking-widest">
                                            <span>{p.a.criteria_name}</span>
                                            <span className="text-white/20">VS</span>
                                            <span>{p.b.criteria_name}</span>
                                        </div>
                                        <div className="text-white text-xs font-bold truncate max-w-[150px]">Unjudged Relationship</div>
                                    </div>
                                    <div className="text-white/20 group-hover:text-blue-400 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl flex flex-col gap-8 animate-in slide-in-from-right-8 duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Focused Comparison</span>
                        <button onClick={() => setFocusedPair(null)} className="text-slate-300 hover:text-slate-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="space-y-8 flex-1">
                        <div className="flex flex-col gap-2 text-center">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter mb-4">
                                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">Side A</span>
                                <span className="text-slate-400 px-2 py-1 italic">Comparison</span>
                                <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded">Side B</span>
                            </div>
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                                <h5 className="text-xl font-black text-slate-800 tracking-tighter leading-tight break-words">{focusedPair.a.criteria_name}</h5>
                                <div className="text-slate-200 font-black italic">VS</div>
                                <h5 className="text-xl font-black text-slate-800 tracking-tighter leading-tight break-words">{focusedPair.b.criteria_name}</h5>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="text-center">
                                <span className={`text-base font-black px-4 py-2 rounded-xl transition-all duration-300 ${
                                    mapSaatyToSlider(matrix[getCellKey(focusedPair.a.id, focusedPair.b.id)] || 1) > 0 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                    : mapSaatyToSlider(matrix[getCellKey(focusedPair.a.id, focusedPair.b.id)] || 1) < 0 
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' 
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {getSliderLabel(mapSaatyToSlider(matrix[getCellKey(focusedPair.a.id, focusedPair.b.id)] || 1))}
                                </span>
                            </div>

                            <div className="relative h-12 flex items-center">
                                <input
                                    type="range"
                                    min="-8"
                                    max="8"
                                    step="2"
                                    className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                                    value={mapSaatyToSlider(matrix[getCellKey(focusedPair.a.id, focusedPair.b.id)] || 1)}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        updateLocalRating(focusedPair.a.id, focusedPair.b.id, mapSliderToSaaty(val));
                                    }}
                                />
                                <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-1">
                                    {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map(tick => (
                                        <div key={tick} className={`w-1 h-3 rounded-full ${tick === 0 ? 'bg-slate-400 h-6' : 'bg-slate-200'}`}></div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                                <span className="text-blue-600">Priority A</span>
                                <span>Neutral</span>
                                <span className="text-amber-500">Priority B</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200">
                             <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Result Preview</h6>
                             <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">A x B</span>
                                    <span className="text-sm font-black text-blue-600">{formatRating(matrix[getCellKey(focusedPair.a.id, focusedPair.b.id)] || 1)}</span>
                                </div>
                                <div className="flex-1 text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">B x A</span>
                                    <span className="text-sm font-black text-slate-400">{formatRating(1 / (matrix[getCellKey(focusedPair.a.id, focusedPair.b.id)] || 1))}</span>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button
                          onClick={persistPair}
                          disabled={savingPair}
                          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.97] flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {savingPair ? (
                             <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>SALVANDO...</span>
                             </>
                          ) : (
                             <>
                                <Icons.Plus />
                                <span>SALVAR JULGAMENTO</span>
                             </>
                          )}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Guide Info */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6">
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl">
                        <Icons.Sparkles />
                    </div>
                    <div className="space-y-1">
                        <h6 className="text-sm font-black text-indigo-900 uppercase tracking-tight">Expert Tip</h6>
                        <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                            The Consistency Ratio (CR) measures how logical your decisions are. Aim for a value below 0.10 for scientifically robust results.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationView;
