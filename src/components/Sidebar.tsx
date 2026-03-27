'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

const navItems = [
  { label: 'Дашборд', href: '/', icon: '⌘' },
  { label: 'Шаблоны', href: '/templates', icon: '📋' },
  { label: 'Мои папки', href: '/folders', icon: '📁' },
];

const generators = [
  { label: 'Текст', href: '/chat', icon: '💬' },
  { label: 'Видео', href: '/video', icon: '🎬' },
  { label: 'Изображения', href: '/images', icon: '🖼️' },
];

const accountItems = [
  { label: 'Пополнить баланс', href: '/pricing', icon: '⚡' },
  { label: 'История генераций', href: '/history', icon: '📊' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col z-40 border-r transition-colors duration-300"
      style={{ background: 'color-mix(in srgb, var(--t-sidebar) 85%, transparent)', backdropFilter: 'blur(24px) saturate(1.2)', WebkitBackdropFilter: 'blur(24px) saturate(1.2)', borderColor: 'var(--t-glass-border)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <span className="text-black font-bold text-sm">⚡</span>
        </div>
        <span className="font-bold text-[15px] tracking-tight" style={{ color: 'var(--t-text-primary)' }}>
          ГПТ <span style={{ color: 'var(--t-text-secondary)' }} className="font-normal">/Портал</span>
        </span>
        <button
          onClick={toggleTheme}
          className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
          style={{ background: 'var(--t-hover)' }}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--t-text-secondary)' }}>
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--t-text-secondary)' }}>
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-6 mt-2">
        {/* Main nav */}
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-muted)' }}>Главное</p>
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all"
              style={{
                background: pathname === item.href ? 'var(--t-active)' : 'transparent',
                color: pathname === item.href ? 'var(--t-text-primary)' : 'var(--t-text-secondary)',
                fontWeight: pathname === item.href ? 500 : 400,
              }}
            >
              <span className="text-sm w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Generators */}
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-muted)' }}>Генерация</p>
          {generators.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all"
              style={{
                background: pathname === item.href ? 'var(--t-active)' : 'transparent',
                color: pathname === item.href ? 'var(--t-text-primary)' : 'var(--t-text-secondary)',
                fontWeight: pathname === item.href ? 500 : 400,
              }}
            >
              <span className="text-sm w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Account */}
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-muted)' }}>Аккаунт</p>
          {accountItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all"
              style={{
                background: pathname === item.href ? 'var(--t-active)' : 'transparent',
                color: pathname === item.href ? 'var(--t-text-primary)' : 'var(--t-text-secondary)',
                fontWeight: pathname === item.href ? 500 : 400,
              }}
            >
              <span className="text-sm w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-5 space-y-2">
        <Link
          href="/pricing"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[13px] font-semibold transition"
          style={{ background: 'var(--accent)', color: 'var(--t-accent-text)' }}
        >
          ⚡ Выбрать тариф
        </Link>
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[13px] font-medium transition"
          style={{ border: '1px solid var(--t-border2)', color: 'var(--t-text-secondary)', background: 'transparent' }}
        >
          🚪 Войти
        </Link>
      </div>
    </aside>
  );
}
