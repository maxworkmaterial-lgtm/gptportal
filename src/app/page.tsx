'use client';
import ThemedDotGrid from '@/components/ThemedDotGrid';
import ModelCard from '@/components/ModelCard';
import TemplateCard from '@/components/TemplateCard';

const topModels = [
  { name: 'ChatGPT 5.4', icon: '🟢', color: 'linear-gradient(135deg, #10a37f, #0d8c6d)', isNew: true },
  { name: 'Nano Banana Pro', icon: '🍌', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  { name: 'Kling Motion Control Pro', icon: '🎬', color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { name: 'Топовые Шаблоны', icon: '📋', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  { name: 'Генерация Видео', icon: '🎥', color: 'linear-gradient(135deg, #ec4899, #db2777)' },
  { name: 'Генерация Изображений', icon: '🖼️', color: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { name: 'Все Нейронки', icon: '🧠', color: 'linear-gradient(135deg, #6366f1, #4f46e5)', badge: '50+' },
];

const templates = [
  { title: 'Рилс для бизнеса с хуком', description: 'Генерируй вирусные рилс-скрипты с цепляющим хуком за 30 секунд', image: '', category: 'Видео', views: '2.4M' },
  { title: 'Продающий пост для Telegram', description: 'Создай продающий пост с триггерами и CTA для Telegram-канала', image: '', category: 'Текст', views: '1.8M' },
  { title: 'Фото товара в стиле Apple', description: 'Профессиональные фото продуктов на минималистичном фоне', image: '', category: 'Фото', views: '3.1M' },
  { title: 'AI-аватар для соцсетей', description: 'Создай профессиональный аватар в любом стиле за секунды', image: '', category: 'Фото', views: '5.2M' },
];

const allModels = [
  { name: 'ChatGPT 5.4', type: 'Текст', icon: '🟢', color: '#10a37f', credits: '575 ⚡', speed: 'Быстро' },
  { name: 'ChatGPT 5.2', type: 'Текст', icon: '🟢', color: '#10a37f', credits: '672 ⚡', speed: 'Быстро' },
  { name: 'GPT-5 Nano', type: 'Текст', icon: '⚡', color: '#10a37f', credits: '170 ⚡', speed: 'Мгновенно' },
  { name: 'GPT-5 Mini', type: 'Текст', icon: '🔵', color: '#3b82f6', credits: '340 ⚡', speed: 'Быстро' },
  { name: 'GPT-4o', type: 'Текст', icon: '🟣', color: '#8b5cf6', credits: '450 ⚡', speed: 'Быстро' },
  { name: 'Gemini 3.1 Pro', type: 'Текст', icon: '💎', color: '#4285f4', credits: '890 ⚡', speed: 'Средне' },
  { name: 'Gemini 2.5 Pro', type: 'Текст', icon: '💎', color: '#4285f4', credits: '750 ⚡', speed: 'Быстро' },
  { name: 'Gemini 3 Flash', type: 'Текст', icon: '⚡', color: '#4285f4', credits: '200 ⚡', speed: 'Мгновенно' },
  { name: 'Grok 4', type: 'Текст', icon: '🅧', color: '#1d9bf0', credits: '960 ⚡', speed: 'Средне' },
  { name: 'Grok 4 Fast', type: 'Текст', icon: '🅧', color: '#1d9bf0', credits: '480 ⚡', speed: 'Быстро' },
  { name: 'Nano Banana 2', type: 'Фото', icon: '🍌', color: '#fbbf24', credits: '1 200 ⚡', speed: 'Быстро' },
  { name: 'Nano Banana Pro', type: 'Фото', icon: '🍌', color: '#f59e0b', credits: '2 200 ⚡', speed: 'Средне' },
  { name: 'GPT Image 1.5', type: 'Фото', icon: '🎨', color: '#10a37f', credits: '500 ⚡', speed: 'Быстро' },
  { name: 'Grok Imagine', type: 'Фото', icon: '🅧', color: '#1d9bf0', credits: '800 ⚡', speed: 'Быстро' },
  { name: 'Kling 2.6', type: 'Видео', icon: '🎬', color: '#8b5cf6', credits: '5 000 ⚡', speed: '~2 мин' },
  { name: 'Kling 3.0', type: 'Видео', icon: '🎬', color: '#6d28d9', credits: '9 000 ⚡', speed: '~3 мин' },
  { name: 'Veo 3.0', type: 'Видео', icon: '▶️', color: '#4285f4', credits: '15 000 ⚡', speed: '~5 мин' },
  { name: 'Veo 3.1 Fast', type: 'Видео', icon: '▶️', color: '#34a853', credits: '24 000 ⚡', speed: '~3 мин' },
  { name: 'Veo 3.1 Standard', type: 'Видео', icon: '▶️', color: '#ea4335', credits: '48 000 ⚡', speed: '~8 мин' },
  { name: 'Grok Video', type: 'Видео', icon: '🅧', color: '#1d9bf0', credits: '12 000 ⚡', speed: '~4 мин' },
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ThemedDotGrid />

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-header flex items-center justify-between px-8 py-4 sticky top-0 z-20">
          <h1 className="text-[15px] font-semibold tracking-wide uppercase" style={{ color: 'var(--t-text-heading)' }}>Дашборд</h1>
          <div className="flex items-center gap-3">
            <span className="glass-subtle text-[12px] px-3 py-1.5 rounded-full" style={{ color: 'var(--t-text-muted)' }}>
              ⚡ 3 000
            </span>
            <button className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition" style={{ background: 'var(--accent)', color: 'var(--t-accent-text)' }}>
              ТОПАП
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="px-8 pt-12 pb-8 text-center max-w-3xl mx-auto">
          <h2 className="text-[clamp(28px,4vw,42px)] font-bold leading-tight tracking-tight mb-3" style={{ color: 'var(--t-text-primary)' }}>
            Поможем улучшить ваш контент{' '}
            <br />
            при помощи <span className="text-gradient">нейросетей</span>
          </h2>
          <p className="text-[14px] mb-8" style={{ color: 'var(--t-text-muted)' }}>
            Без VPN, сложностей и с оплатой по СБП!
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3">
              <span style={{ color: 'var(--t-text-faint)' }}>✨</span>
              <input
                type="text"
                placeholder="Что сегодня в повестке дня?"
                className="flex-1 bg-transparent text-[14px] outline-none"
                style={{ color: 'var(--t-text-primary)' }}
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#10a37f]/15 text-[#10a37f] font-medium border border-[#10a37f]/20">
                  ● ChatGPT 5.4
                </span>
                <button style={{ color: 'var(--t-text-muted)' }} className="hover:opacity-80 transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            {['📎 Файл', '🖼️ Фото', '🎬 Видео'].map((a) => (
              <button key={a} className="text-[11px] px-3 py-1.5 rounded-full transition border"
                style={{ background: 'var(--t-badge-bg)', color: 'var(--t-text-secondary)', borderColor: 'var(--t-border)' }}>
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* Top models carousel */}
        <section className="px-8 pb-10">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 max-w-4xl mx-auto">
            {topModels.map((m) => (
              <ModelCard key={m.name} name={m.name} icon={m.icon} color={m.color} badge={m.badge} isNew={m.isNew} />
            ))}
          </div>
        </section>

        {/* Templates */}
        <section className="px-8 pb-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[20px] font-bold" style={{ color: 'var(--t-text-primary)' }}>Топовые Шаблоны</h3>
              <p className="text-[12px] mt-1" style={{ color: 'var(--t-text-muted)' }}>Созданы командой ГПТ / Портала и набирают миллионы просмотров!</p>
            </div>
            <button className="text-[12px] hover:underline" style={{ color: 'var(--accent)' }}>Все шаблоны →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((t) => (
              <TemplateCard key={t.title} {...t} />
            ))}
          </div>
        </section>

        {/* What's trending */}
        <section className="px-8 pb-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-bold" style={{ color: 'var(--t-text-primary)' }}>Что сегодня в повестке дня?</h3>
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {['ChatGPT 5.4 — новая флагманская модель', 'Nano Banana Pro — генерация фото в 4K', 'Kling 3.0 — видео нового поколения', 'Veo 3.1 — Google видео AI'].map((item) => (
                <div key={item} className="flex-shrink-0 px-4 py-2.5 rounded-xl text-[12px] transition cursor-pointer border"
                  style={{ background: 'var(--t-hover)', borderColor: 'var(--t-border2)', color: 'var(--t-text-secondary)' }}>
                  🔥 {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All models table */}
        <section className="px-8 pb-16 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 mt-6">
            <h3 className="text-[20px] font-bold" style={{ color: 'var(--t-text-primary)' }}>Все Нейросети</h3>
            <div className="flex gap-2">
              {['Все', 'Текст', 'Фото', 'Видео'].map((tab) => (
                <button
                  key={tab}
                  className="text-[12px] px-3.5 py-1.5 rounded-full transition border"
                  style={tab === 'Все'
                    ? { background: 'var(--accent)', color: 'var(--t-accent-text)', fontWeight: 600, borderColor: 'transparent' }
                    : { background: 'var(--t-badge-bg)', color: 'var(--t-text-secondary)', borderColor: 'var(--t-border2)' }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--t-border)' }}>
                  <th className="text-left text-[11px] font-medium uppercase tracking-wider px-5 py-3" style={{ color: 'var(--t-text-muted)' }}>Модель</th>
                  <th className="text-left text-[11px] font-medium uppercase tracking-wider px-5 py-3" style={{ color: 'var(--t-text-muted)' }}>Тип</th>
                  <th className="text-left text-[11px] font-medium uppercase tracking-wider px-5 py-3" style={{ color: 'var(--t-text-muted)' }}>Стоимость</th>
                  <th className="text-left text-[11px] font-medium uppercase tracking-wider px-5 py-3" style={{ color: 'var(--t-text-muted)' }}>Скорость</th>
                  <th className="text-right text-[11px] font-medium uppercase tracking-wider px-5 py-3" style={{ color: 'var(--t-text-muted)' }}></th>
                </tr>
              </thead>
              <tbody>
                {allModels.map((m) => (
                  <tr key={m.name} className="transition group" style={{ borderBottom: '1px solid var(--t-border)' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: m.color + '22' }}>
                          {m.icon}
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: 'var(--t-text-primary)' }}>{m.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        m.type === 'Текст' ? 'bg-blue-500/10 text-blue-400' :
                        m.type === 'Фото' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-mono" style={{ color: 'var(--t-text-secondary)' }}>{m.credits}</td>
                    <td className="px-5 py-3.5 text-[12px]" style={{ color: 'var(--t-text-muted)' }}>{m.speed}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition opacity-0 group-hover:opacity-100"
                        style={{ background: 'var(--t-badge-bg)', color: 'var(--t-text-secondary)' }}>
                        Попробовать
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
