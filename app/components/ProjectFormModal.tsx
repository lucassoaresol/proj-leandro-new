
import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../types';

interface ProjectFormData {
  name: string;
  status: ProjectStatus;
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  project?: Project | null;
  existingNames: string[];
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
}) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('OPEN');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setStatus(project.status);
    } else {
      setName('');
      setStatus('OPEN');
    }
  }, [project, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim(), status });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">
            {project ? 'Editar projeto' : 'Novo projeto'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nome do projeto
            </label>
            <input
              type="text"
              required
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Plano de compras 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Status
            </label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <option value="OPEN">Aberto</option>
              <option value="FINISHED">Finalizado</option>
              <option value="CANCELED">Cancelado</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              {project ? 'Salvar alterações' : 'Criar projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
