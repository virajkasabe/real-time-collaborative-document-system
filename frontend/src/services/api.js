// Central API Client configurations for CollabDocs

const BASE_URL = 'https://api.collabdocs.io/v1';

export const apiClient = {
  get: async (url, options = {}) => {
    console.log(`[API GET] ${BASE_URL}${url}`);
    return { data: {} };
  },
  post: async (url, body = {}, options = {}) => {
    console.log(`[API POST] ${BASE_URL}${url}`, body);
    return { data: {} };
  },
  put: async (url, body = {}, options = {}) => {
    console.log(`[API PUT] ${BASE_URL}${url}`, body);
    return { data: {} };
  },
  delete: async (url, options = {}) => {
    console.log(`[API DELETE] ${BASE_URL}${url}`);
    return { data: {} };
  }
};
