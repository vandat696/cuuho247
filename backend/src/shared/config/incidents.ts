export interface IncidentType {
  slug: string;
  label: string;
  categorySlug: string;
}

export const INCIDENT_REGISTRY: IncidentType[] = [
  { slug: 'su-co-lop-xe', label: 'Lốp xe gặp sự cố', categorySlug: 'va-vo-va-lop-xe' },
  { slug: 'het-binh-ac-quy', label: 'Hết bình ắc quy', categorySlug: 'kich-binh-sac-ac-quy' },
  { slug: 'het-nhien-lieu', label: 'Hết nhiên liệu', categorySlug: 'tiep-nhien-lieu' },
  { slug: 'xe-khong-khoi-dong', label: 'Xe không khởi động được', categorySlug: 'sua-chua-dong-co-luu-dong' },
  { slug: 'xe-chet-may', label: 'Xe bị chết máy giữa đường', categorySlug: 'sua-chua-dong-co-luu-dong' },
  { slug: 'xe-gap-su-co-ky-thuat', label: 'Xe có dấu hiệu hỏng hóc', categorySlug: 'sua-chua-dong-co-luu-dong' },
  { slug: 'tai-nan-giao-thong', label: 'Tai nạn giao thông', categorySlug: 'cau-keo-xe-o-to' },
  { slug: 'xe-bi-sa-lay', label: 'Xe bị sa lầy hoặc mắc kẹt', categorySlug: 'cau-keo-xe-o-to' },
  { slug: 'xe-bi-ngap-nuoc', label: 'Xe bị ngập nước', categorySlug: 'cau-keo-xe-o-to' },
  { slug: 'su-co-khoa-xe', label: 'Không mở được xe', categorySlug: 'cuu-ho-khoa-xe' },
  { slug: 'khac', label: 'Sự cố khác', categorySlug: 'sua-chua-dong-co-luu-dong' },
];

export function getIncidentLabel(slug: string): string {
  const incident = INCIDENT_REGISTRY.find((i) => i.slug === slug);
  return incident ? incident.label : 'Sự cố khác';
}

export function mapIncidentTypeToCategory(incidentType: string): string {
  const incident = INCIDENT_REGISTRY.find((i) => i.slug === incidentType);
  return incident ? incident.categorySlug : 'sua-chua-dong-co-luu-dong';
}

export function mapIncidentTypesToCategories(incidentTypes: string[]): string[] {
  if (!incidentTypes || incidentTypes.length === 0) return [];
  const categories = incidentTypes.map((type) => mapIncidentTypeToCategory(type));
  return Array.from(new Set(categories));
}
