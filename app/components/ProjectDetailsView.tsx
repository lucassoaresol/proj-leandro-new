
import React, { useState, useEffect, useCallback } from 'react';
import { Project, ProjectManager, ProjectManagerResponse, ProjectCriterion, ProjectCriterionResponse, OptimizationGoal, ProjectStatus } from '../types';
import { projectManagerService } from '../services/projectManagerService';
import { projectCriterionService } from '../services/projectCriterionService';
import { Icons } from '../constants';
import ProjectManagerFormModal from './ProjectManagerFormModal';
import ProjectCriterionFormModal from './ProjectCriterionFormModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface ProjectDetailsViewProps {
  project: Project;
  onBack: () => void;
  onStartEvaluation: (manager: ProjectManager) => void;
}

const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({ project, onBack, onStartEvaluation }) => {
  const [managersData, setManagersData] = useState<ProjectManagerResponse | null>(null);
  const [managersLoading, setManagersLoading] = useState(true);
  const [criteriaData, setCriteriaData] = useState<ProjectCriterionResponse | null>(null);
  const [criteriaLoading, setCriteriaLoading] = useState(true);

  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isCriterionModalOpen, setIsCriterionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteContext, setDeleteContext] = useState<{ type: 'manager' | 'criterion', id: number, name: string } | null>(null);
  
  const [editingManager, setEditingManager] = useState<ProjectManager | null>(null);
  const [editingProjectCriterion, setEditingProjectCriterion] = useState<ProjectCriterion | null>(null);

  const statusLabels: Record<ProjectStatus, string> = {
    OPEN: 'Aberto',
    FINISHED: 'Finalizado',
    CANCELED: 'Cancelado',
  };

  const statusClasses: Record<ProjectStatus, string> = {
    OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    FINISHED: 'bg-blue-50 text-blue-700 border-blue-100',
    CANCELED: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  const fetchData = useCallback(async () => {
    try {
      setManagersLoading(true);
      setCriteriaLoading(true);
      const [mRes, cRes] = await Promise.all([
        projectManagerService.getAll(1, project.id),
        projectCriterionService.getAll(1, project.id)
      ]);
      setManagersData(mRes);
      setCriteriaData(cRes);
    } catch (err) {
      console.error(err);
    } finally {
      setManagersLoading(false);
      setCriteriaLoading(false);
    }
  }, [project.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleManagerCreate = async (payload: { project_id: number; manager_id: number; importance_weight: number }) => {
    try {
      await projectManagerService.create(payload);
      fetchData();
    } catch (err) { alert('Error adding manager'); }
  };

  const handleManagerUpdate = async (id: number, weight: number) => {
    try {
      await projectManagerService.update(id, { importance_weight: weight });
      fetchData();
    } catch (err) { alert('Error updating manager'); }
  };

  const handleCriterionCreate = async (data: { criteria_id: number; optimization_goal: OptimizationGoal }) => {
    try {
      await projectCriterionService.create({ project_id: project.id, ...data });
      fetchData();
    } catch (err) { alert('Error adding criterion'); }
  };

  const handleCriterionUpdate = async (id: number, goal: OptimizationGoal) => {
    try {
      await projectCriterionService.update(id, { optimization_goal: goal });
      fetchData();
    } catch (err) { alert('Error updating criterion'); }
  };

  const handleConfirmDelete = async () => {
    if (!deleteContext) return;
    try {
      setIsDeleting(true);
      if (deleteContext.type === 'manager') {
        await projectManagerService.delete(deleteContext.id);
      } else {
        await projectCriterionService.delete(deleteContext.id);
      }
      setIsDeleteModalOpen(false);
      setDeleteContext(null);
      fetchData();
    } catch (err) {
      alert('Error during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Projects</span>
      </button>

      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{project.name}</h2>
            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-mono rounded border border-indigo-100 uppercase tracking-wider">
              {project.public_id}
            </span>
            <span className={`px-2 py-1 text-[10px] font-bold rounded border uppercase tracking-wider ${statusClasses[project.status]}`}>
              {statusLabels[project.status]}
            </span>
          </div>
          <p className="text-slate-500">Configuração do plano de compra e avaliações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <Icons.Users /> Team Members
            </h3>
            <button
              onClick={() => { setEditingManager(null); setIsManagerModalOpen(true); }}
              className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
            >
              <Icons.Plus /> Add Manager
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {managersLoading ? (
               <div className="p-12 text-center text-slate-400">Loading team...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Weight</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Manager</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {managersData?.data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100">
                          {item.importance_weight}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{item.manager_name}</td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          onClick={() => onStartEvaluation(item)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                          title="Start Pairwise Evaluation"
                        >
                          <Icons.Scale />
                        </button>
                        <button
                          onClick={() => { setEditingManager(item); setIsManagerModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteContext({ type: 'manager', id: item.id, name: item.manager_name });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        >
                          <Icons.Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {managersData?.data.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No managers assigned.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="xl:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <Icons.Target /> Evaluation Criteria
            </h3>
            <button
              onClick={() => { setEditingProjectCriterion(null); setIsCriterionModalOpen(true); }}
              className="text-amber-600 hover:text-amber-700 text-sm font-bold flex items-center gap-1"
            >
              <Icons.Plus /> Add Criterion
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {criteriaLoading ? (
               <div className="p-12 text-center text-slate-400">Loading criteria...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Goal</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Criterion</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {criteriaData?.data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                          item.optimization_goal === 'MAXIMIZE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {item.optimization_goal}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{item.criteria_name}</td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          onClick={() => { setEditingProjectCriterion(item); setIsCriterionModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-all"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteContext({ type: 'criterion', id: item.id, name: item.criteria_name });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        >
                          <Icons.Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {criteriaData?.data.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No criteria assigned.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="xl:col-span-12">
            <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 flex flex-wrap items-center justify-between gap-6 shadow-2xl shadow-slate-900/20">
                <div className="flex gap-12">
                    <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Created At</span>
                        <span className="text-sm font-mono tracking-tight">{new Date(project.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Update</span>
                        <span className="text-sm font-mono tracking-tight">{new Date(project.updated_at).toLocaleString('pt-BR')}</span>
                    </div>
                </div>
                <div className="flex gap-4">
                   <div className="px-5 py-3 bg-slate-800 rounded-2xl border border-slate-700 shadow-inner">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Staff</span>
                      <span className="text-2xl font-black text-white tabular-nums leading-none">{managersData?.total || 0}</span>
                   </div>
                   <div className="px-5 py-3 bg-slate-800 rounded-2xl border border-slate-700 shadow-inner">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Goals</span>
                      <span className="text-2xl font-black text-white tabular-nums leading-none">{criteriaData?.total || 0}</span>
                   </div>
                </div>
            </div>
        </div>
      </div>

      <ProjectManagerFormModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        assignment={editingManager}
        onSubmit={handleManagerCreate}
        onUpdate={handleManagerUpdate}
        fixedProjectId={project.id}
      />

      <ProjectCriterionFormModal
        isOpen={isCriterionModalOpen}
        onClose={() => setIsCriterionModalOpen(false)}
        projectCriterion={editingProjectCriterion}
        onSubmit={handleCriterionCreate}
        onUpdate={handleCriterionUpdate}
        projectId={project.id}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Remove ${deleteContext?.type === 'manager' ? 'Member' : 'Criterion'}`}
        message={`Are you sure you want to remove "${deleteContext?.name}" from this project?`}
      />
    </div>
  );
};

export default ProjectDetailsView;
