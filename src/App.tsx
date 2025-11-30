import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CyberSpinner } from './components/ui';
import { ToastContainer } from './components/ui/Toast';
// Import AppShell and ProtectedRoute directly (not lazy) to prevent shell from unmounting
import AppShell from './pages/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all route components for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AppIndex = lazy(() => import('./pages/AppIndex'));
const WorkspaceDashboard = lazy(() => import('./pages/WorkspaceDashboard'));
const ChatList = lazy(() => import('./pages/ChatList'));
const ModelSelect = lazy(() => import('./pages/ModelSelect'));
const Chat = lazy(() => import('./pages/Chat'));
const MemoryBank = lazy(() => import('./pages/MemoryBank'));
const MemoryDetail = lazy(() => import('./pages/MemoryDetail'));
const Team = lazy(() => import('./pages/Team'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Console = lazy(() => import('./pages/Console'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <CyberSpinner size="lg" />
      <p className="text-neon-green mt-4 font-cyber uppercase tracking-wider animate-pulse">
        Loading Module...
      </p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          {/* Protected App Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            {/* Nested routes within app shell */}
            <Route path="workspace/:id" element={<WorkspaceDashboard />} />
            <Route path="chat" element={<ChatList />} />
            <Route path="model-select" element={<ModelSelect />} />
            <Route path="chat/:conversationId" element={<Chat />} />
            <Route path="memories" element={<MemoryBank />} />
            <Route path="memories/:id" element={<MemoryDetail />} />
            <Route path="team" element={<Team />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="dev" element={<Console />} />
            <Route path="settings" element={<Settings />} />
            {/* Additional app routes will be added in future tasks */}
            <Route index element={<AppIndex />} />
          </Route>

          {/* 404 Error Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
