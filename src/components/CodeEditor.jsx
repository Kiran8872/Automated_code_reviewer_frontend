import Editor from '@monaco-editor/react';
import { useDarkMode } from '../context/DarkModeContext';

const CodeEditor = ({ value, onChange, language }) => {
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
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={languageMap[language] || 'javascript'}
        value={value}
        onChange={onChange}
        theme={darkMode ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16 }
        }}
      />
    </div>
  );
};

export default CodeEditor;
