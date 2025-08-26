# Contoso Intranet

A modern SharePoint-style intranet application built with React, TypeScript, and Fluent UI v9. This application provides a comprehensive employee portal with news, tasks, events, and collaboration features.

**⚠️ Disclaimer:** This is a vibe-coded project generated using AI assistance and may require additional testing and refinement for production use.

## Features

- **Home Page**: Company news carousel, trending topics, quick links, and upcoming events
- **Task Management**: Interactive task list with filtering, column resizing, and user assignment
- **News Hub**: Corporate communications and announcements
- **Events**: Company events and calendar integration
- **People Directory**: Employee search and contact management
- **Responsive Design**: Mobile-first approach with Fluent UI components

## Tech Stack

- **React 18** with TypeScript
- **Fluent UI v9** for components and design system
- **Vite** for build tooling and development
- **Power Platform SDK** for SharePoint integration
- **React Router v6** for navigation

## Development

```bash
npm install
npm run dev  # Runs on port 3000 (required for Power Apps Code Apps)
npm run build
```

## SharePoint Integration

This application integrates with SharePoint lists to provide dynamic content:
- ContosoNews (News articles and announcements)
- ContosoTasks (Task management)
- ContosoEvents (Company events)
- ContosoTrending (Trending topics)
- ContosoQuickLinks (Navigation shortcuts)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
