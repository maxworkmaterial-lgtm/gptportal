'use client';
import { useState } from 'react';
import ThemedDotGrid from '@/components/ThemedDotGrid';

interface FolderItem {
  id: string;
  type: 'image' | 'video' | 'text';
  title: string;
  model: string;
  createdAt: string;
  cost: number;
}

const imageItems: FolderItem[] = [
  { id: 'i1', type: 'image', title: 'Баннер для Instagram', model: 'Nano Banana Pro', createdAt: 'Сегодня, 15:42', cost: 55 },
  { id: 'i2', type: 'image', title: 'Логотип для кофейни', model: 'GPT Image 1.5', createdAt: 'Сегодня, 14:50', cost: 10 },
  { id: 'i3', type: 'image', title: 'Аватар для LinkedIn', model: 'Nano Banana 2', createdAt: 'Вчера, 22:10', cost: 24 },
  { id: 'i4', type: 'image', title: 'Фон для презентации', model: 'Grok Imagine', createdAt: 'Вчера, 16:40', cost: 16 },
  { id: 'i5', type: 'image', title: 'Обложка для VK', model: 'GPT Image 1.5', createdAt: '25 мар, 18:20', cost: 10 },
  { id: 'i6', type: 'image', title: 'Визуалы для постов', model: 'Nano Banana Pro', createdAt: '23 мар, 15:30', cost: 55 },
  { id: 'i7', type: 'image', title: 'Иконки для приложения', model: 'Nano Banana 2', createdAt: '22 мар, 11:00', cost: 24 },
  { id: 'i8', type: 'image', title: 'Мокап для лендинга', model: 'Nano Banana Pro', createdAt: '21 мар, 09:15', cost: 55 },
];

const videoItems: FolderItem[] = [
  { id: 'v1', type: 'video', title: 'Рилс: городской пейзаж', model: 'Kling 2.6', createdAt: 'Сегодня, 15:15', cost: 100 },
  { id: 'v2', type: 'video', title: 'Анимация логотипа', model: 'Kling 3.0', createdAt: 'Вчера, 18:00', cost: 180 },
  { id: 'v3', type: 'video', title: 'Поздравление с ДР', model: 'Veo 3.0', createdAt: '25 мар, 14:30', cost: 300 },
  { id: 'v4', type: 'video', title: 'Рилс для TikTok', model: 'Kling 2.6', createdAt: '24 мар, 13:50', cost: 100 },
  { id: 'v5', type: 'video', title: 'Промо ролик продукта', model: 'Veo 3.1 Fast', createdAt: '22 мар, 10:20', cost: 480 },
];

const textItems: FolderItem[] = [
  { id: 't1', type: 'text', title: 'Маркетинговая стратегия для стартапа', model: 'ChatGPT 5.4', createdAt: 'Сегодня, 15:30', cost: 575 },
  { id: 't2', type: 'text', title: 'Рефакторинг API на Go', model: 'Gemini 3.1 Pro', createdAt: 'Сегодня, 14:20', cost: 890 },
  { id: 't3', type: 'text', title: 'Перевод документации', model: 'GPT-5 Nano', createdAt: 'Вчера, 20:30', cost: 170 },
  { id: 't4', type: 'text', title: 'Рекламный текст для Stories', model: 'ChatGPT 5.4', createdAt: 'Вчера, 14:15', cost: 575 },
  { id: 't5', type: 'text', title: 'Техническое задание v2', model: 'Gemini 3.1 Pro', createdAt: '25 мар, 16:00', cost: 890 },
  { id: 't6', type: 'text', title: 'Посты на март', model: 'ChatGPT 5.4', createdAt: '24 мар, 10:00', cost: 575 },
];

type TabKey = 'image' | 'video' | 'text';

const tabs: { key: TabKey; label: string; icon: string; color: string; accentBg: string }[] = [
  { key: 'image', label: 'Изображения', icon: '🖼️', color: '#f59e0b', accentBg: 'bg-amber-500/10' },
  { key: 'video', label: 'Видео', icon: '🎬', color: '#8b5cf6', accentBg: 'bg-purple-500/10' },
  { key: 'text', label: 'Тексты', icon: '💬', color: '#3b82f6', accentBg: 'bg-blue-500/10' },
];

const allItems: Record<TabKey, FolderItem[]> = {
  image: imageItems,
  video: videoItems,
  text: textItems,
};

export default function FoldersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('image');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const items = allItems[activeTab];
  const activeTabData = tabs.find((t) => t.key === activeTab)!;

  return (
    <div className="relative min-h-screen">
      <ThemedDotGrid />

      <div className="relative z-10">
        <header className="glass-header flex items-center justify-between px-8 py-4 sticky top-0 z-20">
          <h1 className="text-[15px] font-semibold tracking-wide uppercase" style={{ color: 'var(--t-text-secondary)' }}>Мои папки</h1>
          <span className="glass-subtle text-[12px] px-3 py-1.5 rounded-full" style={{ color: 'var(--t-text-muted)' }}>⚡ 3 000</span>
        </header>

        <div className="px-8 py-8 max-w-5xl mx-auto">
          {/* Category cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group text-left p-5 rounded-2xl transition ${activeTab === tab.key ? 'glass-strong' : 'glass-card'}`}
                style={{
                  borderColor: activeTab === tab.key ? 'var(--t-border2)' : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: tab.color + '15' }}>
                    {tab.icon}
                  </div>
                  {activeTab === tab.key && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: tab.color }} />
                  )}
                </div>
                <h3
                  className="text-[15px] font-semibold mb-1 transition"
                  style={{ color: activeTab === tab.key ? 'var(--t-text-primary)' : 'var(--t-text-secondary)' }}
                >
                  {tab.label}
                </h3>
                <span className="text-[12px]" style={{ color: 'var(--t-text-faint)' }}>{allItems[tab.key].length} файлов</span>
              </button>
            ))}
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-lg">{activeTabData.icon}</span>
              <h2 className="text-[16px] font-semibold" style={{ color: 'var(--t-text-secondary)' }}>{activeTabData.label}</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: 'var(--t-text-faint)', background: 'var(--t-badge-bg)' }}>{items.length}</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg p-0.5 border" style={{ background: 'var(--t-badge-bg)', borderColor: 'var(--t-border2)' }}>
              <button
                onClick={() => setView('grid')}
                className="p-1.5 rounded-md transition"
                style={{
                  background: view === 'grid' ? 'var(--t-active)' : 'transparent',
                  color: view === 'grid' ? 'var(--t-text-secondary)' : 'var(--t-text-faint)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button
                onClick={() => setView('list')}
                className="p-1.5 rounded-md transition"
                style={{
                  background: view === 'list' ? 'var(--t-active)' : 'transparent',
                  color: view === 'list' ? 'var(--t-text-secondary)' : 'var(--t-text-faint)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Content */}
          {view === 'list' ? (
            <div className="glass-strong rounded-2xl overflow-hidden">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-3.5 transition cursor-pointer"
                  style={{
                    borderBottom: i < items.length - 1 ? '1px solid var(--t-border)' : 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--t-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span className="text-lg">{activeTabData.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate" style={{ color: 'var(--t-text-secondary)' }}>{item.title}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--t-text-faint)' }}>{item.model} • {item.createdAt}</div>
                  </div>
                  <span className="text-[12px] font-mono" style={{ color: 'var(--t-text-muted)' }}>⚡ {item.cost}</span>
                  <div className="flex items-center gap-1.5">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center transition border" style={{ background: 'var(--t-badge-bg)', borderColor: 'var(--t-border2)', color: 'var(--t-text-faint)' }} title="Скачать">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center transition border" style={{ background: 'var(--t-badge-bg)', borderColor: 'var(--t-border2)', color: 'var(--t-text-faint)' }} title="Удалить">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-3 ${activeTab === 'text' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-2xl glass-card transition cursor-pointer"
                >
                  {activeTab === 'text' ? (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg shrink-0">💬</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate" style={{ color: 'var(--t-text-secondary)' }}>{item.title}</div>
                        <div className="text-[10px] mt-1" style={{ color: 'var(--t-text-faint)' }}>{item.model} • {item.createdAt}</div>
                      </div>
                      <span className="text-[11px] font-mono shrink-0" style={{ color: 'var(--t-text-muted)' }}>⚡ {item.cost}</span>
                    </div>
                  ) : (
                    <>
                      <div className="aspect-square rounded-xl flex items-center justify-center text-3xl mb-3 overflow-hidden" style={{ background: 'var(--t-hover)' }}>
                        {activeTab === 'image' ? (
                          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${activeTabData.color}10, ${activeTabData.color}05)` }}>
                            <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">🖼️</div>
                          </div>
                        ) : (
                          <div className="w-full h-full relative" style={{ background: `linear-gradient(135deg, ${activeTabData.color}10, ${activeTabData.color}05)` }}>
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--t-badge-bg)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--t-text-faint)' }}><polygon points="6 3 20 12 6 21"/></svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-[12px] font-medium truncate" style={{ color: 'var(--t-text-secondary)' }}>{item.title}</div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px]" style={{ color: 'var(--t-text-faint)' }}>{item.model}</span>
                        <span className="text-[9px] font-mono" style={{ color: 'var(--t-text-faint)' }}>⚡ {item.cost}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
