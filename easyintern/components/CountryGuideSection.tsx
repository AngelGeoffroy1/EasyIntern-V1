import { getCountryGuide } from '@/data/guides';

type CountryGuideSectionProps = {
  country: string;
};

import { SUPPORTED_COUNTRIES as countryFlags } from '@/data/countries';

export default function CountryGuideSection({ country }: CountryGuideSectionProps) {
  const guide = getCountryGuide(country);
  if (!guide) return null;

  const flag = countryFlags[country] || '🌍';

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-1 text-2xl font-bold text-[#222]">
          {flag} Infos essentielles pour {country}
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          Les informations clés à connaître avant de partir en {country}.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {guide.tips.map((tip) => (
            <div
              key={tip.themeId}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4"
            >
              <span className="shrink-0 text-2xl">{tip.icon}</span>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold text-[#222]">{tip.title}</span>
                <span className="mt-1 text-sm leading-relaxed text-gray-500">{tip.shortText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
