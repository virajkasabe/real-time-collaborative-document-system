import { http } from './http';

export function apiFetchDoc(docId: string) {
  return http.get(`/documents/${encodeURIComponent(docId)}`);
}

export function apiUpdateDoc(docId: string, payload: any) {
  return http.put(`/documents/${encodeURIComponent(docId)}`, payload);
}

export function apiCreateDoc(name: string, category: string, email?: string, fullName?: string) {
  return http.post('/documents', { name, category, email, fullName });
}

export function apiStar(docId: string, starred: boolean) {
  return http.post(`/documents/${encodeURIComponent(docId)}/star`, { starred });
}

export function apiMoveToTrash(docId: string) {
  return http.post(`/documents/${encodeURIComponent(docId)}/trash`);
}

