import { GuideCard as GuideCardType } from '@/types';

const resourceTypeBadge: Record<string, { label: string; color: string }> = {
  site: { label: 'Site', color: 'bg-blue-50 text-blue-700' },
  app: { label: 'App', color: 'bg-green-50 text-green-700' },
  article: { label: 'Article', color: 'bg-purple-50 text-purple-700' },
  officiel: { label: 'Officiel', color: 'bg-red-50 text-red-700' },
};

type GuideCardProps = {
  card: GuideCardType;
};

export default function GuideCard({ card }: GuideCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{card.icon}</span>
        <h3 className="text-lg font-semibold text-[#222] leading-snug">{card.title}</h3>
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{card.description}</p>

      {/* Tips */}
      <div className="mt-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Conseils
        </span>
        <ul className="mt-2 flex flex-col gap-1.5">
          {card.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      {card.resources.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Liens utiles
          </span>
          <ul className="mt-2 flex flex-col gap-2">
            {card.resources.map((resource, i) => {
              const badge = resourceTypeBadge[resource.type];
              return (
                <li key={i}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-[#FF385C]"
                  >
                    {badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    )}
                    <span className="flex-1 truncate">{resource.title}</span>
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-colors group-hover:text-[#FF385C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
