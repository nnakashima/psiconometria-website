import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import HomePage from './pages/HomePage';
import ConceitoPage from './pages/ConceitoPage';
import DisciplinasPage from './pages/DisciplinasPage';
import CatalogoPage from './pages/CatalogoPage';
import MatrizPage from './pages/MatrizPage';
import LaboratorioPage from './pages/LaboratorioPage';
import CasosPage from './pages/CasosPage';
import MetodoPage from './pages/MetodoPage';
import GlossarioPage from './pages/GlossarioPage';
import SobrePage from './pages/SobrePage';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="flex min-h-[100dvh] flex-col">
                <SiteHeader />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/o-que-e" element={<ConceitoPage />} />
                        <Route path="/as-duas-disciplinas" element={<DisciplinasPage />} />
                        <Route path="/catalogo" element={<CatalogoPage />} />
                        <Route path="/matriz" element={<MatrizPage />} />
                        <Route path="/laboratorio" element={<LaboratorioPage />} />
                        <Route path="/casos" element={<CasosPage />} />
                        <Route path="/metodo" element={<MetodoPage />} />
                        <Route path="/glossario" element={<GlossarioPage />} />
                        <Route path="/sobre" element={<SobrePage />} />
                    </Routes>
                </main>
                <SiteFooter />
            </div>
        </Router>
    );
}

export default App;
