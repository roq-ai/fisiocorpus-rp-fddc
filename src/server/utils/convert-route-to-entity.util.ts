const mapping: Record<string, string> = {
  clinics: 'clinic',
  interventions: 'intervention',
  patients: 'patient',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
