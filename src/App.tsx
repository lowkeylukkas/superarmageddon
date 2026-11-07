import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

type AppId = 'about' | 'achievements' | 'bible' | 'vibe' | 'music' | 'kpop' | 'games' | 'socials' | 'extras';

type DesktopApp = {
  id: AppId;
  name: string;
  icon: string;
  category: string;
  description: string;
};

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

const initialTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const initialDate = () => new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

function App() {
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [clock, setClock] = useState(initialTime);
  const [date, setDate] = useState(initialDate());
  const [mobileTab, setMobileTab] = useState<'home' | 'apps'>('home');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(initialTime());
      setDate(initialDate());
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const openApp = (id: AppId) => {
    setActiveApp(id);
    setLauncherOpen(false);
    setMobileTab('home');
  };

  const selectedApp = apps.find((app) => app.id === activeApp);

  return (
    <main className="os-shell">
      <div className="wallpaper-grid" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />

      <header className="topbar">
        <a className="wordmark" href="#" aria-label="Superarmageddon home" onClick={(event) => { event.preventDefault(); setActiveApp(null); }}>
          <span className="wordmark-mark">S</span>
          <span>SUPER<span className="wordmark-light">ARMAGEDDON</span></span>
        </a>
        <div className="topbar-center"><span className="status-dot" /> PERSONAL OPERATING ENVIRONMENT <span className="topbar-version">BUILD 0.1.0</span></div>
        <div className="topbar-right"><span className="connection"><i /> SYSTEM ONLINE</span><span className="topbar-clock">{clock}</span></div>
      </header>

      <section className="desktop">
        <div className="desktop-heading">
          <p className="eyebrow">WELCOME TO YOUR SPACE</p>
          <h1>A world of <em>your own.</em></h1>
          <p className="desktop-subtitle">Personal files. Favorite things. A few secrets in the system.</p>
        </div>

        <div className="desktop-icons" aria-label="Desktop applications">
          {apps.map((app, index) => (
            <button className="desktop-icon" key={app.id} onClick={() => openApp(app.id)} style={{ '--icon-index': index } as CSSProperties}>
              <span className="desktop-icon-art">{app.icon}</span>
              <span>{app.name}</span>
            </button>
          ))}
        </div>

        <aside className="profile-widget">
          <div className="widget-topline"><span>USER PROFILE</span><span className="widget-live">● LIVE</span></div>
          <div className="profile-main">
            <div className="avatar-frame"><img src="https://media1.tenor.com/m/ik5IecAlaS4AAAAC/phainon-phainon-hsr.gif" alt="Phainon animated profile" /></div>
            <div><p className="profile-label">CURRENT USER</p><h2>Lukkas</h2><p className="profile-status">Exploring the unknown.</p></div>
          </div>
          <div className="widget-divider" />
          <div className="widget-footer"><span>SESSION STATUS</span><strong><i /> ACTIVE</strong></div>
        </aside>

        <div className="desktop-note">
          <span className="note-symbol">✳</span>
          <div><strong>THIS SPACE IS STILL EVOLVING</strong><p>More applications and hidden details are on the way.</p></div>
        </div>

        {activeApp && selectedApp && (
          <div className="window-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveApp(null); }}>
            <section className="app-window" role="dialog" aria-modal="true" aria-labelledby="window-title">
              <div className="window-titlebar">
                <div className="window-controls"><button aria-label="Close window" onClick={() => setActiveApp(null)}>×</button><span /><span /></div>
                <span className="window-app-name">{selectedApp.name.toUpperCase()}</span>
                <span className="window-index">SYS / {String(apps.findIndex((app) => app.id === activeApp) + 1).padStart(2, '0')}</span>
              </div>
              <div className="window-content">
                <p className="eyebrow">{selectedApp.category} / APPLICATION</p>
                <div className="window-heading-row"><span className="window-large-icon">{selectedApp.icon}</span><div><h2 id="window-title">{selectedApp.name}</h2><p>{selectedApp.description}</p></div></div>
                <div className="coming-soon"><span className="coming-line" /><span>APPLICATION MODULE IN DEVELOPMENT</span><span className="coming-line" /></div>
                <p className="window-footnote">The original feature is on the preservation list. This space will be filled in as we build the system, one module at a time.</p>
              </div>
              <div className="window-status"><span>SUPERARMAGEDDON / USER SPACE</span><span>● READY</span></div>
            </section>
          </div>
        )}
      </section>

      {launcherOpen && (
        <div className="launcher-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setLauncherOpen(false); }}>
          <section className="launcher-panel" aria-label="Application launcher">
            <div className="launcher-header"><div><p className="eyebrow">SYSTEM DIRECTORY</p><h2>Applications</h2></div><button className="launcher-close" onClick={() => setLauncherOpen(false)} aria-label="Close launcher">×</button></div>
            <div className="launcher-grid">{apps.map((app) => <button key={app.id} className="launcher-app" onClick={() => openApp(app.id)}><span>{app.icon}</span><strong>{app.name}</strong><small>{app.category}</small></button>)}</div>
            <div className="launcher-bottom"><span>9 APPLICATIONS</span><span>MORE MODULES INCOMING</span></div>
          </section>
        </div>
      )}

      <footer className="taskbar">
        <button className={`launcher-button ${launcherOpen ? 'is-open' : ''}`} onClick={() => setLauncherOpen((open) => !open)} aria-label="Open application launcher" aria-expanded={launcherOpen}>
          <span className="launcher-glyph">S</span><span className="launcher-word">SYSTEM</span>
        </button>
        <div className="taskbar-divider" />
        <div className="taskbar-pins">{apps.slice(0, 5).map((app) => <button key={app.id} className={`taskbar-pin ${activeApp === app.id ? 'active' : ''}`} onClick={() => openApp(app.id)} title={app.name}>{app.icon}</button>)}</div>
        <div className="taskbar-spacer" />
        <div className="taskbar-tray"><span className="tray-signal">◈</span><span className="tray-date">{date}</span><strong>{clock}</strong></div>
      </footer>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className={mobileTab === 'home' ? 'active' : ''} onClick={() => { setMobileTab('home'); setLauncherOpen(false); setActiveApp(null); }}><span>⌂</span>HOME</button>
        <button className={mobileTab === 'apps' || launcherOpen ? 'active' : ''} onClick={() => { setMobileTab('apps'); setLauncherOpen(true); }}><span>▦</span>APPS</button>
        <div className="mobile-nav-clock">{clock}</div>
      </nav>
    </main>
  );
}

export default App;
