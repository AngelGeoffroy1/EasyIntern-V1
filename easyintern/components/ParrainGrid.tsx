import { Parrain } from '@/types';
import ParrainCard from './ParrainCard';

type ParrainGridProps = {
  parrains: Parrain[];
  onParrainClick?: (parrain: Parrain) => void;
  animationKey?: string;
};

export default function ParrainGrid({ parrains, onParrainClick, animationKey }: ParrainGridProps) {
  if (parrains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 text-5xl">🔍</span>
        <h3 className="mb-2 text-lg font-semibold text-[#222]">Aucun parrain trouvé</h3>
        <p className="text-sm text-gray-500">
          Essayez de modifier vos filtres ou votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div
        key={animationKey}
        className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        {parrains.map((parrain, index) => (
          <div
            key={parrain.id}
            className="card-animate"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <ParrainCard parrain={parrain} onClick={onParrainClick} />
          </div>
        ))}
      </div>
    </div>
  );
}
