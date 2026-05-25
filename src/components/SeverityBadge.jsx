const SeverityBadge = ({ severity }) => {
  const severityConfig = {
    low: {
      label: 'Low',
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-800 dark:text-green-200',
      borderColor: 'border-green-300 dark:border-green-700'
    },
    medium: {
      label: 'Medium',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      borderColor: 'border-yellow-300 dark:border-yellow-700'
    },
    high: {
      label: 'High',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      textColor: 'text-orange-800 dark:text-orange-200',
      borderColor: 'border-orange-300 dark:border-orange-700'
    },
    critical: {
      label: 'Critical',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-800 dark:text-red-200',
      borderColor: 'border-red-300 dark:border-red-700'
    }
  };

  const config = severityConfig[severity?.toLowerCase()] || severityConfig.low;

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${config.bgColor} ${config.textColor} ${config.borderColor}
    `}>
      {config.label}
    </span>
  );
};

export default SeverityBadge;
