/**
 * Smartly formats an avatar path to support absolute URLs (Supabase),
 * local Blob previews, or legacy server-relative paths.
 */
export const getAvatarSrc = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  // If it's an absolute cloud URL or a local preview blob, use it directly
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }
  
  // If it's an empty string, return null to show initials
  if (path.trim() === '') return null;

  // Fallback to backend static server for relative paths
  // We strip '/api' from the backend URL to get the base server path
  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${backendUrl}/${path}`;
};
