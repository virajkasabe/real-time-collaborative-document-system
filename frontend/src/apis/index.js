import axios from 'axios'

export const apiClient = axios.create({
    baseURL : import.meta.env.VITE_SERVER_URI || "http://localhost:5000/api/v1/rtcds",
    withCredentials : true,
    timeout : 30000,
    headers :{ 
        "Content-Type" : "application/json"
    }
})

export const requestHandler = async (api, setLoading, onSuccess, onError) => {
  let isMounted = true;

  try {
    setLoading?.(true);

    const response = await api();
    const data = response?.data?.data ?? response?.data ?? response ?? null;

    if (!data) throw new Error("No data received from API");

    onSuccess?.(data);
    
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
    onError?.(error?.response?.data || { message: errorMessage });
    console.error("API error:", errorMessage);

    // if ([400, 401, 403].includes(error?.response?.status)) {
      // Optional: handle forced logout
      // LocalStorage.clear();
      // window.location.href = "/login";
    // }
  } finally {
    if (isMounted) setLoading?.(false);
  }
};

export const isBrowser = typeof window !== "undefined";
export class LocalStorage {
  static get(key) {
    if (!isBrowser) return null;
    try {
      const value = localStorage.getItem(key);
      if (!value || value === "undefined" || value === "null") return null;
      return JSON.parse(value);
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  }

  static set(key, value) {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set "${key}" in localStorage:`, error);
    }
  }

  static remove(key) {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove "${key}" in localStorage:`, error);
    }
  }

  static clear() {
    if (!isBrowser) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error("localStorage.clear() failed:", error);
    }
  }
}
