// Core Helper utilities for CollabDocs

// Formats bytes into human readable storage sizes
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Generates a mock UUID-like key
export const generateId = () => {
  return 'doc-' + Math.random().toString(36).substr(2, 9);
};

// Validates standard emails
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Returns date time relative descriptions
export const formatRelativeTime = (timeString) => {
  if (!timeString) return 'recently';
  return timeString; // Return standard format for simulated database dates
};
