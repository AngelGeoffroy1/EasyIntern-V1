import { Parrain } from '@/types';

const badgeConfig = {
  gold: { label: 'Gold', color: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
  silver: { label: 'Silver', color: 'bg-gray-100 text-gray-700', icon: '🥈' },
  bronze: { label: 'Bronze', color: 'bg-orange-100 text-orange-800', icon: '🥉' },
};

const expertiseLabels: Record<string, string> = {
  logement: 'Logement',
  admin: 'Administratif',
  'vie-quotidienne': 'Vie quotidienne',
  stage: 'Stage',
  universite: 'Université',
  langue: 'Langue',
  social: 'Social',
};

type ParrainCardProps = {
  parrain: Parrain;
  onClick?: (parrain: Parrain) => void;
};

export default function ParrainCard({ parrain, onClick }: ParrainCardProps) {
  const badge = parrain.badge ? badgeConfig[parrain.badge] : null;

  return (
    <div className="group cursor-pointer" onClick={() => onClick?.(parrain)}>
      {/* Photo */}
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-gray-100">
        {parrain.profileImage ? (
          <img
            src={parrain.profileImage}
            alt={`${parrain.firstName} ${parrain.lastName}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1A3B5C] to-[#2a5580] transition-transform duration-300 group-hover:scale-105">
            <span className="text-4xl font-bold text-white/80">
              {parrain.firstName.charAt(0)}{parrain.lastName.charAt(0)}
            </span>
          </div>
        )}
        {badge && (
          <div
            className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${badge.color}`}
          >
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="space-y-1">
        {/* Nom + Note */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-[#222]">
            {parrain.firstName} {parrain.lastName}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <svg className="h-3.5 w-3.5 text-[#222]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-medium text-[#222]">{parrain.rating}</span>
            <span className="text-gray-500">({parrain.reviewCount})</span>
          </div>
        </div>

        {/* Ville */}
        <p className="text-sm text-gray-500">
          {parrain.countryFlag} {parrain.city}, {parrain.country}
        </p>

        {/* École + durée */}
        <p className="text-sm text-gray-500">
          🎓 {parrain.school} · {parrain.yearsOnSite} an{parrain.yearsOnSite > 1 ? 's' : ''} sur place
        </p>

        {/* Tags expertise */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {parrain.expertise.slice(0, 3).map((exp) => (
            <span
              key={exp}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
            >
              {expertiseLabels[exp] || exp}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
