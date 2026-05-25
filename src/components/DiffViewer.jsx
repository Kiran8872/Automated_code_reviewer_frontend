import { DiffEditor } from '@monaco-editor/react';
import { useDarkMode } from '../context/DarkModeContext';

const DiffViewer = ({ originalCode, improvedCode, language }) => {
  const { darkMode } = useDarkMode();

  const languageMap = {
    'C': 'c',
    'C++': 'cpp',
    'Java': 'java',
    'Python': 'python',
    'JavaScript': 'javascript',
    'TypeScript': 'typescript',
    'HTML': 'html',
    'CSS': 'css',
    'SQL': 'sql'
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex rounded-t-lg overflow-hidden">
        <div className="flex-1 bg-red-600 text-white px-4 py-2 font-medium">
          Original Code
        </div>
        <div className="flex-1 bg-green-600 text-white px-4 py-2 font-medium border-l border-white/20">
          Improved Code
        </div>
      </div>
      <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded-b-lg overflow-hidden">
        <DiffEditor
          height="100%"
          language={languageMap[language] || 'javascript'}
          original={originalCode}
          modified={improvedCode}
          theme={darkMode ? 'vs-dark' : 'light'}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderSideBySide: true,
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
};

export default DiffViewer;
