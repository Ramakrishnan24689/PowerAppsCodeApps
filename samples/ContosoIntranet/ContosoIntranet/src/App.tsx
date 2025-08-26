import { FluentProvider } from '@fluentui/react-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ResponsiveProvider } from './contexts/ResponsiveContext';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import HomePage from './pages/HomePage';
import TaskListPage from './components/pages/TaskListPage';
import { contosoLightTheme } from './themes/figmaTheme';
import './design/tokens.css';
import './themes/figmaTokens.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      retry: 1,
    },
  },
});

function AppContent() {
  return (
    <ResponsiveProvider>
      <Router>
        <ResponsiveLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tasks" element={<TaskListPage />} />
          </Routes>
        </ResponsiveLayout>
      </Router>
    </ResponsiveProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FluentProvider theme={contosoLightTheme}>
        <AppContent />
      </FluentProvider>
    </QueryClientProvider>
  );
}
