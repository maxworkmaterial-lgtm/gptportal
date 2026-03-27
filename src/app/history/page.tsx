'use client';
import { useState } from 'react';
import ThemedDotGrid from '@/components/ThemedDotGrid';

interface HistoryItem {
  id: string;
  type: 'image' | 'video' | 'text';
  title: string;
  prompt: string;
  model: string;
  cost: number;
  createdAt: string;
  status: 'success' | 'failed' | 'processing';
  details: string;
}

const historyItems: HistoryItem[] = [
  { id: '1', type: 'image', title: 'Баннер для Instagram', prompt: 'Elegant woman in white dress standing on luxury car, cinematic lighting, fashion photography', model: 'Nano Banana Pro', cost: 55, createdAt: 'Сегодня, 15:42', status: 'success', details: '9:16 • 4K • 3072×5504' },
  { id: '2', type: 'text', title: 'Маркетинговая стратегия для стартапа', prompt: 'Напиши маркетинговый план для EdTech стартапа на Q2 2026...', model: 'ChatGPT 5.4', cost: 575, createdAt: 'Сегодня, 15:30', status: 'success', details: '1 247 токенов' },
  { id: '3', type: 'video', title: 'Рилс: городской пейзаж', prompt: 'Cinematic drone shot over a futuristic city at sunset, neon lights, cyberpunk vibes', model: 'Kling 2.6', cost: 100, createdAt: 'Сегодня, 15:15', status: 'success', details: '16:9 • 1080p • 5с' },
  { id: '4', type: 'image', title: 'Логотип для кофейни', prompt: 'Minimalist coffee shop logo, clean lines, warm brown tones', model: 'GPT Image 1.5', cost: 10, createdAt: 'Сегодня, 14:50', status: 'success', details: '1:1 • 2K • 2048×2048' },
  { id: '5', type: 'text', title: 'Рефакторинг API', prompt: 'Помоги рефакторить REST API на Go, нужно перейти на gRPC...', model: 'Gemini 3.1 Pro', cost: 890, createdAt: 'Сегодня, 14:20', status: 'success', details: '3 421 токенов' },
  { id: '6', type: 'video', title: 'Промо для продукта', prompt: 'Product reveal video, luxury watch on marble surface, soft lighting', model: 'Veo 3.1 Fast', cost: 480, createdAt: 'Сегодня, 13:45', status: 'failed', details: 'Ошибка генерации' },
  { id: '7', type: 'image', title: 'Аватар для LinkedIn', prompt: 'Professional headshot, business casual, neutral background', model: 'Nano Banana 2', cost: 24, createdAt: 'Вчера, 22:10', status: 'success', details: '1:1 • 2K • 2048×2048' },
  { id: '8', type: 'text', title: 'Перевод документации', prompt: 'Переведи на английский с сохранением технического стиля...', model: 'GPT-5 Nano', cost: 170, createdAt: 'Вчера, 20:30', status: 'success', details: '845 токенов' },
  { id: '9', type: 'video', title: 'Анимация логотипа', prompt: 'Logo animation, 3D rotation, metallic texture, dark background', model: 'Kling 3.0', cost: 180, createdAt: 'Вчера, 18:00', status: 'success', details: '16:9 • 1080p • 5с' },
  { id: '10', type: 'image', title: 'Фон для презентации', prompt: 'Abstract gradient background, dark blue to purple, minimal geometric shapes', model: 'Grok Imagine', cost: 16, createdAt: 'Вчера, 16:40', status: 'success', details: '16:9 • 2K • 3840×2160' },
];

const typeIcon: Record<string, string> = { image: '🖼️', video: '🎬', text: '💬' };
const typeColor: Record<string, string> = { image: 'bg-amber-500/10 text-amber-400', video: 'bg-purple-500/10 text-purple-400', text: 'bg-blue-500/10 text-blue-400' };
const statusStyle: Record<string, string> = { success: 'bg-emerald-500/10 text-emerald-400', failed: 'bg-red-500/10 text-red-400', processing: 'bg-yellow-500/10 text-yellow-400' };
const statusLabel: Record<string, string> = { success: 'Готово', failed: 'Ошибка', processing: 'В процессе' };

export default function HistoryPage() {
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'text'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? historyItems : historyItems.filter((i) => i.type === filter);

  const totalSpent = historyItems.filter((i) => i.status === 'success').reduce((sum, i) => sum + i.cost, 0);
  const totalImages = historyItems.filter((i) => i.type === 'image' && i.status === 'success').length;
  const totalVideos = historyItems.filter((i) => i.type === 'video' && i.status === 'success').length;
  const totalTexts = historyItems.filter((i) => i.type === 'text' && i.status === 'success').length;

  return (
    <div className="relative min-h-screen">
      <ThemedDotGrid />

      <div className="relative z-10">
        <header className="glass-header flex items-center justify-between px-8 py-4 sticky top-0 z-20">
          <h1 className="text-[15px] font-semibold tracking-wide uppercase" style={{ color: 'var(--t-text-secondary)' }}>История генераций</h1>
          <span className="glass-subtle text-[12px] px-3 py-1.5 rounded-full" style={{ color: 'var(--t-text-muted)' }}>
            ⚡ 3 000
          </span>
        </header>

        <div className="px-8 py-8 max-w-5xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Потрачено', value: `⚡ ${totalSpent.toLocaleString('ru-RU')}`, color: '#d1fe17' },
              { label: 'Изображения', value: totalImages.toString(), color: '#f59e0b' },
              { label: 'Видео', value: totalVideos.toString(), color: '#8b5cf6' },
              { label: 'Текст', value: totalTexts.toString(), color: '#3b82f6' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl glass-card"
              >
                <div className="text-[11px] mb-1" style={{ color: 'var(--t-text-faint)' }}>{stat.label}</div>
                <div className="text-[20px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-5">
            {([['all', 'Все'], ['text', '💬 Текст'], ['image', '🖼️ Фото'], ['video', '🎬 Видео']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-[12px] px-3.5 py-1.5 rounded-full transition ${
                  filter === key ? 'font-semibold' : 'border'
                }`}
                style={
                  filter === key
                    ? { background: 'var(--accent)', color: 'var(--t-accent-text)' }
                    : { background: 'var(--t-badge-bg)', color: 'var(--t-text-muted)', borderColor: 'var(--t-border2)' }
                }
              >
                {label}
              </button>
            ))}
            <span className="text-[11px] ml-auto" style={{ color: 'var(--t-text-faint)' }}>{filtered.length} записей</span>
          </div>

          {/* History list */}
          <div className="glass-strong rounded-2xl overflow-hidden">
            {filtered.map((item, i) => (
              <div key={item.id}>
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 transition text-left"
                  style={{
                    borderBottom:
                      i < filtered.length - 1 && expandedId !== item.id
                        ? '1px solid var(--t-border)'
                        : 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--t-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="text-lg shrink-0">{typeIcon[item.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate" style={{ color: 'var(--t-text-primary)' }}>{item.title}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--t-text-faint)' }}>{item.model} • {item.createdAt}</div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                  <span className="shrink-0 text-[12px] font-mono w-16 text-right" style={{ color: 'var(--t-text-muted)' }}>⚡ {item.cost}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} style={{ color: 'var(--t-text-faint)' }}><path d="M6 9l6 6 6-6"/></svg>
                </button>

                {expandedId === item.id && (
                  <div className="px-5 pb-4" style={{ borderBottom: '1px solid var(--t-border)' }}>
                    <div
                      className="ml-10 p-4 rounded-xl border space-y-2.5"
                      style={{ background: 'var(--t-hover)', borderColor: 'var(--t-border)' }}
                    >
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-faint)' }}>Промпт</span>
                        <p className="text-[12px] mt-1 leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>{item.prompt}</p>
                      </div>
                      <div className="flex items-center gap-4 pt-1">
                        <div>
                          <span className="text-[10px]" style={{ color: 'var(--t-text-faint)' }}>Модель</span>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--t-text-secondary)' }}>{item.model}</p>
                        </div>
                        <div>
                          <span className="text-[10px]" style={{ color: 'var(--t-text-faint)' }}>Детали</span>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--t-text-secondary)' }}>{item.details}</p>
                        </div>
                        <div>
                          <span className="text-[10px]" style={{ color: 'var(--t-text-faint)' }}>Стоимость</span>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--accent)' }}>⚡ {item.cost}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          className="text-[10px] px-3 py-1.5 rounded-lg border transition"
                          style={{ background: 'var(--t-hover)', borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}
                        >
                          📋 Копировать промпт
                        </button>
                        <button
                          className="text-[10px] px-3 py-1.5 rounded-lg border transition"
                          style={{ background: 'var(--t-hover)', borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}
                        >
                          🔄 Повторить
                        </button>
                        {item.type !== 'text' && (
                          <button
                            className="text-[10px] px-3 py-1.5 rounded-lg border transition"
                            style={{ background: 'var(--t-hover)', borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}
                          >
                            ⬇️ Скачать
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
