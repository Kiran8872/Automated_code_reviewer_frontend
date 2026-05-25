import { Code, Zap, Shield, BookOpen, Github, Mail, ExternalLink } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-2xl mb-6">
          <Code className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          About AI Code Reviewer
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A powerful AI-powered code review tool designed to help developers 
          improve code quality, detect bugs, and follow best practices.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Technology Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'React', desc: 'Frontend Framework' },
            { name: 'Vite', desc: 'Build Tool' },
            { name: 'Tailwind CSS', desc: 'Styling' },
            { name: 'Node.js', desc: 'Backend Runtime' },
            { name: 'Express', desc: 'API Framework' },
            { name: 'Monaco Editor', desc: 'Code Editor' },
            { name: 'Gemini AI', desc: 'AI Model' },
            { name: 'Groq', desc: 'AI API' },
          ].map((tech, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="font-bold text-gray-800 dark:text-white">{tech.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Instant Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get comprehensive code analysis in seconds with AI-powered review.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Security First</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Detect security vulnerabilities and follow OWASP security guidelines.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Learn & Improve</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Understand issues with detailed explanations and best practice suggestions.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          How It Works
        </h2>
        <div className="space-y-6">
          {[
            {
              step: '1',
              title: 'Paste or Upload Code',
              desc: 'Simply paste your code into the editor or upload a code file.'
            },
            {
              step: '2',
              title: 'Select Options',
              desc: 'Choose the programming language and review type that fits your needs.'
            },
            {
              step: '3',
              title: 'Get AI Analysis',
              desc: 'Our AI analyzes your code and provides detailed feedback and suggestions.'
            },
            {
              step: '4',
              title: 'Review & Improve',
              desc: 'View the review results, copy improved code, and download reports.'
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Languages */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Supported Languages</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL'].map((lang) => (
            <span key={lang} className="px-4 py-2 bg-white/20 rounded-full font-medium">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* API Keys Info */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-12">
        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-3">
          ⚠️ API Key Configuration Required
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          This application requires an API key to function. You need to configure either:
        </p>
        <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-2">
          <li><strong>Google Gemini API Key</strong> - For Gemini AI powered reviews</li>
          <li><strong>Groq API Key</strong> - For Groq AI powered reviews</li>
        </ul>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-4">
          Create a <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">.env</code> file in the backend directory with your API keys.
        </p>
      </div>

      {/* Contact / GitHub */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Connect With Us
        </h2>
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </a>
          <a
            href="mailto:support@example.com"
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>Contact</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
        <p>© 2024 AI Code Reviewer. Built with ❤️ for developers.</p>
        <p className="text-sm mt-2">
          Perfect for college projects and portfolio showcase.
        </p>
      </div>
    </div>
  );
};

export default About;
