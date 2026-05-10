import { useState } from 'react';
import { Editor } from './components/editor/Editor';

function App() {
  const [content, setContent] = useState('# Bienvenido al Editor\n\nEste es un ejemplo de cómo se integra el editor con **herencia de colores**.');

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-white/10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Editor Demo</h1>
          <p className="text-slate-500 dark:text-slate-400">Probando la integración de Vite y la herencia de colores.</p>
        </header>

        <main>
          <Editor 
            content={content} 
            onChange={setContent}
            placeholder="Empieza a escribir..."
          />
        </main>

        <footer className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Markdown Output</h2>
          <pre className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl overflow-auto text-xs text-slate-600 dark:text-slate-400 max-h-48">
            {content}
          </pre>
        </footer>
      </div>
    </div>
  );
}

export default App;
