export type Badge = 'gold' | 'silver' | 'bronze';

export type MobilityType = 'stage' | 'exchange' | 'both';

export type ExpertiseCategory =
  | 'logement'
  | 'admin'
  | 'vie-quotidienne'
  | 'stage'
  | 'universite'
  | 'langue'
  | 'social';

export type Parrain = {
  id: string;
  firstName: string;
  lastNameInitial: string;
  city: string;
  country: string;
  countryFlag: string;
  school: string;
  rating: number;
  reviewCount: number;
  yearsOnSite: number;
  expertise: ExpertiseCategory[];
  badge: Badge | null;
  bio: string;
  profileImage: string;
  mobilityType: MobilityType;
};

export type CategoryOption = {
  id: ExpertiseCategory | 'all';
  label: string;
  icon: string;
};

// === Guide Types ===

export type GuideThemeId =
  | 'visa-admin'
  | 'logement'
  | 'budget-banque'
  | 'sante-assurance'
  | 'vie-quotidienne'
  | 'transport';

export type GuideTheme = {
  id: GuideThemeId;
  label: string;
  icon: string;
  description: string;
};

export type GuideResource = {
  title: string;
  url: string;
  type: 'site' | 'app' | 'article' | 'officiel';
};

export type GuideCard = {
  id: string;
  themeId: GuideThemeId;
  title: string;
  description: string;
  icon: string;
  tips: string[];
  resources: GuideResource[];
};

export type CountryTip = {
  themeId: GuideThemeId;
  icon: string;
  title: string;
  shortText: string;
};

export type CountryGuideEntry = {
  country: string;
  tips: CountryTip[];
};

export type CountryDestination = {
  country: string;
  flag: string;
  description: string;
};
