const ScoreMeter = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-gray-200 dark:text-gray-700/50"
          />
          {/* Score circle */}
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0px 0px 8px currentColor)' }}
            className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-5xl font-black tracking-tighter ${getScoreColor(score)}`} style={{ filter: 'drop-shadow(0px 0px 10px currentColor)' }}>
            {score}
          </span>
        </div>
      </div>
      <p className="mt-6 text-lg font-bold text-gray-800 dark:text-gray-100 tracking-wide uppercase">
        Code Score
      </p>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
        out of 10
      </p>
    </div>
  );
};

export default ScoreMeter;
