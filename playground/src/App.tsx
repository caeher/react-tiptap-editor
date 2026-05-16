import { useState, useEffect } from 'react'
import { Editor } from '@caeher/react-tiptap-editor'
import '@caeher/react-tiptap-editor/dist/index.css'
import { Sun, Moon } from 'lucide-react'

function App() {
  const [content, setContent] = useState('# Welcome to the Playground\n\nThis is a demonstration of the `@caeher/react-tiptap-editor` library with **Dark Mode** support.\n\n### Features:\n- 🎨 Custom CSS Variables\n- 🌙 Native Dark Mode\n- 📝 Markdown Support\n- 🖼️ Image Uploads & URLs\n- 🛠️ Extensive Toolbar\n\nTry toggling the theme using the button in the top right corner!')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Tiptap Editor
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Interactive Playground
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Experiment with the editor components and see how they integrate with your application's theme.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-1">
              <Editor 
                content={content} 
                onChange={setContent}
                placeholder="Start writing something amazing..."
                className="min-h-[500px]"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Markdown Output
              </h3>
              <div className="relative">
                <pre className="text-xs font-mono p-4 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-auto max-h-[400px] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-900">
                  {content}
                </pre>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-cyan-500/20">
              <h3 className="font-bold mb-2">Quick Tip</h3>
              <p className="text-cyan-50 text-sm leading-relaxed">
                The editor uses CSS variables for all its colors. You can easily override them in your global CSS to match your brand.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Built with React, Tiptap, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
