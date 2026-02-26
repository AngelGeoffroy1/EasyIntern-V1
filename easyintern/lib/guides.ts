import { supabase } from '@/lib/supabase';
import type { GuideCard, GuideResource, GuideThemeId } from '@/types';

// === DB Row types ===

type GuideCardRow = {
    id: string;
    country: string;
    theme_id: string;
    title: string;
    description: string;
    icon: string;
    tips: string[];
    sort_order: number;
    created_at: string;
    updated_at: string;
};

type GuideResourceRow = {
    id: string;
    guide_card_id: string;
    title: string;
    url: string;
    type: string;
    sort_order: number;
};

// === Fetch guides for a country ===

export async function fetchGuidesByCountry(country: string): Promise<GuideCard[]> {
    const { data: cards, error: cardsError } = await supabase
        .from('guide_cards')
        .select('*')
        .eq('country', country)
        .order('sort_order');

    if (cardsError) throw cardsError;
    if (!cards || cards.length === 0) return [];

    const cardIds = cards.map((c: GuideCardRow) => c.id);
    const { data: resources, error: resError } = await supabase
        .from('guide_resources')
        .select('*')
        .in('guide_card_id', cardIds)
        .order('sort_order');

    if (resError) throw resError;

    const resourcesByCard: Record<string, GuideResource[]> = {};
    for (const r of (resources ?? []) as GuideResourceRow[]) {
        if (!resourcesByCard[r.guide_card_id]) resourcesByCard[r.guide_card_id] = [];
        resourcesByCard[r.guide_card_id].push({
            title: r.title,
            url: r.url,
            type: r.type as GuideResource['type'],
        });
    }

    return cards.map((c: GuideCardRow) => ({
        id: c.id,
        themeId: c.theme_id as GuideThemeId,
        title: c.title,
        description: c.description,
        icon: c.icon,
        tips: c.tips,
        resources: resourcesByCard[c.id] ?? [],
    }));
}

// === Fetch all guides grouped by country ===

export async function fetchAllGuides(): Promise<Record<string, GuideCard[]>> {
    const { data: cards, error: cardsError } = await supabase
        .from('guide_cards')
        .select('*')
        .order('sort_order');

    if (cardsError) throw cardsError;
    if (!cards || cards.length === 0) return {};

    const cardIds = cards.map((c: GuideCardRow) => c.id);
    const { data: resources, error: resError } = await supabase
        .from('guide_resources')
        .select('*')
        .in('guide_card_id', cardIds)
        .order('sort_order');

    if (resError) throw resError;

    const resourcesByCard: Record<string, GuideResource[]> = {};
    for (const r of (resources ?? []) as GuideResourceRow[]) {
        if (!resourcesByCard[r.guide_card_id]) resourcesByCard[r.guide_card_id] = [];
        resourcesByCard[r.guide_card_id].push({
            title: r.title,
            url: r.url,
            type: r.type as GuideResource['type'],
        });
    }

    const grouped: Record<string, GuideCard[]> = {};
    for (const c of cards as GuideCardRow[]) {
        if (!grouped[c.country]) grouped[c.country] = [];
        grouped[c.country].push({
            id: c.id,
            themeId: c.theme_id as GuideThemeId,
            title: c.title,
            description: c.description,
            icon: c.icon,
            tips: c.tips,
            resources: resourcesByCard[c.id] ?? [],
        });
    }

    return grouped;
}

// === Get list of countries with guides ===

export async function fetchGuideCountries(): Promise<string[]> {
    const { data, error } = await supabase
        .from('guide_cards')
        .select('country')
        .order('country');

    if (error) throw error;
    return [...new Set((data ?? []).map((d: { country: string }) => d.country))];
}

// === Create / Update / Delete ===

export async function upsertGuideCard(
    card: GuideCard & { country: string },
    resources: GuideResource[]
): Promise<void> {
    // Upsert the card
    const { error: cardError } = await supabase
        .from('guide_cards')
        .upsert({
            id: card.id,
            country: card.country,
            theme_id: card.themeId,
            title: card.title,
            description: card.description,
            icon: card.icon,
            tips: card.tips.filter((t) => t.trim() !== ''),
            sort_order: 0,
            updated_at: new Date().toISOString(),
        });

    if (cardError) throw cardError;

    // Replace resources: delete existing, then insert new
    const { error: delError } = await supabase
        .from('guide_resources')
        .delete()
        .eq('guide_card_id', card.id);

    if (delError) throw delError;

    const validResources = resources.filter((r) => r.title.trim() && r.url.trim());
    if (validResources.length > 0) {
        const { error: insError } = await supabase.from('guide_resources').insert(
            validResources.map((r, i) => ({
                guide_card_id: card.id,
                title: r.title,
                url: r.url,
                type: r.type,
                sort_order: i,
            }))
        );
        if (insError) throw insError;
    }
}

export async function deleteGuideCard(id: string): Promise<void> {
    // Resources are deleted by CASCADE
    const { error } = await supabase.from('guide_cards').delete().eq('id', id);
    if (error) throw error;
}
