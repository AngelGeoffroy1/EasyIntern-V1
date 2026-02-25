import Link from 'next/link';
import { getCountryGuide } from '@/data/guides';

type InfosPratiquesProps = {
  country: string;
  countryFlag: string;
};

export default function InfosPratiques({ country, countryFlag }: InfosPratiquesProps) {
  const guide = getCountryGuide(country);
  if (!guide) return null;

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-xl font-semibold text-[#222]">
        Infos pratiques pour {country} {countryFlag}
      </h3>
      <div className="flex flex-col gap-2">
        {guide.tips.map((tip) => (
          <div
            key={tip.themeId}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
          >
            <span className="shrink-0 text-xl">{tip.icon}</span>
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-bold text-[#222]">{tip.title}</span>
              <span className="mt-0.5 text-sm text-gray-500">{tip.shortText}</span>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/guides"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#FF385C] transition-colors hover:text-[#D70466]"
      >
        Voir tous les guides
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
