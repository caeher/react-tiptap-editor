import { useState } from 'react';
import { FileEdit } from 'lucide-react';
import { Editor } from './components/editor';
import './App.css';

const INITIAL_EDITOR_MARKDOWN = `# Editor Independiente

Esta es una instancia aislada del editor Notion-style.

## Características:
- **Slash commands** (\`/\`)
- **Bubble menu** (selecciona texto)
- **Toolbar** fijo
- **Markdown** completo

\`\`\`ts
console.log("Editor separado exitosamente");
\`\`\`
`;

function App() {
  const [markdown, setMarkdown] = useState(INITIAL_EDITOR_MARKDOWN);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <FileEdit size={24} className="text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Rich Text Editor Workspace
            </h1>
          </div>
          <p className="text-slate-400">
            Entorno de edición independiente potenciado por TipTap y Shiki.
          </p>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur">
          <Editor
            content={markdown}
            onChange={setMarkdown}
            placeholder="Comienza a escribir o pulsa / para comandos..."
          />
        </section>
        
        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Markdown Output</h2>
          <pre className="text-xs text-slate-400 overflow-auto max-h-40 p-2 bg-black/20 rounded">
            {markdown}
          </pre>
        </div>
      </div>
    </main>
  );
}

export default App;
