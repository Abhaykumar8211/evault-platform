export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const win = window as any;
    if (win.__EVAULT_API_URL__) {
      return win.__EVAULT_API_URL__.replace(/\/+$/, '');
    }
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8080/api/v1';
    }
    // Production cloud default
    return `${window.location.origin}/api/v1`;
  }
  return 'http://localhost:8080/api/v1';
}
