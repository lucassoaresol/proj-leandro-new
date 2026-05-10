
import React, { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { Project, ProjectCreateDTO, ProjectResponse, ProjectStatus } from '../types';
import { Icons } from '../constants';
import ProjectFormModal from './ProjectFormModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface ProjectsViewProps {
  onSelectProject: (project: Project) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ onSelectProject }) => {
  const [data, setData] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Selection state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

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

  const fetchProjects = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await projectService.getAll(page);
      setData(res);
      setError(null);
    } catch (err) {
      setError('Não foi possível carregar os projetos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (payload: ProjectCreateDTO) => {
    try {
      await projectService.create(payload);
      fetchProjects();
    } catch (err) {
      alert('Erro ao criar projeto');
    }
  };

  const handleUpdate = async (payload: ProjectCreateDTO) => {
    if (!editingProject) return;
    try {
      await projectService.update(editingProject.id, payload);
      fetchProjects();
    } catch (err) {
      alert('Erro ao atualizar projeto');
    } finally {
      setEditingProject(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    try {
      setIsDeleting(true);
      await projectService.delete(deletingProject.id);
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir projeto. A API retornou um erro.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Projetos</h2>
          <p className="text-slate-500">Gerencie os planos de compra hospitalar</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsFormModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Icons.Plus />
          <span>Novo projeto</span>
        </button>
      </div>

      {loading && !data ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => fetchProjects()} className="text-sm font-bold underline">Tentar novamente</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Projeto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID público</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Atualizado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.data.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onSelectProject(project)}
                      className="flex items-center text-left hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                        <Icons.Layout />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{project.name}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded border ${statusClasses[project.status]}`}>
                      {statusLabels[project.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded font-mono">
                      {project.public_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(project.updated_at)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Ver detalhes"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setIsFormModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingProject(project);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))}
              {data?.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    Nenhum projeto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {data && data.pages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Página {data.page} de {data.pages}
              </span>
              <div className="flex space-x-2">
                <button
                  disabled={data.page === 1}
                  onClick={() => fetchProjects(data.page - 1)}
                  className="px-3 py-1 bg-white border border-slate-200 rounded text-sm disabled:opacity-50 hover:bg-slate-50"
                >
                  Anterior
                </button>
                <button
                  disabled={data.page === data.pages}
                  onClick={() => fetchProjects(data.page + 1)}
                  className="px-3 py-1 bg-white border border-slate-200 rounded text-sm disabled:opacity-50 hover:bg-slate-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdate : handleCreate}
        project={editingProject}
        existingNames={data?.data.map(p => p.name) || []}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingProject(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir projeto"
        message={`Tem certeza que deseja excluir "${deletingProject?.name}"? Os dados associados podem ser perdidos.`}
      />
    </div>
  );
};

export default ProjectsView;
