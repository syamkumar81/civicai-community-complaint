// In-memory cache for ultra-fast admin page transitions without loading screens
const cache = {
  analytics: null,
  complaints: null,
  users: null,
  timestamps: {},
};

const DEFAULT_TTL = 3 * 60 * 1000; // 3 minutes fresh cache

export const getCached = (key, maxAge = DEFAULT_TTL) => {
  const data = cache[key];
  const time = cache.timestamps[key];
  if (!data || !time) return null;
  if (Date.now() - time > maxAge) return null;
  return data;
};

export const setCached = (key, data) => {
  cache[key] = data;
  cache.timestamps[key] = Date.now();
};

export const updateCachedComplaint = (complaintId, updates) => {
  if (Array.isArray(cache.complaints)) {
    cache.complaints = cache.complaints.map((c) => {
      const id = c.complaint_id || c.id;
      if (String(id) === String(complaintId)) {
        return { ...c, ...updates };
      }
      return c;
    });
  }
};

export const clearAdminCache = () => {
  cache.analytics = null;
  cache.complaints = null;
  cache.users = null;
  cache.timestamps = {};
};
