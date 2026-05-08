import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './lib/store';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { StepDetail } from './pages/StepDetail';
import { Auth } from './pages/Auth';
import { Projects } from './pages/Projects';

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dashboard/:projectId" element={<Dashboard />} />
                        <Route path="/step/:id" element={<StepDetail />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
