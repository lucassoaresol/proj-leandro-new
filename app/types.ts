
export interface Manager {
  id: number;
  name: string;
  public_id: string;
  created_at: string;
  updated_at: string;
}

export interface ManagerResponse {
  total: number;
  pages: number;
  page: number;
  data: Manager[];
}

export interface ManagerCreateDTO {
  name: string;
}

export interface ManagerUpdateDTO {
  name: string;
}

export interface Project {
  id: number;
  name: string;
  public_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectResponse {
  total: number;
  pages: number;
  page: number;
  data: Project[];
}

export interface ProjectCreateDTO {
  name: string;
}

export interface ProjectUpdateDTO {
  name: string;
}

export interface ProjectManager {
  id: number;
  importance_weight: number;
  created_at: string;
  updated_at: string;
  manager_id: number;
  manager_name: string;
  project_id: number;
  project_name: string;
}

export interface ProjectManagerResponse {
  total: number;
  pages: number;
  page: number;
  data: ProjectManager[];
}

export interface ProjectManagerCreateDTO {
  project_id: number;
  manager_id: number;
  importance_weight: number;
}

export interface ProjectManagerUpdateDTO {
  importance_weight: number;
}

export interface Criterion {
  id: number;
  name: string;
  public_id: string;
  created_at: string;
  updated_at: string;
}

export interface CriterionResponse {
  total: number;
  pages: number;
  page: number;
  data: Criterion[];
}

export interface CriterionCreateDTO {
  name: string;
}

export interface CriterionUpdateDTO {
  name: string;
}

export type OptimizationGoal = 'MAXIMIZE' | 'MINIMIZE';

export interface ProjectCriterion {
  /** ID from project_criteria; pairwise evaluations must use this identifier. */
  id: number;
  optimization_goal: OptimizationGoal;
  created_at: string;
  updated_at: string;
  criteria_id: number;
  criteria_name: string;
  project_id: number;
  project_name: string;
}

export interface ProjectCriterionResponse {
  total: number;
  pages: number;
  page: number;
  data: ProjectCriterion[];
}

export interface ProjectCriterionCreateDTO {
  project_id: number;
  criteria_id: number;
  optimization_goal: OptimizationGoal;
}

export interface ProjectCriterionUpdateDTO {
  optimization_goal: OptimizationGoal;
}

export interface ProjectCriterionPairwiseEvaluation {
  id: number;
  rating: number;
  created_at: string;
  updated_at: string;
  manager_id: number;
  manager_name: string;
  criterion_a_id: number;
  criterion_a_name: string;
  criterion_b_id: number;
  criterion_b_name: string;
}

export interface ProjectCriterionPairwiseEvaluationResponse {
  total: number;
  pages: number;
  page: number;
  data: ProjectCriterionPairwiseEvaluation[];
}

export interface PairwiseEvaluationCreateDTO {
  rating: number;
  manager_id: number;
  criterion_a_id: number;
  criterion_b_id: number;
}

export interface PairwiseEvaluationUpdateDTO {
  rating: number;
}

export enum AppRoute {
  MANAGERS = 'managers',
  PROJECTS = 'projects',
  PROJECT_MANAGERS = 'project-managers',
  CRITERIA = 'criteria',
  DASHBOARD = 'dashboard',
  EVALUATION = 'evaluation'
}
