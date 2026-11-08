import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

type AppId = 'about' | 'achievements' | 'bible' | 'vibe' | 'music' | 'kpop' | 'games' | 'socials' | 'extras';
type AchievementId = 'avatar-tapper' | 'vibe-roller' | 'konami' | 'compliment-collector' | 'reaction-giver' | 'rainbow-finder' | 'games-explorer' | 'verse-reader';
type DesktopApp = { id: AppId; name: string; icon: string; category: string; description: string };
type AppWindow = { id: AppId; x: number; y: number; z: number; minimized: boolean; maximized: boolean };
type DragState = { id: AppId; pointerX: number; pointerY: number; originX: number; originY: number };
type Achievement = { id: AchievementId; title: string; description: string; hint: string; icon: string; category: string };

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

const achievements: Achievement[] = [
  { id: 'avatar-tapper', title: 'Avatar Tapper', description: 'You kept tapping until something happened. Respect the dedication.', hint: 'Tap Phainon’s profile picture seven times.', icon: '✧', category: 'PROFILE' },
  { id: 'vibe-roller', title: 'Vibe Curator', description: 'The system has officially checked your vibe.', hint: 'Roll your first vibe in the Roll My Vibe app.', icon: '⟡', category: 'DISCOVERY' },
  { id: 'konami', title: 'Codebreaker', description: 'A classic sequence. A very curious user. A secret found.', hint: 'Enter the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A.', icon: '⌘', category: 'SECRET' },
  { id: 'compliment-collector', title: 'Kind Words', description: 'A little reminder that good words are worth collecting.', hint: 'Receive your first compliment in Little Surprises.', icon: '♡', category: 'EXTRAS' },
  { id: 'reaction-giver', title: 'Express Yourself', description: 'You left your mark with a reaction.', hint: 'Leave your first reaction in Little Surprises.', icon: '☻', category: 'EXTRAS' },
  { id: 'rainbow-finder', title: 'Rainbow Finder', description: 'You discovered the hidden charge around the profile avatar.', hint: 'Press and hold Phainon’s profile picture for a moment.', icon: '虹', category: 'SECRET' },
  { id: 'games-explorer', title: 'World Hopper', description: 'The games archive has a visitor. Let the exploration begin.', hint: 'Open the Games & Characters application.', icon: '🎮', category: 'COLLECTION' },
  { id: 'verse-reader', title: 'Quiet Moment', description: 'You took a moment to read a verse.', hint: 'Open Daily Verse and reveal your first verse.', icon: '⌁', category: 'REFLECTIONS' },
];

const storagePrefix = 'lukkas_ach_';
const loadAchievements = (): Set<AchievementId> => {
  try {
    return new Set(achievements.filter((item) => window.localStorage.getItem(storagePrefix + item.id) === '1').map((item) => item.id));
  } catch {
    return new Set();
  }
};
const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const dateNow = () => new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

const vibes = [
  'vibe check: passed ✅',
  'energy: unstoppable badminton serve 🏸',
  'current status: main character energy ✨',
  'today’s forecast: 100% chance of gacha pulls 🎰',
  'mood: k-pop playlist on repeat 🎧',
  'vibe: future lawyer, present gamer ⚖️🎮',
  'status: hydrated & motivated 💧',
];
const compliments = [
  'You’re doing better than you think. 💛',
  'That badminton serve? Unstoppable. 🏸',
  'Future lawyer, present legend. ⚖️✨',
  'Your playlist has great taste. 🎧',
  'Main character energy detected. 🌟',
  'You showed up today, and that counts. 💙',
  'Feeling smart? Clock that. 🎓',
];
const verses = [
  { ref: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { ref: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.' },
  { ref: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
  { ref: 'Psalm 56:3', text: 'What time I am afraid, I will trust in thee.' },
  { ref: 'Proverbs 3:5', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
  { ref: 'Psalm 30:5', text: 'Weeping may endure for a night, but joy cometh in the morning.' },
];

function App() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [clock, setClock] = useState(timeNow);
  const [date, setDate] = useState(dateNow);
  const [mobileTab, setMobileTab] = useState<'home' | 'apps'>('home');
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(loadAchievements);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementId>('avatar-tapper');
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const [avatarClicks, setAvatarClicks] = useState(0);
  const [isRainbow, setIsRainbow] = useState(false);
  const [currentVibe, setCurrentVibe] = useState('');
  const [currentCompliment, setCurrentCompliment] = useState('');
  const [reaction, setReaction] = useState('');
  const [currentVerse, setCurrentVerse] = useState<{ ref: string; text: string } | null>(null);
  const topZ = useRef(10);
  const drag = useRef<DragState | null>(null);
  const unlockedRef = useRef(unlocked);
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
  const rainbowTimer = useRef<number | null>(null);

  const grantAchievement = useCallback((id: AchievementId) => {
    if (unlockedRef.current.has(id)) return;
    const next = new Set(unlockedRef.current);
    next.add(id);
    unlockedRef.current = next;
    setUnlocked(next);
    try {
      window.localStorage.setItem(storagePrefix + id, '1');
    } catch {
      // Session progress still updates if browser storage is unavailable.
    }
    const achievement = achievements.find((item) => item.id === id);
    if (achievement) setAchievementToast(achievement);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => { setClock(timeNow()); setDate(dateNow()); }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!achievementToast) return;
    const timer = window.setTimeout(() => setAchievementToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [achievementToast]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const current = drag.current;
      if (!current) return;
      const dx = event.clientX - current.pointerX;
      const dy = event.clientY - current.pointerY;
      setWindows((items) => items.map((item) => item.id === current.id && !item.maximized
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

  useEffect(() => {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let progress = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === sequence[progress]) {
        progress += 1;
        if (progress === sequence.length) {
          progress = 0;
          grantAchievement('konami');
        }
      } else {
        progress = key === sequence[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [grantAchievement]);

  const focusWindow = (id: AppId) => {
    topZ.current += 1;
    setWindows((items) => items.map((item) => item.id === id ? { ...item, minimized: false, z: topZ.current } : item));
  };
  const openApp = (id: AppId) => {
    if (id === 'games') grantAchievement('games-explorer');
    const existing = windows.find((item) => item.id === id);
    if (existing) focusWindow(id);
    else {
      topZ.current += 1;
      const offset = (windows.length % 5) * 34;
      setWindows((items) => [...items, {
        id,
        x: Math.max(28, (window.innerWidth - 620) / 2 + offset),
        y: Math.max(78, (window.innerHeight - 390) / 2 + offset),
        z: topZ.current,
        minimized: false,
        maximized: false,
      }]);
    }
    setLauncherOpen(false);
    setMobileTab('home');
  };
  const closeWindow = (id: AppId) => setWindows((items) => items.filter((item) => item.id !== id));
  const minimizeWindow = (id: AppId) => setWindows((items) => items.map((item) => item.id === id ? { ...item, minimized: true } : item));
  const toggleMaximize = (id: AppId) => {
    topZ.current += 1;
    setWindows((items) => items.map((item) => item.id === id ? { ...item, maximized: !item.maximized, z: topZ.current } : item));
  };
  const startDrag = (event: ReactPointerEvent, item: AppWindow) => {
    if (event.button !== 0 || item.maximized || window.matchMedia('(max-width: 760px)').matches) return;
    drag.current = { id: item.id, pointerX: event.clientX, pointerY: event.clientY, originX: item.x, originY: item.y };
    focusWindow(item.id);
  };

  const beginAvatarHold = () => {
    longPressTriggered.current = false;
    if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      setIsRainbow(true);
      grantAchievement('rainbow-finder');
      if (rainbowTimer.current !== null) window.clearTimeout(rainbowTimer.current);
      rainbowTimer.current = window.setTimeout(() => setIsRainbow(false), 1500);
    }, 650);
  };
  const endAvatarHold = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const handleAvatarClick = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    setAvatarClicks((count) => {
      const next = count + 1;
      if (next === 7) grantAchievement('avatar-tapper');
      return next;
    });
  };

  const rollVibe = () => {
    setCurrentVibe(vibes[Math.floor(Math.random() * vibes.length)]);
    grantAchievement('vibe-roller');
  };
  const getCompliment = () => {
    setCurrentCompliment(compliments[Math.floor(Math.random() * compliments.length)]);
    grantAchievement('compliment-collector');
  };
  const leaveReaction = (emoji: string) => { setReaction(emoji); grantAchievement('reaction-giver'); };
  const revealVerse = () => {
    setCurrentVerse(verses[Math.floor(Math.random() * verses.length)]);
    grantAchievement('verse-reader');
  };

  const unlockedCount = unlocked.size;
  const progress = Math.round((unlockedCount / achievements.length) * 100);
  const selected = achievements.find((item) => item.id === selectedAchievement) ?? achievements[0];

  return (
    <main className="os-shell">
      <div className="wallpaper-grid" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />

      <header className="topbar">
        <a className="wordmark" href="#" aria-label="Superarmageddon home" onClick={(event) => { event.preventDefault(); setWindows([]); setLauncherOpen(false); }}>
          <span className="wordmark-mark">S</span><span>SUPER<span className="wordmark-light">ARMAGEDDON</span></span>
        </a>
        <div className="topbar-center"><span className="status-dot" /> PERSONAL OPERATING ENVIRONMENT <span className="topbar-version">BUILD 0.3.0</span></div>
        <div className="topbar-right"><span className="connection"><i /> SYSTEM ONLINE</span><span className="topbar-clock">{clock}</span></div>
      </header>

      <section className="desktop">
        <div className="desktop-heading"><p className="eyebrow">WELCOME TO YOUR SPACE</p><h1>A world of <em>your own.</em></h1><p className="desktop-subtitle">Personal files. Favorite things. A few secrets in the system.</p></div>
        <div className="desktop-icons" aria-label="Desktop applications">
          {apps.map((app) => <button className="desktop-icon" key={app.id} onClick={() => openApp(app.id)}><span className="desktop-icon-art">{app.icon}</span><span>{app.name}</span></button>)}
        </div>

        <aside className="profile-widget">
          <div className="widget-topline"><span>USER PROFILE</span><span className="widget-live">● LIVE</span></div>
          <div className="profile-main">
            <button className={`avatar-frame avatar-interactive ${isRainbow ? 'rainbow-charge' : ''}`} onClick={handleAvatarClick} onPointerDown={beginAvatarHold} onPointerUp={endAvatarHold} onPointerCancel={endAvatarHold} onPointerLeave={endAvatarHold} aria-label="Phainon profile picture — tap seven times or press and hold for a secret">
              <img src="https://media1.tenor.com/m/ik5IecAlaS4AAAAC/phainon-phainon-hsr.gif" alt="Phainon animated profile" draggable={false} />
            </button>
            <div><p className="profile-label">CURRENT USER</p><h2>Lukkas</h2><p className="profile-status">Exploring the unknown.</p></div>
          </div>
          <div className="widget-divider" />
          <div className="widget-footer"><span>SECRETS FOUND</span><strong>{unlockedCount} / {achievements.length}</strong></div>
        </aside>

        <div className="desktop-note"><span className="note-symbol">✳</span><div><strong>YOUR PROGRESS IS SAVED</strong><p>Hidden achievements are waiting to be discovered.</p></div></div>

        {windows.filter((item) => !item.minimized).map((item) => {
          const app = apps.find((entry) => entry.id === item.id);
          if (!app) return null;
          return (
            <section key={item.id} className={`app-window ${item.maximized ? 'is-maximized' : ''}`} role="dialog" aria-labelledby={`window-title-${item.id}`} onPointerDown={() => focusWindow(item.id)} style={item.maximized ? { zIndex: item.z } : { left: item.x, top: item.y, zIndex: item.z }}>
              <div className="window-titlebar" onPointerDown={(event) => startDrag(event, item)} onDoubleClick={() => toggleMaximize(item.id)}>
                <div className="window-controls">
                  <button className="control-close" aria-label={`Close ${app.name}`} onPointerDown={(event) => event.stopPropagation()} onClick={() => closeWindow(item.id)}>×</button>
                  <button className="control-minimize" aria-label={`Minimize ${app.name}`} onPointerDown={(event) => event.stopPropagation()} onClick={() => minimizeWindow(item.id)}>−</button>
                  <button className="control-maximize" aria-label={`Maximize ${app.name}`} onPointerDown={(event) => event.stopPropagation()} onClick={() => toggleMaximize(item.id)}>+</button>
                </div>
                <span className="window-app-name">{app.name.toUpperCase()}</span><span className="window-index">SYS / {String(apps.findIndex((entry) => entry.id === item.id) + 1).padStart(2, '0')}</span>
              </div>

              {item.id === 'achievements' ? (
                <div className="achievement-app window-content">
                  <div className="achievement-heading">
                    <div><p className="eyebrow">SYSTEM / DISCOVERY LOG</p><h2>Secrets & milestones.</h2><p>Eight hidden achievements. How many have you found?</p></div>
                    <div className="achievement-total"><strong>{unlockedCount}<span>/{achievements.length}</span></strong><small>UNLOCKED</small></div>
                  </div>
                  <div className="achievement-progress"><div className="achievement-progress-label"><span>COLLECTION PROGRESS</span><strong>{progress}%</strong></div><div className="achievement-progress-track"><span style={{ width: progress + '%' }} /></div></div>
                  <div className="achievement-layout">
                    <div className="achievement-grid">
                      {achievements.map((achievement, index) => {
                        const isUnlocked = unlocked.has(achievement.id);
                        const isSelected = selectedAchievement === achievement.id;
                        return <button key={achievement.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedAchievement(achievement.id)}>
                          <span className="achievement-card-icon">{isUnlocked ? achievement.icon : '▧'}</span>
                          <span className="achievement-card-copy"><strong>{isUnlocked ? achievement.title : `SECRET / ${String(index + 1).padStart(2, '0')}`}</strong><small>{isUnlocked ? achievement.category : 'UNIDENTIFIED SIGNAL'}</small></span>
                          <span className="achievement-card-state">{isUnlocked ? '✓' : '•'}</span>
                        </button>;
                      })}
                    </div>
                    <aside className="achievement-inspector">
                      <p className="eyebrow">{unlocked.has(selected.id) ? 'ACHIEVEMENT UNLOCKED' : 'LOCKED / CLASSIFIED'}</p>
                      <span className="inspector-icon">{unlocked.has(selected.id) ? selected.icon : '▧'}</span>
                      <h3>{unlocked.has(selected.id) ? selected.title : 'Unknown signal'}</h3>
                      <p>{unlocked.has(selected.id) ? selected.description : 'A hidden achievement is waiting to be discovered.'}</p>
                      <div className="inspector-hint"><span>HINT</span>{selected.hint}</div>
                      <small className="inspector-category">{selected.category} / {unlocked.has(selected.id) ? 'RECOVERED' : 'ENCRYPTED'}</small>
                    </aside>
                  </div>
                  <div className="achievement-footer"><span>PROGRESS IS SAVED ON THIS BROWSER</span><span>{unlockedCount === achievements.length ? 'ALL SECRETS RECOVERED ✦' : 'KEEP EXPLORING ✦'}</span></div>
                </div>
              ) : item.id === 'vibe' ? (
                <div className="feature-content window-content"><p className="eyebrow">RANDOMIZER / VIBE CHECK</p><h2>Roll your vibe.</h2><p className="feature-description">A tiny system-generated status report, just for today.</p><button className="feature-action" onClick={rollVibe}>⟡ ROLL MY VIBE</button>{currentVibe && <div className="feature-result">{currentVibe}</div>}</div>
              ) : item.id === 'bible' ? (
                <div className="feature-content window-content"><p className="eyebrow">REFLECTIONS / DAILY VERSE</p><h2>A quiet moment.</h2><p className="feature-description">Take a breath and read a verse for today.</p><button className="feature-action" onClick={revealVerse}>⌁ REVEAL A VERSE</button>{currentVerse && <blockquote className="verse-result">“{currentVerse.text}”<cite>{currentVerse.ref}</cite></blockquote>}</div>
              ) : item.id === 'extras' ? (
                <div className="feature-content window-content"><p className="eyebrow">EXTRAS / LITTLE SURPRISES</p><h2>A little something.</h2><p className="feature-description">Collect a kind word or leave a reaction. Small things count.</p><button className="feature-action" onClick={getCompliment}>♡ GIVE ME A COMPLIMENT</button>{currentCompliment && <div className="feature-result">{currentCompliment}</div>}<div className="reaction-row" aria-label="Leave a reaction">{['💜', '✨', '🖤', '🌙', '⭐'].map((emoji) => <button key={emoji} className={reaction === emoji ? 'reaction-selected' : ''} onClick={() => leaveReaction(emoji)} aria-label={`React with ${emoji}`}>{emoji}</button>)}</div>{reaction && <p className="reaction-confirmation">Reaction received: {reaction}</p>}</div>
              ) : (
                <div className="window-content"><p className="eyebrow">{app.category} / APPLICATION</p><div className="window-heading-row"><span className="window-large-icon">{app.icon}</span><div><h2 id={`window-title-${item.id}`}>{app.name}</h2><p>{app.description}</p></div></div><div className="coming-soon"><span className="coming-line" /><span>APPLICATION MODULE IN DEVELOPMENT</span><span className="coming-line" /></div><p className="window-footnote">The original feature is on the preservation list. This space will be filled in as we build the system, one module at a time.</p></div>
              )}
              <div className="window-status"><span>SUPERARMAGEDDON / USER SPACE</span><span>● READY</span></div>
            </section>
          );
        })}
      </section>

      {launcherOpen && <div className="launcher-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setLauncherOpen(false); }}>
        <section className="launcher-panel" aria-label="Application launcher">
          <div className="launcher-header"><div><p className="eyebrow">SYSTEM DIRECTORY</p><h2>Applications</h2></div><button className="launcher-close" onClick={() => setLauncherOpen(false)} aria-label="Close launcher">×</button></div>
          <div className="launcher-grid">{apps.map((app) => <button key={app.id} className="launcher-app" onClick={() => openApp(app.id)}><span>{app.icon}</span><strong>{app.name}</strong><small>{app.category}</small></button>)}</div>
          <div className="launcher-bottom"><span>9 APPLICATIONS</span><span>MORE MODULES INCOMING</span></div>
        </section>
      </div>}

      {achievementToast && <div className="achievement-toast" role="status"><span className="toast-icon">✦</span><div><small>NEW ACHIEVEMENT UNLOCKED</small><strong>{achievementToast.title}</strong><span>{achievementToast.description}</span></div></div>}

      <footer className="taskbar">
        <button className={`launcher-button ${launcherOpen ? 'is-open' : ''}`} onClick={() => setLauncherOpen((open) => !open)} aria-label="Open application launcher" aria-expanded={launcherOpen}><span className="launcher-glyph">S</span><span className="launcher-word">SYSTEM</span></button>
        <div className="taskbar-divider" />
        <div className="taskbar-pins">{apps.slice(0, 5).map((app) => <button key={app.id} className="taskbar-pin" onClick={() => openApp(app.id)} title={app.name}>{app.icon}</button>)}</div>
        <div className="taskbar-spacer" />
        <div className="taskbar-windows">{windows.map((item) => {
          const app = apps.find((entry) => entry.id === item.id);
          return app ? <button key={item.id} className={`taskbar-window ${item.minimized ? 'minimized' : 'running'}`} onClick={() => focusWindow(item.id)} title={app.name}><span>{app.icon}</span>{app.name}</button> : null;
        })}</div>
        <div className="taskbar-tray"><span className="tray-signal">◈</span><span className="tray-date">{date}</span><strong>{clock}</strong></div>
      </footer>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className={mobileTab === 'home' ? 'active' : ''} onClick={() => { setMobileTab('home'); setLauncherOpen(false); setWindows((items) => items.map((item) => ({ ...item, minimized: true }))); }}><span>⌂</span>HOME</button>
        <button className={mobileTab === 'apps' || launcherOpen ? 'active' : ''} onClick={() => { setMobileTab('apps'); setLauncherOpen(true); }}><span>▦</span>APPS</button>
        <div className="mobile-nav-clock">{clock}</div>
      </nav>
    </main>
  );
}
export default App;
