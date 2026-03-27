'use client';
import { useState } from 'react';
import DotGrid from '@/components/DotGrid';

const plans = [
  {
    name: 'Старт',
    tagline: 'Для тех, кто начинает работать с AI',
    monthlyPrice: 990,
    yearlyPrice: 792,
    yearlySave: 2376,
    credits: '50 000',
    multiplier: null,
    featured: false,
    best: false,
    badge: null,
    ctaClass: 'border border-white/10 text-white/80 hover:bg-white/5',
    progClass: 'bg-[#7c5cff] w-[11%]',
    limits: [
      { model: 'Nano Banana 2', qty: '41 фото' },
      { model: 'Nano Banana Pro', qty: '22 фото' },
      { model: 'GPT Image 1.5', qty: '100 фото' },
      { model: 'Kling 2.6 (5с)', qty: '10 видео' },
      { model: 'Kling 3.0 (5с)', qty: '5 видео' },
      { model: 'ChatGPT 5.2', qty: '74 запроса' },
      { model: 'ChatGPT 5.4', qty: '87 запросов' },
    ],
    mix: '15 NB2 + 3 Kling 2.6 + 40 GPT Image + 25 ChatGPT 5.2',
    features: [
      '⚡ 50 000 кредитов/мес',
      'Все текстовые модели',
      'Генерация фото и видео',
      '3 параллельных запроса',
    ],
  },
  {
    name: 'Про',
    tagline: 'Оптимально для ежедневной работы',
    monthlyPrice: 2490,
    yearlyPrice: 1992,
    yearlySave: 5976,
    credits: '100 000',
    multiplier: '×2 Старта',
    featured: true,
    best: false,
    badge: 'Most Popular',
    ctaClass: 'bg-[#10b981] border-[#10b981] text-white hover:opacity-90',
    progClass: 'bg-[#10b981] w-[22%]',
    limits: [
      { model: 'Nano Banana 2', qty: '83 фото' },
      { model: 'Nano Banana Pro', qty: '45 фото' },
      { model: 'GPT Image 1.5', qty: '200 фото' },
      { model: 'Kling 2.6 (5с)', qty: '20 видео' },
      { model: 'Kling 3.0 (5с)', qty: '11 видео' },
      { model: 'ChatGPT 5.2', qty: '148 запросов' },
      { model: 'ChatGPT 5.4', qty: '174 запроса' },
    ],
    mix: '30 NB2 + 10 NB Pro + 60 GPT Image + 5 Kling 2.6 + 3 Kling 3.0 + 50 ChatGPT 5.2',
    features: [
      '⚡ 100 000 кредитов/мес',
      'Все модели вкл. Veo 3.1 и Kling 3.0',
      'Генерация фото до 4K',
      'Генерация видео до 1080p',
      '5 параллельных запросов',
      'Приоритетная обработка',
    ],
  },
  {
    name: 'Креатор',
    tagline: 'Максимум для продакшна и команд',
    monthlyPrice: 9990,
    yearlyPrice: 7992,
    yearlySave: 23976,
    credits: '450 000',
    multiplier: '×4.5 Старта',
    featured: false,
    best: true,
    badge: '★ Best Value',
    ctaClass: 'bg-gradient-to-r from-[#ec4899] to-[#f97316] border-transparent text-white hover:opacity-90',
    progClass: 'bg-[#ec4899] w-full',
    limits: [
      { model: 'Nano Banana 2', qty: '375 фото' },
      { model: 'Nano Banana Pro', qty: '204 фото' },
      { model: 'GPT Image 1.5', qty: '900 фото' },
      { model: 'Kling 2.6 (5с)', qty: '90 видео' },
      { model: 'Kling 3.0 (5с)', qty: '50 видео' },
      { model: 'ChatGPT 5.2', qty: '669 запросов' },
      { model: 'ChatGPT 5.4', qty: '786 запросов' },
    ],
    mix: '100 NB2 + 50 NB Pro + 200 GPT Image + 20 Kling 2.6 + 10 Kling 3.0 + 5 Veo 3.1 + 150 ChatGPT 5.2',
    features: [
      '⚡ 450 000 кредитов/мес',
      'Все модели без ограничений',
      '4K фото и видео вкл. Veo 3.1 4K',
      '10 параллельных запросов',
      'Максимальный приоритет',
    ],
  },
];

const topups = [
  { credits: '20 000', price: '200 ₽', examples: ['16 NB2 фото', '4 Kling 2.6', '29 ChatGPT 5.2'], best: false },
  { credits: '30 000', price: '300 ₽', examples: ['25 NB2 фото', '6 Kling 2.6', '44 ChatGPT 5.2'], best: false },
  { credits: '60 000', price: '600 ₽', examples: ['50 NB2 фото', '12 Kling 2.6', '89 ChatGPT 5.2'], best: false },
  { credits: '200 000', price: '2 000 ₽', examples: ['166 NB2 фото', '40 Kling 2.6', '297 ChatGPT 5.2'], best: false },
  { credits: '500 000', price: '5 000 ₽', examples: ['416 NB2 фото', '100 Kling 2.6', '744 ChatGPT 5.2'], best: true },
  { credits: '1 000 000', price: '10 000 ₽', examples: ['833 NB2 фото', '200 Kling 2.6', '1 488 ChatGPT 5.2'], best: false },
];

const faqs = [
  { q: 'Что такое ⚡?', a: '⚡ — внутренняя валюта GPT Portal. Одно сообщение в лёгкой модели (GPT-5 Nano) стоит 170 ⚡, в мощной (ChatGPT 5.2) — 672 ⚡. Фото — от 500 ⚡ (GPT Image) до 2 200 ⚡ (Nano Banana Pro). Видео — от 5 000 ⚡ (Kling 2.6) до 48 000 ⚡ (Veo 3.1 4K).' },
  { q: '3 000 ⚡ за регистрацию — на что хватит?', a: '3 000 ⚡ = 30₽. Хватит на ~17 сообщений GPT-5 Nano, или 6 фото GPT Image 1.5, или 2 фото Nano Banana 2.' },
  { q: 'Чем отличаются тарифы?', a: 'Количеством ⚡, числом параллельных запросов и приоритетом обработки. Все модели доступны на всех тарифах.' },
  { q: 'Сгорают ли ⚡?', a: '⚡ подписки действуют в течение месяца, неиспользованные не переносятся. ⚡ из пополнения — бессрочные.' },
  { q: 'Можно ли без подписки?', a: 'Да. Пополните ⚡ разово. Стоимость операций одинакова. Подписка даёт больше ⚡ за рубль и приоритет обработки.' },
  { q: 'Как оплатить?', a: 'СБП, банковские карты РФ, ЮMoney. VPN не нужен.' },
  { q: 'Какие модели доступны?', a: 'Текст: ChatGPT 5.2, 5.4, GPT-5 Nano, GPT-4o, Gemini 3.1 Pro, Grok 4. Фото: Nano Banana 2/Pro, GPT Image 1.5, Grok Imagine. Видео: Kling 2.6/3.0, Veo 3.0/3.1, Grok Video.' },
];

function formatNum(n: number) {
  return n.toLocaleString('ru-RU');
}

export default function PricingPage() {
  const [period, setPeriod] = useState<'m' | 'y'>('m');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen">
      <DotGrid dotSize={2} gap={20} baseColor="#232323" activeColor="#d1fe17" proximity={50} shockRadius={100} shockStrength={1} maxSpeed={6000} resistance={100} returnDuration={0.1} />

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-header flex items-center justify-between px-8 py-4 sticky top-0 z-20">
          <h1 className="text-[15px] font-semibold text-white/70 tracking-wide uppercase">Тарифы</h1>
        </header>

        {/* Hero */}
        <section className="text-center pt-12 pb-2 px-8">
          <h2 className="text-[clamp(24px,4.5vw,38px)] font-bold tracking-tight mb-1.5">Все нейросети. Одна подписка.</h2>
          <p className="text-[14px] text-white/40">ChatGPT 5.2, Nano Banana, Kling, Veo, Grok — 20+ моделей</p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/40">💳 <b className="text-[#22c55e]">СБП и карты РФ</b></span>
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/40">🔓 <b className="text-[#22c55e]">Без VPN</b></span>
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/40">🎁 <b className="text-[#22c55e]">3 000 ⚡ за регистрацию</b></span>
          </div>
        </section>

        {/* Period toggle */}
        <div className="flex justify-center py-6">
          <div className="inline-flex bg-[#0e0e17] border border-white/8 rounded-full p-1">
            <button onClick={() => setPeriod('m')} className={`px-5 py-2 rounded-full text-[13px] font-medium transition ${period === 'm' ? 'bg-[#d1fe17] text-black' : 'text-white/40'}`}>Месяц</button>
            <button onClick={() => setPeriod('y')} className={`px-5 py-2 rounded-full text-[13px] font-medium transition flex items-center gap-1.5 ${period === 'y' ? 'bg-[#d1fe17] text-black' : 'text-white/40'}`}>
              Год <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e]">−20%</span>
            </button>
          </div>
        </div>

        {/* Lite plan */}
        <div className="max-w-[600px] mx-auto mb-5 px-4">
          <div className="glass rounded-2xl px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-[13px]"><b className="text-[#a78bfa]">⚡ Лайт — 7 дней</b><br /><span className="text-[11px] text-white/40">10 000 ⚡ • все модели • 2 параллельных запроса</span></div>
            <div className="text-[20px] font-bold">199 ₽ <span className="text-[12px] text-white/30 font-normal">/ 7 дней</span></div>
          </div>
        </div>

        {/* Plans grid */}
        <section className="max-w-[1100px] mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const price = period === 'y' ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-6 flex flex-col transition ${
                    plan.featured
                      ? 'glass-strong border border-[#10b981] shadow-[0_0_50px_rgba(16,185,129,0.05)]'
                      : plan.best
                      ? 'glass-strong border border-[#ec4899] shadow-[0_0_50px_rgba(236,72,153,0.04)]'
                      : 'glass-card hover:border-white/15'
                  }`}
                >
                  {plan.badge && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider whitespace-nowrap ${
                      plan.featured ? 'bg-[#10b981] text-white' : 'bg-gradient-to-r from-[#ec4899] to-[#f97316] text-white'
                    }`}>
                      {plan.badge}
                    </span>
                  )}

                  <div className="text-[20px] font-bold">{plan.name}</div>
                  <div className="text-[12px] text-white/30 mb-3.5">{plan.tagline}</div>

                  {period === 'y' && (
                    <div className="text-[13px] text-white/30 line-through">{formatNum(plan.monthlyPrice)} ₽</div>
                  )}
                  <div className="text-[34px] font-bold tracking-tight leading-tight">
                    <span className="text-[17px] text-white/40">₽</span>{formatNum(price)} <span className="text-[13px] font-normal text-white/30">/мес</span>
                  </div>
                  {period === 'y' && (
                    <div className="text-[11px] text-[#22c55e] mt-1">Экономия {formatNum(plan.yearlySave)} ₽/год</div>
                  )}

                  <button className={`w-full py-3 rounded-xl text-[14px] font-semibold mt-4 mb-4 transition ${plan.ctaClass}`}>
                    Выбрать план
                  </button>

                  {/* Credits box */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[rgba(124,92,255,0.08)] border border-[rgba(124,92,255,0.12)] mb-2">
                    <span className="text-[20px] font-bold text-[#a78bfa] whitespace-nowrap">{plan.credits} ⚡</span>
                    <span className="text-[11px] text-white/40">кредитов/мес</span>
                    {plan.multiplier && (
                      <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        plan.featured ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#ec4899]/8 text-[#ec4899]'
                      }`}>{plan.multiplier}</span>
                    )}
                  </div>

                  {/* Usage breakdown */}
                  <div className="bg-[#141420] border border-white/5 rounded-xl p-3.5 mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">На что хватит</div>
                    {plan.limits.map((l) => (
                      <div key={l.model} className="flex justify-between py-0.5 text-[12px]">
                        <span className="text-white/40">{l.model}</span>
                        <span className="text-[#a78bfa] font-semibold">{l.qty}</span>
                      </div>
                    ))}
                    <div className="h-[3px] bg-white/5 rounded-full mt-2 mb-3 overflow-hidden">
                      <div className={`h-full rounded-full ${plan.progClass}`} />
                    </div>
                    <div className="text-[11px] text-white/30 border-t border-white/5 pt-2 leading-relaxed">
                      🔥 <b className="text-white/50">Микс:</b> {plan.mix}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-[12px] text-white/70 flex items-start gap-1.5">
                        <span className="text-[#22c55e] font-bold text-[11px]">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top-up section */}
        <section className="max-w-[860px] mx-auto px-4 mb-12">
          <h2 className="text-[20px] font-bold text-center mb-1">Пополнить ⚡</h2>
          <p className="text-[12px] text-white/40 text-center mb-5">Дополнительные ⚡ не сгорают. Доступно подписчикам.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topups.map((t) => (
              <div key={t.credits} className={`relative text-center p-4 rounded-2xl glass-card transition hover:border-white/15 ${t.best ? '!border-[#f59e0b]' : ''}`}>
                {t.best && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-black text-[10px] font-bold px-3 py-0.5 rounded-full">Выгодно</span>
                )}
                <div className="text-[20px] font-bold text-[#a78bfa]">{t.credits} ⚡</div>
                <div className="text-[10px] text-white/30">кредитов</div>
                <div className="text-[16px] font-semibold mt-1.5">{t.price}</div>
                <div className="text-[10px] text-white/40 mt-1.5 leading-relaxed">
                  {t.examples.map((ex, i) => (
                    <span key={i}>≈ <b className="text-white/70">{ex.split(' ')[0]}</b> {ex.split(' ').slice(1).join(' ')}{i < t.examples.length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-[680px] mx-auto px-4 mb-12">
          <h2 className="text-[20px] font-bold text-center mb-5">Частые вопросы</h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/5">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-3.5 text-left text-[13.5px] font-medium text-white/80 hover:text-[#a78bfa] transition">
                  {faq.q}
                  <span className={`text-white/30 text-[13px] transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-[300px]' : 'max-h-0'}`}>
                  <p className="pb-3 text-[12.5px] text-white/40 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-7 border-t border-white/5 text-[10px] text-white/20">
          GPT Portal — AI-агрегатор. Оплата в рублях, без VPN. Все модели через официальные API.
        </footer>
      </div>
    </div>
  );
}
