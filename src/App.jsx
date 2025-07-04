import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WorkflowProvider } from './contexts/WorkflowContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import WorkflowBuilder from './pages/WorkflowBuilder';
import WorkflowDetail from './pages/WorkflowDetail';
import WebhookLogs from './pages/WebhookLogs';

function App() {
  return (
    <WorkflowProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workflow/new" element={<WorkflowBuilder />} />
              <Route path="/workflow/:id" element={<WorkflowDetail />} />
              <Route path="/workflow/:id/edit" element={<WorkflowBuilder />} />
              <Route path="/logs" element={<WebhookLogs />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </WorkflowProvider>
  );
}

export default App;