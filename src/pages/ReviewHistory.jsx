import { useHistory } from '../context/HistoryContext';
import { Link } from 'react-router-dom';
import { History, Trash2, Calendar, Clock, Star } from 'lucide-react';
import { useMemo, useState } from 'react';

const ReviewHistory = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewTypeFilter, setReviewTypeFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [minScore, setMinScore] = useState('0');
  const [sortBy, setSortBy] = useState('latest');
  const [compareIds, setCompareIds] = useState([]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100 dark:bg-green-900';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
    if (score >= 4) return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
    return 'text-red-600 bg-red-100 dark:bg-red-900';
  };

  const getReviewTypeLabel = (type) => {
    const labels = {
      beginner: 'Beginner',
      bug: 'Bug Detection',
      quality: 'Code Quality',
      security: 'Security',
      performance: 'Performance',
      interview: 'Interview'
    };
    return labels[type] || type;
  };

  const filteredHistory = useMemo(() => {
    let result = [...history];

    result = result.filter((item) => {
      const matchesQuery = !searchQuery ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originalCode?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = reviewTypeFilter === 'all' || item.reviewType === reviewTypeFilter;
      const matchesLanguage = languageFilter === 'all' || item.language === languageFilter;
      const matchesScore = Number(item.score || 0) >= Number(minScore || 0);

      return matchesQuery && matchesType && matchesLanguage && matchesScore;
    });

    result.sort((a, b) => {
      if (sortBy === 'score') {
        return Number(b.score || 0) - Number(a.score || 0);
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return result;
  }, [history, searchQuery, reviewTypeFilter, languageFilter, minScore, sortBy]);

  const availableLanguages = Array.from(new Set(history.map((item) => item.language))).sort();

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const compareItems = filteredHistory.filter((item) => compareIds.includes(item.id));

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <History className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No Review History
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You haven't performed any code reviews yet. Start reviewing code to build your history.
          </p>
          <Link
            to="/review"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Reviewing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Review History
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {history.length} {history.length === 1 ? 'review' : 'reviews'} in history
          </p>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </button>
      </div>

      <div className="mb-6 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search summary or code"
            className="input-field"
          />

          <select value={reviewTypeFilter} onChange={(e) => setReviewTypeFilter(e.target.value)} className="input-field">
            <option value="all">All Review Types</option>
            <option value="beginner">Beginner</option>
            <option value="bug">Bug Detection</option>
            <option value="quality">Code Quality</option>
            <option value="security">Security</option>
            <option value="performance">Performance</option>
            <option value="interview">Interview</option>
          </select>

          <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="input-field">
            <option value="all">All Languages</option>
            {availableLanguages.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>

          <select value={minScore} onChange={(e) => setMinScore(e.target.value)} className="input-field">
            <option value="0">Min Score: 0</option>
            <option value="4">Min Score: 4</option>
            <option value="6">Min Score: 6</option>
            <option value="8">Min Score: 8</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
            <option value="latest">Sort: Latest</option>
            <option value="score">Sort: Highest Score</option>
          </select>
        </div>
      </div>

      {compareItems.length === 2 && (
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {compareItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">{getReviewTypeLabel(item.reviewType)} · {item.language}</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Score {item.score}/10</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{item.summary}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left Side */}
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-3 mb-3">
                  {/* Score */}
                  <span className={`px-3 py-1 rounded-full font-bold text-sm ${getScoreColor(item.score)}`}>
                    {item.score}/10
                  </span>
                  
                  {/* Language */}
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {item.language}
                  </span>
                  
                  {/* Review Type */}
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    {getReviewTypeLabel(item.reviewType)}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                  {item.summary || 'No summary available'}
                </p>

                {/* Meta Info */}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(item.timestamp)}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {item.bugs?.length || 0} bugs, {item.securityIssues?.length || 0} security issues
                  </div>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleCompare(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    compareIds.includes(item.id)
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {compareIds.includes(item.id) ? 'Selected' : 'Compare'}
                </button>
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete this review"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewHistory;
