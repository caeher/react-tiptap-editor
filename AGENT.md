# @caeher/react-tiptap-editor

A premium, Notion-style rich text editor for React, built on top of TipTap, Shiki, and Tailwind CSS.

## Features

- 🚀 **Modern UI**: Clean, glassmorphic design with smooth animations.
- ⌨️ **Slash Commands**: Quick insertion of blocks via `/`.
- 🫧 **Bubble Menu**: Contextual formatting menu on text selection.
- 🎨 **Code Highlighting**: Beautiful syntax highlighting powered by Shiki.
- 📝 **Markdown Support**: Seamless markdown input and output.
- ⚙️ **Highly Configurable**: Enable/disable features and customize image handling.

## Installation

```bash
npm install @caeher/react-tiptap-editor
```

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import { Editor } from '@caeher/react-tiptap-editor';

function App() {
  const [content, setContent] = useState('# Hello World');

  return (
    <Editor 
      content={content} 
      onChange={setContent} 
      placeholder="Start typing..." 
    />
  );
}
```

### Configuration

You can customize the editor by passing a `config` prop.

```tsx
<Editor
  config={{
    features: {
      table: false,       // Disable tables
      codeBlock: true,    // Enable code blocks
      slashCommand: true, // Enable slash menu
    },
    image: {
      mode: 'url',        // 'url', 'upload', or 'disabled'
    }
  }}
/>
```

### Image Upload Support

To enable local image uploads, set the mode to `'upload'` and provide an `onUpload` handler.

```tsx
<Editor
  config={{
    image: {
      mode: 'upload',
      accept: 'image/png, image/jpeg',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      onUpload: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        return { src: data.url };
      },
      retrieveBasePath: 'https://cdn.example.com', // Optional base path for relative URLs
    }
  }}
/>
```

## Configuration Options

### `EditorFeatures`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `textFormatting` | `boolean` | `true` | Bold, italic, underline, strike, inline code |
| `headings` | `boolean` | `true` | H1, H2, H3, H4 |
| `lists` | `boolean` | `true` | Bullet, ordered, and task lists |
| `blockquote` | `boolean` | `true` | Blockquote insertion |
| `codeBlock` | `boolean` | `true` | Shiki-powered code blocks |
| `table` | `boolean` | `true` | Table insertion and management |
| `image` | `boolean` | `true` | Image support |
| `link` | `boolean` | `true` | Link insertion |
| `horizontalRule` | `boolean` | `true` | Divider line |
| `slashCommand` | `boolean` | `true` | Slash (`/`) command menu |

### `EditorImageConfig`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'url' \| 'upload' \| 'disabled'` | `'url'` | Image insertion method |
| `onUpload` | `(file: File) => Promise<{ src: string }>` | `undefined` | Required for `'upload'` mode |
| `retrieveBasePath` | `string` | `undefined` | Prepended to relative URLs |
| `accept` | `string` | `'image/*'` | Allowed file types |
| `maxFileSize` | `number` | `5242880` | Max file size in bytes (default 5MB) |

## License

MIT
