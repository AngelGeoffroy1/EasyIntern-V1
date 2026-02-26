// === Admin Types ===

export type UserRole = 'user' | 'admin';

export type AdminProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  school: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
};

export type AdminParrain = {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name_initial: string;
  city: string;
  country: string;
  country_flag: string;
  school: string;
  rating: number;
  review_count: number;
  years_on_site: number;
  expertise: string[];
  badge: Badge | null;
  bio: string;
  profile_image: string | null;
  mobility_type: MobilityType;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  linkedin: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminStats = {
  totalUsers: number;
  totalParrains: number;
  totalAdmins: number;
};

// === Core Types ===

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
  email: string | null;
  phone: string | null;
  instagram: string | null;
  linkedin: string | null;
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
