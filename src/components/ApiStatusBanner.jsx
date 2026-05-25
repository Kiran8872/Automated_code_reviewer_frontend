import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

const ApiStatusBanner = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await apiClient.get('/health');
        if (!mounted) return;
        setStatus(res.data?.services || null);
      } catch (e) {
        if (!mounted) return;
        // if health endpoint unavailable, treat as unknown
        setStatus(null);
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, []);

  // No status info available -> don't show anything
  if (status === null) return null;

  const gemini = !!status.gemini;
  const groq = !!status.groq;

  if (gemini || groq) return null;

  return (
    <div className="w-full bg-yellow-50 border-b border-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 px-4 py-2 text-sm">
      AI provider keys are not configured. Reviews will use a local fallback mock. To enable real AI reviews, add your provider API keys to backend/.env (GEMINI_API_KEY or GROQ_API_KEY) and restart the server.
    </div>
  );
};

export default ApiStatusBanner;
