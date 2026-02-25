import { GuideCard as GuideCardType } from '@/types';
import GuideCard from './GuideCard';

type GuideGridProps = {
  cards: GuideCardType[];
};

export default function GuideGrid({ cards }: GuideGridProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 text-5xl">📚</span>
        <h3 className="mb-2 text-lg font-semibold text-[#222]">Aucun guide trouvé</h3>
        <p className="text-sm text-gray-500">
          Essayez de sélectionner une autre thématique.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="card-animate"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <GuideCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
