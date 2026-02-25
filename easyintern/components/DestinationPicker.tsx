import { destinations } from '@/data/guides';

type DestinationPickerProps = {
  onSelect: (country: string) => void;
};

export default function DestinationPicker({ onSelect }: DestinationPickerProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="mb-2 text-xl font-semibold text-[#222]">
        Choisissez votre destination
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Sélectionnez un pays pour découvrir les guides adaptés à votre mobilité.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {destinations.map((dest, index) => (
          <button
            key={dest.country}
            onClick={() => onSelect(dest.country)}
            className="card-animate group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl transition-transform group-hover:scale-110">
              {dest.flag}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[#222] truncate">{dest.country}</p>
              <p className="text-xs text-gray-400 truncate">{dest.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
