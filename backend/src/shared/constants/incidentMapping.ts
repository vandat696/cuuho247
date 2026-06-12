import { INCIDENT_REGISTRY, mapIncidentTypeToCategory, mapIncidentTypesToCategories } from '../config/incidents';

export const INCIDENT_TO_CATEGORY_MAP = INCIDENT_REGISTRY.reduce(
  (acc, current) => {
    acc[current.slug] = current.categorySlug;
    return acc;
  },
  {} as Record<string, string>
);

export { mapIncidentTypeToCategory, mapIncidentTypesToCategories };
