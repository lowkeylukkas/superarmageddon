import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

type AppId = 'about' | 'achievements' | 'bible' | 'vibe' | 'music' | 'kpop' | 'games' | 'socials' | 'extras';
type DesktopApp = { id: AppId; name: string; icon: string; category: string; description: string };
type AppWindow = { id: AppId; x: number; y: number; z: number; minimized: boolean; maximized: boolean };
type DragState = { id: AppId; pointerX: number; pointerY: number; originX: number; originY: number };

const apps: DesktopApp[] = [
  { id: 'about', name: 'About me', icon: '◈', category: 'PROFILE', description: 'A little window into the person behind this digital universe.' },
  { id: 'achievements', name: 'Achievements', icon: '✧', category: 'SYSTEM', description: 'Discover milestones, hidden unlocks, and progress.' },
  { id: 'bible', name: 'Daily verse', icon: '⌁', category: 'REFLECTIONS', description: 'A quiet corner for scripture and encouragement.' },
  { id: 'vibe', name: 'Roll my vibe', icon: '⟡', category: 'RANDOMIZER', description: 'Let the system decide the vibe for today.' },
  { id: 'music', name: 'Music player', icon: '♫', category: 'AUDIO', description: 'A home for favorite tracks and sounds.' },
  { id: 'kpop', name: 'K-pop archive', icon: '✳', category: 'COLLECTION', description: 'Groups, artists, and eras worth keeping close.' },
  { id: 'games', name: 'Games & characters', icon: '⌘', category: 'COLLECTION', description: 'Favorite worlds, games, and characters.' },
  { id: 'socials', name: 'Social links', icon: '↗', category: 'CONNECTIONS', description: 'Find the places where I exist around the internet.' },
  { id: 'extras', name: 'Little surprises', icon: '⁕', category: 'EXTRAS', description: 'Compliments, secrets, and other unexpected things.' },
];
const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const dateNow = () => new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

function App() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [clock, setClock] = useState(timeNow);
  const [date, setDate] = useState(dateNow);
  const [mobileTab, setMobileTab] = useState<'home' | 'apps'>('home');
  const topZ = useRef(10);
  const drag = useRef<DragState | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => { setClock(timeNow()); setDate(dateNow()); }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const current = drag.current;
      if (!current) return;
      const dx = event.clientX - current.pointerX;
      const dy = event.clientY - current.pointerY;
      setWindows(items => items.map(item => item.id === current.id && !item.maximized
        ? { ...item, x: Math.max(8, Math.min(window.innerWidth - 260, current.originX + dx)), y: Math.max(62, Math.min(window.innerHeight - 150, current.originY + dy)) }
        : item));
    };
    const stop = () => { drag.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, []);

  const focusWindow = (id: AppId) => {
    topZ.current += 1;
    setWindows(items => items.map(item => item.id === id ? { ...item, minimized: false, z: topZ.current } : item));
  };
  const openApp = (id: AppId) => {
    const existing = windows.find(item => item.id === id);
    if (existing) focusWindow(id);
    else {
      topZ.current += 1;
      const offset = (windows.length % 5) * 34;
      setWindows(items => [...items, { id, x: Math.max(28, (window.innerWidth - 620) / 2 + offset), y: Math.max(78, (window.innerHeight - 390) / 2 + offset), z: topZ.current, minimized: false, maximized: false }]);
    }
    setLauncherOpen(false);
    setMobileTab('home');
  };
  const closeWindow = (id: AppId) => setWindows(items => items.filter(item => item.id !== id));
  const minimizeWindow = (id: AppId) => setWindows(items => items.map(item => item.id === id ? { ...item, minimized: true } : item));
  const toggleMaximize = (id: AppId) => {
    topZ.current += 1;
    setWindows(items => items.map(item => item.id === id ? { ...item, maximized: !item.maximized, z: topZ.current } : item));
  };
  const startDrag = (event: ReactPointerEvent, item: AppWindow) => {
    if (event.button !== 0 || item.maximized || window.matchMedia('(max-width: 760px)').matches) return;
    drag.current = { id: item.id, pointerX: event.clientX, pointerY: event.clientY, originX: item.x, originY: item.y };
    focusWindow(item.id);
  };

  return (
    <main className="os-shell">
      <div className="wallpaper-grid" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#" aria-label="Superarmageddon home" onClick={event => { event.preventDefault(); setWindows([]); setLauncherOpen(false); }}>
          <span className="wordmark-mark">S</span><span>SUPER<span className="wordmark-light">ARMAGEDDON</span></span>
        </a>
        <div className="topbar-center"><span className="status-dot" /> PERSONAL OPERATING ENVIRONMENT <span className="topbar-version">BUILD 0.2.0</span></div>
        <div className="topbar-right"><span className="connection"><i /> SYSTEM ONLINE</span><span className="topbar-clock">{clock}</span></div>
      </header>

      <section className="desktop">
        <div className="desktop-heading">
          <p className="eyebrow">WELCOME TO YOUR SPACE</p><h1>A world of <em>your own.</em></h1>
          <p className="desktop-subtitle">Personal files. Favorite things. A few secrets in the system.</p>
        </div>
        <div className="desktop-icons" aria-label="Desktop applications">
          {apps.map(app => <button className="desktop-icon" key={app.id} onClick={() => openApp(app.id)}><span className="desktop-icon-art">{app.icon}</span><span>{app.name}</span></button>)}
        </div>
        <aside className="profile-widget">
          <div className="widget-topline"><span>USER PROFILE</span><span className="widget-live">● LIVE</span></div>
          <div className="profile-main">
            <div className="avatar-frame"><img src="https://media1.tenor.com/m/ik5IecAlaS4AAAAC/phainon-phainon-hsr.gif" alt="Phainon animated profile" /></div>
            <div><p className="profile-label">CURRENT USER</p><h2>Lukkas</h2><p className="profile-status">Exploring the unknown.</p></div>
          </div>
          <div className="widget-divider" />
          <div className="widget-footer"><span>OPEN WINDOWS</span><strong>{windows.filter(item => !item.minimized).length} ACTIVE</strong></div>
        </aside>
        <div className="desktop-note"><span className="note-symbol">✳</span><div><strong>WINDOW MANAGER ONLINE</strong><p>Open multiple applications. Move, minimize, and arrange them.</p></div></div>

        {windows.filter(item => !item.minimized).map(item => {
          const app = apps.find(entry => entry.id === item.id);
          if (!app) return null;
          return (
            <section key={item.id} className={`app-window ${item.maximized ? 'is-maximized' : ''}`} role="dialog" aria-labelledby={`window-title-${item.id}`} onPointerDown={() => focusWindow(item.id)} style={item.maximized ? { zIndex: item.z } : { left: item.x, top: item.y, zIndex: item.z }}>
              <div className="window-titlebar" onPointerDown={event => startDrag(event, item)} onDoubleClick={() => toggleMaximize(item.id)}>
                <div className="window-controls">
                  <button className="control-close" aria-label={`Close ${app.name}`} onPointerDown={event => event.stopPropagation()} onClick={() => closeWindow(item.id)}>×</button>
                  <button className="control-minimize" aria-label={`Minimize ${app.name}`} onPointerDown={event => event.stopPropagation()} onClick={() => minimizeWindow(item.id)}>−</button>
                  <button className="control-maximize" aria-label={`Maximize ${app.name}`} onPointerDown={event => event.stopPropagation()} onClick={() => toggleMaximize(item.id)}>+</button>
                </div>
                <span className="window-app-name">{app.name.toUpperCase()}</span><span className="window-index">SYS / {String(apps.findIndex(entry => entry.id === item.id) + 1).padStart(2, '0')}</span>
              </div>
              <div className="window-content">
                <p className="eyebrow">{app.category} / APPLICATION</p>
                <div className="window-heading-row"><span className="window-large-icon">{app.icon}</span><div><h2 id={`window-title-${item.id}`}>{app.name}</h2><p>{app.description}</p></div></div>
                <div className="coming-soon"><span className="coming-line" /><span>APPLICATION MODULE IN DEVELOPMENT</span><span className="coming-line" /></div>
                <p className="window-footnote">The original feature is on the preservation list. This space will be filled in as we build the system, one module at a time.</p>
              </div>
              <div className="window-status"><span>SUPERARMAGEDDON / USER SPACE</span><span>● READY</span></div>
            </section>
          );
        })}
      </section>

      {launcherOpen && <div className="launcher-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setLauncherOpen(false); }}>
        <section className="launcher-panel" aria-label="Application launcher">
          <div className="launcher-header"><div><p className="eyebrow">SYSTEM DIRECTORY</p><h2>Applications</h2></div><button className="launcher-close" onClick={() => setLauncherOpen(false)} aria-label="Close launcher">×</button></div>
          <div className="launcher-grid">{apps.map(app => <button key={app.id} className="launcher-app" onClick={() => openApp(app.id)}><span>{app.icon}</span><strong>{app.name}</strong><small>{app.category}</small></button>)}</div>
          <div className="launcher-bottom"><span>9 APPLICATIONS</span><span>MORE MODULES INCOMING</span></div>
        </section>
      </div>}

      <footer className="taskbar">
        <button className={`launcher-button ${launcherOpen ? 'is-open' : ''}`} onClick={() => setLauncherOpen(open => !open)} aria-label="Open application launcher" aria-expanded={launcherOpen}><span className="launcher-glyph">S</span><span className="launcher-word">SYSTEM</span></button>
        <div className="taskbar-divider" />
        <div className="taskbar-pins">{apps.slice(0, 5).map(app => <button key={app.id} className="taskbar-pin" onClick={() => openApp(app.id)} title={app.name}>{app.icon}</button>)}</div>
        <div className="taskbar-spacer" />
        <div className="taskbar-windows">{windows.map(item => {
          const app = apps.find(entry => entry.id === item.id);
          return app ? <button key={item.id} className={`taskbar-window ${item.minimized ? 'minimized' : 'running'}`} onClick={() => focusWindow(item.id)} title={app.name}><span>{app.icon}</span>{app.name}</button> : null;
        })}</div>
        <div className="taskbar-tray"><span className="tray-signal">◈</span><span className="tray-date">{date}</span><strong>{clock}</strong></div>
      </footer>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className={mobileTab === 'home' ? 'active' : ''} onClick={() => { setMobileTab('home'); setLauncherOpen(false); setWindows(items => items.map(item => ({ ...item, minimized: true }))); }}><span>⌂</span>HOME</button>
        <button className={mobileTab === 'apps' || launcherOpen ? 'active' : ''} onClick={() => { setMobileTab('apps'); setLauncherOpen(true); }}><span>▦</span>APPS</button>
        <div className="mobile-nav-clock">{clock}</div>
      </nav>
    </main>
  );
}
export default App;
