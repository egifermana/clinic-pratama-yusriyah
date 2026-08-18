import type { StateCreator } from "zustand";
import type { Project, ProjectInput } from "@/types/accounting/project";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface ProjectsSlice {
  projects: Project[];
  addProject: (input: ProjectInput) => void;
  updateProject: (id: string, input: ProjectInput) => void;
  deleteProject: (id: string) => void;
}

export const createProjectsSlice: StateCreator<StoreState, [], [], ProjectsSlice> = (
  set
) => ({
  projects: [],
  addProject: (input) =>
    set((state) => ({
      projects: [...state.projects, { ...input, id: generateId(), createdAt: nowIso() }],
    })),
  updateProject: (id, input) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...input, id, createdAt: p.createdAt } : p
      ),
    })),
  deleteProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
});
