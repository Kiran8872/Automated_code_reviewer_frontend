import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../lib/api';
import CodeEditor from '../components/CodeEditor';
import ReviewResult from '../components/ReviewResult';
import DiffViewer from '../components/DiffViewer';
import { useHistory } from '../context/HistoryContext';
import { useDarkMode } from '../context/DarkModeContext';
import { Upload, Sparkles, Trash2, FileCode, AlertCircle, Loader } from 'lucide-react';

const CodeReviewer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [reviewType, setReviewType] = useState('quality');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [review, setReview] = useState(null);
  const [activeTab, setActiveTab] = useState('original');
  const { addToHistory } = useHistory();
  const { darkMode } = useDarkMode();
  const reviewRef = useRef(null);

  // Listen for improved code apply events from ReviewResult
  useEffect(() => {
    const handler = (e) => {
      const newCode = e?.detail;
      if (typeof newCode === 'string') {
        setCode(newCode);
        // focus the editor textbox if possible
        setTimeout(() => {
          const textbox = document.querySelector('[role="textbox"]');
          if (textbox && typeof textbox.focus === 'function') textbox.focus();
        }, 50);
      }
    };

    const handleIndividualFix = (e) => {
      const { originalSnippet, fixedSnippet } = e?.detail || {};
      if (typeof originalSnippet === 'string' && typeof fixedSnippet === 'string') {
        setCode((prevCode) => {
          if (prevCode.includes(originalSnippet)) {
            return prevCode.replace(originalSnippet, fixedSnippet);
          } else {
            // Fallback: try removing leading/trailing whitespace from snippets
            const trimmedOriginal = originalSnippet.trim();
            if (trimmedOriginal && prevCode.includes(trimmedOriginal)) {
               return prevCode.replace(trimmedOriginal, fixedSnippet.trim());
            }
            alert('Could not find the exact snippet in the editor. You may have to apply it manually.');
            return prevCode;
          }
        });
        setTimeout(() => {
          const textbox = document.querySelector('[role="textbox"]');
          if (textbox && typeof textbox.focus === 'function') textbox.focus();
        }, 50);
      }
    };

    window.addEventListener('applyImprovedCode', handler);
    window.addEventListener('applyIndividualFix', handleIndividualFix);
    return () => {
      window.removeEventListener('applyImprovedCode', handler);
      window.removeEventListener('applyIndividualFix', handleIndividualFix);
    };
  }, []);

  const languages = [
    { value: 'C', label: 'C' },
    { value: 'C++', label: 'C++' },
    { value: 'Java', label: 'Java' },
    { value: 'Python', label: 'Python' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'SQL', label: 'SQL' },
  ];

  const reviewTypes = [
    { value: 'beginner', label: 'Beginner Explanation', desc: 'Simple explanations for learning developers' },
    { value: 'bug', label: 'Bug Detection', desc: 'Find and fix bugs in your code' },
    { value: 'quality', label: 'Code Quality', desc: 'Improve maintainability and readability' },
    { value: 'security', label: 'Security Review', desc: 'Identify vulnerabilities and security risks' },
    { value: 'performance', label: 'Performance Review', desc: 'Optimize for speed and efficiency' },
    { value: 'interview', label: 'Interview Review', desc: 'Prepare for technical interviews' },
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.post('/upload-code', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCode(response.data.content);
      setLanguage(response.data.language);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async ({ reviewCode, reviewLanguage, reviewTypeValue }) => {
    if (!reviewCode.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/review-code', {
        code: reviewCode,
        language: reviewLanguage,
        reviewType: reviewTypeValue,
      });

      const reviewData = {
        ...response.data,
        reviewType: reviewTypeValue,
        originalCode: reviewCode,
        language: reviewLanguage,
      };

      setReview(reviewData);
      addToHistory(reviewData);
    } catch (err) {
      // Handle rate limit specifically
      if (err?.response?.status === 429) {
        setError('Rate limit exceeded. Please wait a minute before retrying.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.details || 'Failed to process code review. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async () => {
    await submitReview({
      reviewCode: code,
      reviewLanguage: language,
      reviewTypeValue: reviewType,
    });
  };

  const handleClear = () => {
    setCode('');
    setError('');
    setActiveTab('original');
  };

  const handleBack = () => {
    setReview(null);
    setError('');
    setActiveTab('original');
  };

  // Auto-run demo review if demo payload present in localStorage
  useEffect(() => {
    // no advanced config load here; keep UI focused and simple for users
  }, []);

  useEffect(() => {
    const demoCode = localStorage.getItem('demo_code');
    const demoLanguage = localStorage.getItem('demo_language');
    const demoReviewType = localStorage.getItem('demo_reviewType');

    if (demoCode && !code) {
      const resolvedLanguage = demoLanguage || language;
      const resolvedReviewType = demoReviewType || reviewType;

      setCode(demoCode);
      if (demoLanguage) {
        setLanguage(demoLanguage);
      }
      if (demoReviewType) {
        setReviewType(demoReviewType);
      }

      // remove demo keys and trigger review
      localStorage.removeItem('demo_code');
      localStorage.removeItem('demo_language');
      localStorage.removeItem('demo_reviewType');

      // small timeout to allow UI to paint before auto-submitting
      setTimeout(() => {
        submitReview({
          reviewCode: demoCode,
          reviewLanguage: resolvedLanguage,
          reviewTypeValue: resolvedReviewType,
        });
      }, 250);
    }
  }, []);

  // Scroll review panel into view when a review is set
  // (helps users who scrolled down to the editor see the results immediately)
  useEffect(() => {
    try {
      if (review && reviewRef?.current) {
        reviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch (e) {
      // ignore
    }
  }, [review]);

  // Render page with responsive two-column layout. Review results appear on the right on wide screens.

  return (
    <div className="relative min-h-screen">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600/20 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
      {/* Full-page loading overlay when analyzing */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3 shadow-lg">
            <Loader className="w-6 h-6 animate-spin text-primary-600" />
            <div>
              <div className="font-semibold">Analyzing code</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">This can take a few moments depending on provider response time.</div>
            </div>
          </div>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          AI Code Reviewer
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Paste your code or upload a file to get AI-powered code review
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 mb-8 transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          {/* Language Selection */}
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Programming Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white transition-shadow"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Review Type Selection */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
              <span>Review Type</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                {reviewTypes.find(t => t.value === reviewType)?.desc}
              </span>
            </label>
            <select
              value={reviewType}
              onChange={(e) => setReviewType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white transition-shadow"
            >
              {reviewTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions (upload / clear / review) */}
          <div className="w-full md:flex-1 flex flex-wrap items-center justify-end gap-3 mt-2 md:mt-0">
            <label aria-label="Upload code file" className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">
              <Upload className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Upload</span>
              <input
                aria-hidden="true"
                type="file"
                accept=".c,.cpp,.h,.java,.py,.js,.jsx,.ts,.tsx,.html,.css,.sql,.json,.xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleClear}
              aria-label="Clear editor"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Clear</span>
            </button>
            <button
              onClick={handleReview}
              disabled={isLoading || !code.trim()}
              className="flex items-center px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Review Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Code Editor (Half Width) */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden mb-6 transition-all hover:shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
        <div className="flex items-end justify-between px-2 pt-2 bg-gray-100/50 dark:bg-gray-700/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-600">
          {review ? (
            <div className="flex space-x-1">
              <button 
                onClick={() => setActiveTab('original')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'original' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-t border-l border-r border-gray-200 dark:border-gray-600' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'}`}
              >
                Original Code
              </button>
              <button 
                onClick={() => setActiveTab('improved')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'improved' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-t border-l border-r border-gray-200 dark:border-gray-600' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'}`}
              >
                Improved Code
              </button>
              <button 
                onClick={() => setActiveTab('diff')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'diff' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-t border-l border-r border-gray-200 dark:border-gray-600' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'}`}
              >
                Diff View
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-2 py-1 pb-2">
              <FileCode className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Code Editor
              </span>
            </div>
          )}
          
          <span className="text-sm text-gray-500 dark:text-gray-400 pr-2 pb-2">
            {activeTab === 'improved' ? (review?.improvedCode?.length || code.length) : code.length} characters
          </span>
        </div>
        <div className="relative w-full h-[600px]">
          {activeTab === 'original' && (
            <CodeEditor
              value={code}
              onChange={(value) => setCode(value || '')}
              language={language}
            />
          )}
          {activeTab === 'improved' && review && (
            <CodeEditor
              value={review.improvedCode || code}
              onChange={() => {}} // read-only view
              language={language}
            />
          )}
          {activeTab === 'diff' && review && (
            <DiffViewer 
              originalCode={code} 
              improvedCode={review.improvedCode || code} 
              language={language}
            />
          )}

          {/* Placeholder overlay when editor is empty */}
          {!code && activeTab === 'original' && (
            <div className="absolute inset-0 pointer-events-none flex items-start p-6">
              <div className="text-gray-400 dark:text-gray-500 italic">Paste code here or use Upload to load a file.</div>
            </div>
          )}
        </div>
          </div>

          {/* Sample Code Hint */}
          {!code && (
            <div className="mt-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                💡 Tip: You can paste code directly or upload a file (max 5MB)
              </p>
            </div>
          )}
        </div>

        {/* Right: Tall review panel */}
        <div className="flex-1">
          <div className="sticky top-20">
            <div ref={reviewRef} className="max-h-[calc(100vh-6rem)] overflow-auto">
              {review ? (
                <div className="min-h-[70vh]">
                  <ReviewResult
                    review={review}
                    originalCode={code}
                    language={language}
                    onBack={handleBack}
                  />
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 min-h-[70vh] flex flex-col items-center justify-center text-center transition-all hover:shadow-2xl">
                  <Sparkles className="w-16 h-16 text-primary-500/50 mb-6 animate-pulse" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">Awaiting Code</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">Submit your code for review, and the AI will analyze it and display the results here in stunning detail.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CodeReviewer;
