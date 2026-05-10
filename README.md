# @caeher/react-tiptap-editor

A feature-rich, Tailwind CSS-styled React rich text editor built on top of Tiptap.

## Features
- Fully customizable and configurable
- Built-in Tailwind CSS styling (supports v4.x)
- Markdown output out of the box
- Built-in toolbar, bubble menu, slash commands, and code block formatting

## Installation

Install the package and its peer dependencies:

```bash
npm install @caeher/react-tiptap-editor @tiptap/core @tiptap/react @tiptap/starter-kit @tiptap/pm
```

> [!NOTE]
> This library has **zero runtime dependencies** other than its peer dependencies, which significantly reduces the risk of version conflicts in complex projects like Next.js.

### Peer Dependencies

Ensure you have the following installed in your project:
- `react` (v18 or v19)
- `react-dom` (v18 or v19)
- `@tiptap/core`
- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/pm`

If you encounter `ERESOLVE` warnings during installation, you can use the `--legacy-peer-deps` flag.

### Tailwind Typography

This editor uses Tailwind CSS `prose` classes for styling. To ensure these styles are generated, you must have the `@tailwindcss/typography` plugin installed and configured in your project:

```bash
npm install -D @tailwindcss/typography
```

## Configuring Tailwind CSS 4.x

To ensure the editor styles are properly applied in your project, you need to include the library's CSS. In Tailwind CSS v4, you can import the stylesheet directly into your global CSS file.

Add the following to your global `index.css` (or `app.css`):

```css
@import "tailwindcss";
@import "@caeher/react-tiptap-editor/dist/index.css";

/* Your custom styles */
```

Or, if your project uses a `tailwind.config.js` or `tailwind.config.ts` (if you maintain a v4 config file structure or use the Vite plugin), make sure to include the paths to the library components so Tailwind can scan them:

```ts
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add the library to your content paths
    "./node_modules/@caeher/react-tiptap-editor/dist/**/*.{js,ts,jsx,tsx}"
  ],
  // ...
}
```

## Basic Usage

Here is a quick example of how to use the `Editor` component in your React application:

```tsx
import { useState } from 'react';
import { Editor } from '@caeher/react-tiptap-editor';
import '@caeher/react-tiptap-editor/dist/index.css'; // You can also import the CSS directly in your entry file

function App() {
  // Note: the editor outputs markdown by default
  const [content, setContent] = useState('# Hello World!\nStart typing...');

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Editor
        content={content}
        onChange={(markdown) => setContent(markdown)}
        placeholder="Write something amazing..."
      />
    </div>
  );
}

export default App;
```

## Props Reference

### `<Editor />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `string` | `''` | Initial markdown content of the editor. |
| `onChange` | `(markdown: string) => void` | `undefined` | Callback fired when the content changes, returning markdown. |
| `placeholder` | `string` | `undefined` | Placeholder text when the editor is empty. |
| `editable` | `boolean` | `true` | Whether the editor is read-only or not. |
| `className` | `string` | `''` | Additional CSS classes for the editor container. |
| `config` | `Partial<EditorConfig>` | `{}` | Advanced configuration for features and images. |

## Contributing

We welcome contributions to `@caeher/react-tiptap-editor`! Follow these steps to set up the project locally:

1. **Fork the repository**
   Go to the [repository page](https://github.com/caeher/react-tiptap-editor) and click the "Fork" button.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-tiptap-editor.git
   cd react-tiptap-editor
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Make your changes**
   - The editor components are located in `src/components/editor`.
   - Make sure your code follows the existing style.
   - Run `npm run lint` to check for formatting or linting errors.

5. **Submit a Pull Request**
   - Commit your changes with descriptive messages.
   - Push to your fork and submit a PR to the `main` branch of the original repository.
