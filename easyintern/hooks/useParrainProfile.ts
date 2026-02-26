'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchParrainByUserId } from '@/lib/parrains';

export type ParrainProfile = {
    id: string;
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

export function useParrainProfile() {
    const { user, loading: authLoading } = useAuth();
    const [parrainProfile, setParrainProfile] = useState<ParrainProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isParrain, setIsParrain] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setParrainProfile(null);
            setIsParrain(false);
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            const data = await fetchParrainByUserId(user.id);
            if (data) {
                setParrainProfile(data as ParrainProfile);
                setIsParrain(true);
            } else {
                setParrainProfile(null);
                setIsParrain(false);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user, authLoading]);

    const refetch = async () => {
        if (!user) return;
        const data = await fetchParrainByUserId(user.id);
        if (data) {
            setParrainProfile(data as ParrainProfile);
            setIsParrain(true);
        } else {
            setParrainProfile(null);
            setIsParrain(false);
        }
    };

    return { parrainProfile, isParrain, loading, refetch };
}
