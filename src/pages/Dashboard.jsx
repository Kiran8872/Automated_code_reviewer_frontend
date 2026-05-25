import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../lib/api';
import { Activity, CheckCircle2, AlertTriangle, BarChart3, RefreshCw } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, tone }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`rounded-xl p-2 ${tone}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/analytics?days=14');
      setData(response.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const trendMax = useMemo(() => {
    const values = data?.scoreTrend?.map((item) => item.avgScore) || [];
    return Math.max(...values, 10);
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quality Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Executive view of review quality, risk, and gate outcomes.</p>
        </div>
        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Reviews (14d)"
          value={data?.summary?.totalReviews ?? '-'}
          icon={BarChart3}
          tone="bg-blue-600"
        />
        <StatCard
          title="Average Score"
          value={data?.summary?.averageScore ?? '-'}
          icon={Activity}
          tone="bg-indigo-600"
        />
        <StatCard
          title="Gate Pass Rate"
          value={data?.summary?.gatePassRate != null ? `${data.summary.gatePassRate}%` : '-'}
          icon={CheckCircle2}
          tone="bg-green-600"
        />
        <StatCard
          title="Critical Issues"
          value={data?.summary?.criticalIssues ?? '-'}
          icon={AlertTriangle}
          tone="bg-red-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Average Score Trend</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last 14 days</p>

          <div className="mt-6 flex min-h-48 items-end gap-2">
            {(data?.scoreTrend || []).length > 0 ? (
              data.scoreTrend.map((point) => (
                <div key={point.date} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-primary-500"
                    style={{ height: `${Math.max((point.avgScore / trendMax) * 180, 8)}px` }}
                    title={`${point.date}: ${point.avgScore}`}
                  />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{point.date.slice(5)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No trend data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Review Type Mix</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Distribution by review intent</p>
          <div className="mt-4 space-y-3">
            {(data?.reviewTypeDistribution || []).length > 0 ? (
              data.reviewTypeDistribution.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{item.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.min((item.value / Math.max(data.summary?.totalReviews || 1, 1)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No distribution data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
