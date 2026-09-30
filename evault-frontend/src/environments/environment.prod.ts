export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && (window as any).__EVAULT_API_URL__)
    ? (window as any).__EVAULT_API_URL__
    : '/api/v1'
};
