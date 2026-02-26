import { supabase } from './supabase';
import { Parrain } from '@/types';

type ParrainRow = {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  country_flag: string;
  school: string;
  rating: number;
  review_count: number;
  years_on_site: number;
  expertise: string[];
  badge: 'gold' | 'silver' | 'bronze' | null;
  bio: string;
  profile_image: string | null;
  mobility_type: 'stage' | 'exchange' | 'both';
  email: string | null;
  phone: string | null;
  instagram: string | null;
  linkedin: string | null;
};

function mapRow(row: ParrainRow): Parrain {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    city: row.city,
    country: row.country,
    countryFlag: row.country_flag,
    school: row.school,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    yearsOnSite: row.years_on_site,
    expertise: row.expertise as Parrain['expertise'],
    badge: row.badge,
    bio: row.bio,
    profileImage: row.profile_image ?? '',
    mobilityType: row.mobility_type,
    email: row.email,
    phone: row.phone,
    instagram: row.instagram,
    linkedin: row.linkedin,
  };
}

export async function fetchParrains(): Promise<Parrain[]> {
  const { data, error } = await supabase
    .from('parrains')
    .select('*')
    .order('first_name');

  if (error) {
    console.error('Error fetching parrains:', error);
    return [];
  }

  return (data as ParrainRow[]).map(mapRow);
}

export async function fetchParrainByUserId(userId: string): Promise<ParrainRow | null> {
  const { data, error } = await supabase
    .from('parrains')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data as ParrainRow;
}

export async function updateParrain(parrainId: string, updates: Partial<Omit<ParrainRow, 'id' | 'user_id' | 'rating' | 'review_count' | 'badge'>>) {
  const { data, error } = await supabase
    .from('parrains')
    .update(updates)
    .eq('id', parrainId)
    .select()
    .single();

  return { data, error };
}

export type InsertParrainData = {
  user_id: string;
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  country_flag: string;
  school: string;
  years_on_site: number;
  expertise: string[];
  mobility_type: 'stage' | 'exchange' | 'both';
  bio: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  linkedin: string | null;
  profile_image: string | null;
};

export async function insertParrain(data: InsertParrainData) {
  const { data: result, error } = await supabase
    .from('parrains')
    .insert([data])
    .select()
    .single();

  return { data: result, error };
}
