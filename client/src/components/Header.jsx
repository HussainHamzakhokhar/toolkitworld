import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Menu, Search, X } from 'lucide-react';
import Logo from './Logo';
import SearchDialog from './SearchDialog';

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/tools/', label: 'All Tools' },
  { to: '/calculators/', label: 'Calculators' },
  { to: '/pdf-tools/', label: 'PDF Tools' },
  { to: '/image-tools/', label: 'Image Tools' },
  { to: '/text-tools/', label: 'Text Tools' },
  { to: '/blog/', label: 'Blog' },
  { to: '/about/', label: 'About' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { document.body.classList.toggle('no-scroll', menuOpen); }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Logo />
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} id="main-nav" aria-label="Main">
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search tools (Ctrl+K)">
            <Search aria-hidden="true" />
            <span className="search-trigger__label">Search</span>
            <kbd className="search-trigger__kbd">Ctrl K</kbd>
          </button>
          <button
            className="icon-btn menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
