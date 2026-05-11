const requireEnv = (key: 'VITE_SUPABASE_PROJECT_ID' | 'VITE_SUPABASE_ANON_KEY') => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const projectId = requireEnv('VITE_SUPABASE_PROJECT_ID');
export const publicAnonKey = requireEnv('VITE_SUPABASE_ANON_KEY');
