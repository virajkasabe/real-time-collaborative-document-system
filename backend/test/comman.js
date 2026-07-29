import { ENV } from "../src/config/ENV.js";

const PORT = ENV.PORT || 5003;

export const getApiContext = async (playwright) => {
  return await playwright.request.newContext({
    baseURL: ENV.BACKEND_URI || `http://localhost:${PORT}`,
  });
};

export const backendUrl = '/api/v1/rtcds'