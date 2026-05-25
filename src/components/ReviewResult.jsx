import { useState } from 'react';
import ScoreMeter from './ScoreMeter';
import SeverityBadge from './SeverityBadge';
import { downloadMarkdownReport, downloadPdfReport, copyToClipboard } from '../utils/reportGenerator';
import { 
  Bug, Shield, Zap, Code2, CheckCircle, 
  Copy, Download, FileText, Clock, HardDrive,
  FlaskConical, AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';

const ReviewResult = ({ review, originalCode, language, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({
    bugs: true,
    security: true,
    performance: true,
    quality: true,
    practices: true,
    tests: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(review.improvedCode || '');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (typeof review.improvedCode === 'string' && review.improvedCode.length) {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        // emit a custom event so parent can pick it up if needed
        window.dispatchEvent(new CustomEvent('applyImprovedCode', { detail: review.improvedCode }));
      }
    }
  };

  const handleApplyIndividualFix = (originalSnippet, fixedSnippet, issueId) => {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('applyIndividualFix', { 
        detail: { originalSnippet, fixedSnippet } 
      }));
      setAppliedFixes(prev => new Set(prev).add(issueId));
    }
  };

  const handleDownloadMd = () => {
    downloadMarkdownReport(review, originalCode, language);
  };

  const handleDownloadPdf = () => {
    downloadPdfReport(review, originalCode, language);
  };

  const SectionCard = ({ title, icon: Icon, color, count, sectionKey, children }) => (
    <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
      <button
        onClick={() => toggleSection(sectionKey)}
        aria-expanded={expandedSections[sectionKey]}
        className="w-full flex items-center justify-between p-5 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
          <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
            {count}
          </span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="p-6 border-t border-gray-200 dark:border-white/10">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Expand/Collapse All controls */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setExpandedSections(Object.keys(expandedSections).reduce((acc, k) => ({ ...acc, [k]: true }), {}))}
          className="text-sm text-primary-600 hover:underline"
        >
          Expand All
        </button>
        <button
          onClick={() => setExpandedSections(Object.keys(expandedSections).reduce((acc, k) => ({ ...acc, [k]: false }), {}))}
          className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
        >
          Collapse All
        </button>
      </div>
      {/* Header with Score and Actions */}
      <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-8 mb-6 transition-all hover:shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Score and Overview */}
          <div className="flex-1">
            <ScoreMeter score={review.score} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4">
              {review.summary || 'Code Review Complete'}
            </h2>
          </div>

          {/* Complexity and Risk */}
          <div className="flex flex-col space-y-4">
            {/* Complexity */}
            <div className="flex flex-wrap gap-4">
              {review.timeComplexity && (
                <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{review.timeComplexity}</p>
                  </div>
                </div>
              )}
              {review.spaceComplexity && (
                <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] px-4 py-2 rounded-xl backdrop-blur-sm">
                  <HardDrive className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Space</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{review.spaceComplexity}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Risk */}
            {review.securityRiskLevel && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-sm border shadow-[0_0_15px_rgba(0,0,0,0.1)] ${
                review.securityRiskLevel === 'critical' || review.securityRiskLevel === 'high' 
                  ? 'bg-red-500/10 border-red-500/20 shadow-red-500/10' 
                  : review.securityRiskLevel === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/10'
                  : 'bg-green-500/10 border-green-500/20 shadow-green-500/10'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  review.securityRiskLevel === 'critical' || review.securityRiskLevel === 'high' 
                    ? 'text-red-600' 
                    : review.securityRiskLevel === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Security Risk</p>
                  <p className="font-semibold text-gray-800 dark:text-white capitalize">{review.securityRiskLevel}</p>
                </div>
              </div>
            )}

            {review.qualityGate && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-sm border shadow-[0_0_15px_rgba(0,0,0,0.1)] ${
                review.qualityGate.passed
                  ? 'bg-green-500/10 border-green-500/20 shadow-green-500/10'
                  : 'bg-red-500/10 border-red-500/20 shadow-red-500/10'
              }`}>
                <CheckCircle className={`w-5 h-5 ${
                  review.qualityGate.passed ? 'text-green-600' : 'text-red-600'
                }`} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quality Gate</p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {review.qualityGate.name}: {review.qualityGate.passed ? 'Passed' : 'Failed'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-white/10" role="toolbar" aria-label="Review actions">
          <button
            onClick={handleCopy}
            aria-label="Copy improved code"
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-primary-500/50 hover:-translate-y-0.5"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy Improved Code'}</span>
          </button>
          <button
            onClick={handleApply}
            aria-label="Apply improved code to editor"
            disabled={!review.improvedCode}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            <Copy className="w-4 h-4" />
            <span>Apply Improved Code</span>
          </button>
          <button
            onClick={handleDownloadMd}
            className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-600/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download MD</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-600/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={onBack}
            aria-label="Back to editor"
            className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-600/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md ml-auto"
          >
            ← Back to Editor
          </button>
        </div>
      </div>

      

      {/* Issues Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bugs */}
        <SectionCard
          title="Bugs Found"
          icon={Bug}
          color="bg-red-600"
          count={review.bugs?.length || 0}
          sectionKey="bugs"
        >
          {review.bugs && review.bugs.length > 0 ? (
            <div className="space-y-4">
              {review.bugs.map((bug, idx) => (
                <div key={idx} className="p-5 bg-red-500/5 backdrop-blur-md rounded-xl border border-red-500/20 shadow-[0_4px_12px_rgba(239,68,68,0.05)] transition-all hover:shadow-[0_4px_16px_rgba(239,68,68,0.1)]">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Line {bug.line || 'N/A'}</span>
                    <SeverityBadge severity={bug.severity} />
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mb-2">{bug.issue}</p>
                  {bug.fix && (
                    <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">Fix:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{bug.fix}</p>
                    </div>
                  )}
                  {bug.originalSnippet && bug.fixedSnippet && (
                    <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 mt-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">Suggested Fix</span>
                        <button
                          onClick={() => handleApplyIndividualFix(bug.originalSnippet, bug.fixedSnippet, `bug-${idx}`)}
                          disabled={appliedFixes.has(`bug-${idx}`)}
                          className={`text-xs px-4 py-1.5 font-medium rounded-md transition-all flex items-center shadow-md ${appliedFixes.has(`bug-${idx}`) ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary-600 hover:bg-primary-500 text-white hover:shadow-primary-500/50'}`}
                        >
                          <Code2 className="w-3 h-3 mr-1.5" />
                          {appliedFixes.has(`bug-${idx}`) ? 'Fix Applied' : 'Apply Fix'}
                        </button>
                      </div>
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden font-mono text-[13px] leading-relaxed shadow-sm">
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-4 py-2 border-l-4 border-red-500 whitespace-pre overflow-x-auto relative group">
                          <div className="absolute left-2 top-2 select-none opacity-50">-</div>
                          <div className="pl-4">{bug.originalSnippet}</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 border-l-4 border-green-500 whitespace-pre overflow-x-auto relative border-t border-gray-100 dark:border-gray-800 group">
                          <div className="absolute left-2 top-2 select-none opacity-50">+</div>
                          <div className="pl-4">{bug.fixedSnippet}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span>No bugs found! Great job!</span>
            </div>
          )}
        </SectionCard>

        {/* Security Issues */}
        <SectionCard
          title="Security Issues"
          icon={Shield}
          color="bg-orange-600"
          count={review.securityIssues?.length || 0}
          sectionKey="security"
        >
          {review.securityIssues && review.securityIssues.length > 0 ? (
            <div className="space-y-4">
              {review.securityIssues.map((issue, idx) => (
                <div key={idx} className="p-5 bg-orange-500/5 backdrop-blur-md rounded-xl border border-orange-500/20 shadow-[0_4px_12px_rgba(249,115,22,0.05)] transition-all hover:shadow-[0_4px_16px_rgba(249,115,22,0.1)]">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Line {issue.line || 'N/A'}</span>
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mb-2">{issue.issue}</p>
                  {issue.recommendation && (
                    <div className="mt-2 pt-2 border-t border-orange-200 dark:border-orange-800">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Recommendation:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{issue.recommendation}</p>
                    </div>
                  )}
                  {issue.originalSnippet && issue.fixedSnippet && (
                    <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 mt-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">Suggested Fix</span>
                        <button
                          onClick={() => handleApplyIndividualFix(issue.originalSnippet, issue.fixedSnippet, `sec-${idx}`)}
                          disabled={appliedFixes.has(`sec-${idx}`)}
                          className={`text-xs px-4 py-1.5 font-medium rounded-md transition-all flex items-center shadow-md ${appliedFixes.has(`sec-${idx}`) ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary-600 hover:bg-primary-500 text-white hover:shadow-primary-500/50'}`}
                        >
                          <Code2 className="w-3 h-3 mr-1.5" />
                          {appliedFixes.has(`sec-${idx}`) ? 'Fix Applied' : 'Apply Fix'}
                        </button>
                      </div>
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden font-mono text-[13px] leading-relaxed shadow-sm">
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-4 py-2 border-l-4 border-red-500 whitespace-pre overflow-x-auto relative group">
                          <div className="absolute left-2 top-2 select-none opacity-50">-</div>
                          <div className="pl-4">{issue.originalSnippet}</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 border-l-4 border-green-500 whitespace-pre overflow-x-auto relative border-t border-gray-100 dark:border-gray-800 group">
                          <div className="absolute left-2 top-2 select-none opacity-50">+</div>
                          <div className="pl-4">{issue.fixedSnippet}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span>No security issues! Excellent!</span>
            </div>
          )}
        </SectionCard>

        {/* Performance Issues */}
        <SectionCard
          title="Performance Issues"
          icon={Zap}
          color="bg-yellow-600"
          count={review.performanceIssues?.length || 0}
          sectionKey="performance"
        >
          {review.performanceIssues && review.performanceIssues.length > 0 ? (
            <div className="space-y-4">
              {review.performanceIssues.map((issue, idx) => (
                <div key={idx} className="p-5 bg-yellow-500/5 backdrop-blur-md rounded-xl border border-yellow-500/20 shadow-[0_4px_12px_rgba(234,179,8,0.05)] transition-all hover:shadow-[0_4px_16px_rgba(234,179,8,0.1)]">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Line {issue.line || 'N/A'}</span>
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mb-2">{issue.issue}</p>
                  {issue.suggestion && (
                    <div className="mt-2 pt-2 border-t border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Suggestion:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{issue.suggestion}</p>
                    </div>
                  )}
                  {issue.originalSnippet && issue.fixedSnippet && (
                    <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 mt-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">Suggested Fix</span>
                        <button
                          onClick={() => handleApplyIndividualFix(issue.originalSnippet, issue.fixedSnippet, `perf-${idx}`)}
                          disabled={appliedFixes.has(`perf-${idx}`)}
                          className={`text-xs px-4 py-1.5 font-medium rounded-md transition-all flex items-center shadow-md ${appliedFixes.has(`perf-${idx}`) ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary-600 hover:bg-primary-500 text-white hover:shadow-primary-500/50'}`}
                        >
                          <Code2 className="w-3 h-3 mr-1.5" />
                          {appliedFixes.has(`perf-${idx}`) ? 'Fix Applied' : 'Apply Fix'}
                        </button>
                      </div>
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden font-mono text-[13px] leading-relaxed shadow-sm">
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-4 py-2 border-l-4 border-red-500 whitespace-pre overflow-x-auto relative group">
                          <div className="absolute left-2 top-2 select-none opacity-50">-</div>
                          <div className="pl-4">{issue.originalSnippet}</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 border-l-4 border-green-500 whitespace-pre overflow-x-auto relative border-t border-gray-100 dark:border-gray-800 group">
                          <div className="absolute left-2 top-2 select-none opacity-50">+</div>
                          <div className="pl-4">{issue.fixedSnippet}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span>No performance issues! Well optimized!</span>
            </div>
          )}
        </SectionCard>

        {/* Code Quality Issues */}
        <SectionCard
          title="Code Quality Issues"
          icon={Code2}
          color="bg-blue-600"
          count={review.codeQualityIssues?.length || 0}
          sectionKey="quality"
        >
          {review.codeQualityIssues && review.codeQualityIssues.length > 0 ? (
            <div className="space-y-4">
              {review.codeQualityIssues.map((issue, idx) => (
                <div key={idx} className="p-5 bg-blue-500/5 backdrop-blur-md rounded-xl border border-blue-500/20 shadow-[0_4px_12px_rgba(59,130,246,0.05)] transition-all hover:shadow-[0_4px_16px_rgba(59,130,246,0.1)]">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Line {issue.line || 'N/A'}</span>
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mb-2">{issue.issue}</p>
                  {issue.suggestion && (
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-teal-700 dark:text-teal-400">Suggestion:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{issue.suggestion}</p>
                    </div>
                  )}
                  {issue.originalSnippet && issue.fixedSnippet && (
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 mt-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">Suggested Fix</span>
                        <button
                          onClick={() => handleApplyIndividualFix(issue.originalSnippet, issue.fixedSnippet, `prac-${idx}`)}
                          disabled={appliedFixes.has(`prac-${idx}`)}
                          className={`text-xs px-4 py-1.5 font-medium rounded-md transition-all flex items-center shadow-md ${appliedFixes.has(`prac-${idx}`) ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary-600 hover:bg-primary-500 text-white hover:shadow-primary-500/50'}`}
                        >
                          <Code2 className="w-3 h-3 mr-1.5" />
                          {appliedFixes.has(`prac-${idx}`) ? 'Fix Applied' : 'Apply Fix'}
                        </button>
                      </div>
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden font-mono text-[13px] leading-relaxed shadow-sm">
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-4 py-2 border-l-4 border-red-500 whitespace-pre overflow-x-auto relative group">
                          <div className="absolute left-2 top-2 select-none opacity-50">-</div>
                          <div className="pl-4">{issue.originalSnippet}</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 border-l-4 border-green-500 whitespace-pre overflow-x-auto relative border-t border-gray-100 dark:border-gray-800 group">
                          <div className="absolute left-2 top-2 select-none opacity-50">+</div>
                          <div className="pl-4">{issue.fixedSnippet}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span>Excellent code quality!</span>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Best Practices */}
      <SectionCard
        title="Best Practices"
        icon={CheckCircle}
        color="bg-green-600"
        count={review.bestPractices?.length || 0}
        sectionKey="practices"
      >
        {review.bestPractices && review.bestPractices.length > 0 ? (
          <ul className="space-y-3">
            {review.bestPractices.map((practice, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{practice}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No specific recommendations.</p>
        )}
      </SectionCard>

      {/* Test Cases */}
      <SectionCard
        title="AI-Generated Test Cases"
        icon={FlaskConical}
        color="bg-purple-600"
        count={review.testCases?.length || 0}
        sectionKey="tests"
      >
        {review.testCases && review.testCases.length > 0 ? (
          <div className="space-y-4">
            {review.testCases.map((test, idx) => (
              <div key={idx} className="p-5 bg-purple-500/5 backdrop-blur-md rounded-xl border border-purple-500/20 shadow-[0_4px_12px_rgba(168,85,247,0.05)] transition-all hover:shadow-[0_4px_16px_rgba(168,85,247,0.1)]">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Test Case {idx + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Input:</p>
                    <p className="text-gray-800 dark:text-gray-200 font-mono">{test.input}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Expected Output:</p>
                    <p className="text-gray-800 dark:text-gray-200 font-mono">{test.expectedOutput}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 dark:text-gray-400">Description:</p>
                    <p className="text-gray-800 dark:text-gray-200">{test.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No test cases generated.</p>
        )}
      </SectionCard>

      {/* Explanation */}
      {review.explanation && (
        <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl mt-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Code2 className="w-5 h-5 mr-2" />
            Explanation of Changes
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{review.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewResult;
