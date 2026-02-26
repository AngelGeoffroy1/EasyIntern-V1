import { supabase } from './supabase';
import { AdminProfile, AdminParrain, AdminStats, UserRole, Badge } from '@/types';

export async function fetchAllProfiles(): Promise<AdminProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return data as AdminProfile[];
}

export async function fetchAllParrains(): Promise<AdminParrain[]> {
  const { data, error } = await supabase
    .from('parrains')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching parrains:', error);
    return [];
  }
  return data as AdminParrain[];
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const [profilesRes, parrainsRes] = await Promise.all([
    supabase.from('profiles').select('id, role'),
    supabase.from('parrains').select('id, user_id'),
  ]);

  const profiles = profilesRes.data ?? [];
  const parrains = parrainsRes.data ?? [];

  return {
    totalUsers: profiles.length,
    totalParrains: parrains.length,
    totalAdmins: profiles.filter((p) => p.role === 'admin').length,
  };
}

export async function updateUserRole(userId: string, role: UserRole) {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  return { error };
}

export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  return { error };
}

export type ParrainUpdates = {
  first_name?: string;
  last_name_initial?: string;
  city?: string;
  country?: string;
  country_flag?: string;
  school?: string;
  bio?: string;
  mobility_type?: 'stage' | 'exchange' | 'both';
  badge?: Badge | null;
  email?: string | null;
  phone?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  expertise?: string[];
  rating?: number;
  review_count?: number;
  years_on_site?: number;
};

export async function updateParrainAdmin(
  parrainId: string,
  updates: ParrainUpdates
) {
  const { error } = await supabase
    .from('parrains')
    .update(updates)
    .eq('id', parrainId);

  return { error };
}

export async function deleteParrain(parrainId: string) {
  const { error } = await supabase
    .from('parrains')
    .delete()
    .eq('id', parrainId);

  return { error };
}
