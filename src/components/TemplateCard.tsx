interface TemplateCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  views: string;
}

export default function TemplateCard({ title, description, image, category, views }: TemplateCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all cursor-pointer glass-card">
      <div className="aspect-video overflow-hidden" style={{ background: 'var(--t-hover)' }}>
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}>
            {category}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--t-text-muted)' }}>{views} просмотров</span>
        </div>
        <h3 className="text-[14px] font-semibold mb-1 truncate" style={{ color: 'var(--t-text-primary)' }}>{title}</h3>
        <p className="text-[12px] line-clamp-2" style={{ color: 'var(--t-text-secondary)' }}>{description}</p>
      </div>
    </div>
  );
}
