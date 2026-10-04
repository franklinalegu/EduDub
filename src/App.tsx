import { NavLink, Route, Routes } from 'react-router-dom';
import { FiDownload, FiLayers, FiSettings, FiInfo } from 'react-icons/fi';
import { Home } from './pages/Home';
import { Queue } from './pages/Queue';
import { SettingsPage } from './pages/Settings';
import { About } from './pages/About';

export default function App(): JSX.Element {
  return (
    <div className="flex h-screen">
      <aside className="flex w-60 shrink-0 flex-col gap-1 border-r border-white/[0.07] bg-black/20 p-4 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2.5 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-600 via-accent-500 to-edu-lime text-lg font-black text-white shadow-glow">
            E
          </span>
          <div>
            <p className="font-display text-[15px] font-bold text-white">EduDub</p>
            <p className="text-[11px] text-slate-500">Tutorials to English</p>
          </div>
        </div>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          <FiDownload /> Convert
        </NavLink>
        <NavLink to="/queue" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          <FiLayers /> Queue
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          <FiSettings /> Settings
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          <FiInfo /> About
        </NavLink>
        <div className="mt-auto rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-3 text-[11px] leading-relaxed text-amber-200/80">
          Education use only. Only convert content you own or have permission to use.
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}
