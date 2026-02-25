import { GuideCard } from '@/types';
import { countryGuideCards, universalGuides, destinations } from '@/data/guides';

const resourceTypeBadge: Record<string, { label: string; color: string }> = {
  site: { label: 'Site', color: 'bg-blue-50 text-blue-700' },
  app: { label: 'App', color: 'bg-green-50 text-green-700' },
  article: { label: 'Article', color: 'bg-purple-50 text-purple-700' },
  officiel: { label: 'Officiel', color: 'bg-red-50 text-red-700' },
};

type CountryArticleProps = {
  country: string;
};

function GuideSection({ card, index }: { card: GuideCard; index: number }) {
  return (
    <section
      className="card-animate"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl">
          {card.icon}
        </span>
        <h3 className="text-xl font-bold text-[#222]">{card.title}</h3>
      </div>

      {/* Description */}
      <p className="text-base leading-relaxed text-gray-600 mb-5">
        {card.description}
      </p>

      {/* Tips */}
      <ul className="flex flex-col gap-3 mb-5">
        {card.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] text-gray-700">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
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

      {/* Resources */}
      {card.resources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {card.resources.map((resource, i) => {
            const badge = resourceTypeBadge[resource.type];
            return (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-all hover:border-[#FF385C] hover:text-[#FF385C] hover:shadow-sm"
              >
                {badge && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${badge.color}`}>
                    {badge.label}
                  </span>
                )}
                <span>{resource.title}</span>
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function CountryArticle({ country }: CountryArticleProps) {
  const cards = countryGuideCards[country] || [];
  const destInfo = destinations.find((d) => d.country === country);

  if (cards.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Article header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[#222] sm:text-4xl">
          {destInfo?.flag} Guide complet : {country}
        </h1>
        <p className="mt-3 text-lg text-gray-500 leading-relaxed">
          Tout ce qu'il faut savoir pour préparer votre mobilité en {country} — visa, logement, budget, santé et vie quotidienne.
        </p>
        <div className="mt-4 h-px bg-gray-200" />
      </header>

      {/* Article body — country-specific sections */}
      <div className="flex flex-col gap-12">
        {cards.map((card, index) => (
          <GuideSection key={card.id} card={card} index={index} />
        ))}
      </div>

      {/* Universal guides */}
      {universalGuides.length > 0 && (
        <>
          <div className="my-12 border-t border-gray-200" />
          <header className="mb-10">
            <h2 className="text-2xl font-bold text-[#222]">
              Guides universels
            </h2>
            <p className="mt-2 text-gray-500">
              Valables quelle que soit votre destination.
            </p>
          </header>
          <div className="flex flex-col gap-12">
            {universalGuides.map((card, index) => (
              <GuideSection key={card.id} card={card} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
