import Dexie from 'dexie';

let db = new Dexie('palettepicker');

db.version(1).stores({
  projects: 'id, project_name',
  palettes: 'id, name, color_1, color_2, color_3, color_4, color_5, project_id'
});

export const saveOfflineProjects = (project) => {
  return db.projects.add(project);
};

export const saveOfflinePalettes = (palette) => {
  return db.palettes.add(palette);
};

export const loadOfflineProjects = () => {
  return db.projects.toArray();
};

export const loadOfflinePalettes = (id) => {
  return db.palettes.where('projectId').equals(id).toArray();
};
