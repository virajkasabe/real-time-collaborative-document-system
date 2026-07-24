import { ENV } from "../src/config/ENV.js";

const PORT = ENV.PORT || 5001;

export const getApiContext = async (playwright) => {
  return await playwright.request.newContext({
    baseURL: ENV.BACKEND_URI || `http://localhost:${PORT}`,
  });
};