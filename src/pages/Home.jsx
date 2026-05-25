import { Link } from 'react-router-dom';
import { Code, Sparkles, Bug, Shield, Zap, FileText, History, ArrowRight, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-gray-900 dark:text-white selection:bg-primary-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/10 via-transparent to-transparent dark:from-primary-900/30 dark:via-dark-bg dark:to-dark-bg"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/20 dark:bg-primary-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-300/20 dark:bg-indigo-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '4s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32 z-10 animate-fade-in w-full">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full mb-8 backdrop-blur-md animate-slide-up shadow-sm">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500 dark:text-yellow-300 animate-pulse-glow" />
              <span className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 uppercase">AI-Powered Code Review</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-primary-200 dark:to-purple-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              AI Code Reviewer
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto font-medium animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Get instant, comprehensive code reviews powered by AI. 
              Detect bugs, security issues, and improve code quality in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/review"
                className="btn-primary flex items-center justify-center text-lg shadow-xl"
              >
                Start Reviewing
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
              <button
                onClick={() => {
                  const demoCode = `function add(a, b) {\n  return a + b;\n}`;
                  localStorage.setItem('demo_code', demoCode);
                  localStorage.setItem('demo_language', 'JavaScript');
                  localStorage.setItem('demo_reviewType', 'bug');
                  window.location.href = '/review';
                }}
                className="inline-flex items-center justify-center px-8 py-3 bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-white dark:hover:bg-white/20 transition-all duration-300 backdrop-blur-md shadow-lg dark:hover:shadow-glow-purple"
              >
                Run Demo Review
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to improve your code quality and become a better developer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Bug, title: 'Bug Detection', color: 'primary', desc: 'Automatically identify bugs, logical errors, and potential runtime issues in your code.' },
              { icon: Shield, title: 'Security Analysis', color: 'red', desc: 'Detect security vulnerabilities and get recommendations to secure your applications.' },
              { icon: Zap, title: 'Performance', color: 'yellow', desc: 'Get insights on algorithmic efficiency and recommendations for better performance.' },
              { icon: Code, title: 'Code Quality', color: 'blue', desc: 'Improve readability, maintainability, and follow best practices for clean code.' },
              { icon: FileText, title: 'Export Reports', color: 'green', desc: 'Download detailed review reports in Markdown or PDF format for documentation.' },
              { icon: History, title: 'Review History', color: 'purple', desc: 'Keep track of all your code reviews and access them anytime from history.' },
            ].map((feat, idx) => (
              <div key={idx} className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-500 hover:shadow-xl dark:hover:shadow-glow-primary cursor-default">
                <div className={`w-14 h-14 bg-${feat.color}-100 dark:bg-${feat.color}-900/50 border border-${feat.color}-200 dark:border-${feat.color}-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  <feat.icon className={`w-7 h-7 text-${feat.color}-600 dark:text-${feat.color}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Types Section */}
      <section className="py-24 bg-gray-100/50 dark:bg-black/20 border-y border-gray-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tailored Review Profiles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose the precise lens through which AI evaluates your code
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Beginner Explanation', desc: 'Simple explanations for learning developers', color: 'bg-green-500 shadow-green-500/50' },
              { title: 'Bug Detection', desc: 'Find and fix bugs in your code', color: 'bg-red-500 shadow-red-500/50' },
              { title: 'Code Quality', desc: 'Improve maintainability and readability', color: 'bg-blue-500 shadow-blue-500/50' },
              { title: 'Security Review', desc: 'Identify vulnerabilities and security risks', color: 'bg-orange-500 shadow-orange-500/50' },
              { title: 'Performance Review', desc: 'Optimize for speed and efficiency', color: 'bg-yellow-500 shadow-yellow-500/50' },
              { title: 'Interview Review', desc: 'Prepare for technical interviews', color: 'bg-purple-500 shadow-purple-500/50' },
            ].map((type, idx) => (
              <div
                key={idx}
                className="glass-card p-6 flex items-start space-x-4 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300"
              >
                <div className={`mt-1 w-4 h-4 rounded-full shadow-lg ${type.color}`}></div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{type.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-800 dark:from-primary-900 dark:to-purple-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Write Better Code?
          </h2>
          <p className="text-xl text-primary-100 mb-10 font-medium">
            Join thousands of developers who use AI Code Reviewer to write flawless, secure, and optimized code.
          </p>
          <Link
            to="/review"
            className="inline-flex items-center px-10 py-4 bg-white text-primary-800 font-extrabold text-lg rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20"
          >
            <Star className="w-6 h-6 mr-3 text-yellow-500" />
            Start Your First Review Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-black/40 border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            © 2024 AI Code Reviewer. Built with React & Modern Web AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
