export const INCIDENT_TO_CATEGORY_MAP: Record<string, string> = {
  'su-co-lop-xe': 'va-vo-va-lop-xe',
  'het-binh-ac-quy': 'kich-binh-sac-ac-quy',
  'het-nhien-lieu': 'tiep-nhien-lieu',
  'xe-khong-khoi-dong': 'sua-chua-dong-co-luu-dong',
  'xe-chet-may': 'sua-chua-dong-co-luu-dong',
  'xe-gap-su-co-ky-thuat': 'sua-chua-dong-co-luu-dong',
  'tai-nan-giao-thong': 'cau-keo-xe-o-to',
  'xe-bi-sa-lay': 'cau-keo-xe-o-to',
  'xe-bi-ngap-nuoc': 'cau-keo-xe-o-to',
  'su-co-khoa-xe': 'cuu-ho-khoa-xe',
  khac: 'sua-chua-dong-co-luu-dong',
};

/**
 * Maps a single incident type slug to a database category slug.
 * Returns the mapped category slug or a default/fallback.
 */
export function mapIncidentTypeToCategory(incidentType: string): string {
  return INCIDENT_TO_CATEGORY_MAP[incidentType] || 'sua-chua-dong-co-luu-dong';
}

/**
 * Maps an array of incident type slugs to an array of unique category slugs.
 */
export function mapIncidentTypesToCategories(incidentTypes: string[]): string[] {
  if (!incidentTypes || incidentTypes.length === 0) return [];
  const categories = incidentTypes.map((type) => mapIncidentTypeToCategory(type));
  return Array.from(new Set(categories));
}
