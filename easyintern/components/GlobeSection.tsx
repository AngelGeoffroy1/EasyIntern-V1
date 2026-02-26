import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { Parrain } from '@/types';
import { useSpring } from 'react-spring';

type GlobeSectionProps = {
    parrains: Parrain[];
};

// Coordonnées approximatives pour les pays d'échange
const COUNTRY_COORDS: Record<string, [number, number]> = {
    "France": [46.2276, 2.2137],
    "Espagne": [40.4637, -3.7492],
    "Royaume-Uni": [55.3781, -3.4360],
    "UK": [55.3781, -3.4360],
    "Angleterre": [55.3781, -3.4360],
    "États-Unis": [37.0902, -95.7129],
    "USA": [37.0902, -95.7129],
    "Canada": [56.1304, -106.3468],
    "Australie": [-25.2744, 133.7751],
    "Mexique": [23.6345, -102.5528],
    "Brésil": [-14.2350, -51.9253],
    "Argentine": [-38.4161, -63.6167],
    "Chine": [35.8617, 104.1954],
    "Japon": [36.2048, 138.2529],
    "Corée du Sud": [35.9078, 127.7669],
    "Suède": [60.1282, 18.6435],
    "Norvège": [60.4720, 8.4689],
    "Finlande": [61.9241, 25.7482],
    "Afrique du Sud": [-30.5595, 22.9375],
    "Maroc": [31.7917, -7.0926],
    "Uruguay": [-32.5228, -55.7658],
    "Irlande": [53.1424, -7.6921],
    "Allemagne": [51.1657, 10.4515],
    "Italie": [41.8719, 12.5674],
    "Suisse": [46.8182, 8.2275],
    "Pays-Bas": [52.1326, 5.2913],
    "Belgique": [50.5039, 4.4699],
    "Singapour": [1.3521, 103.8198],
    "Vietnam": [14.0583, 108.2772],
    "Inde": [20.5937, 78.9629]
};

export default function GlobeSection({ parrains }: GlobeSectionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;
        let currentR = 0;

        // Extraire les pays uniques des parrains filtrés
        const uniqueCountries = Array.from(new Set(parrains.map(p => p.country)));

        // Générer les marqueurs pour les pays présents
        const markers = uniqueCountries
            .map(country => COUNTRY_COORDS[country])
            .filter(Boolean)
            .map(coords => ({
                location: coords,
                size: 0.08, // Taille du marqueur
            }));

        if (!canvasRef.current) return;

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };
        window.addEventListener('resize', onResize);
        onResize();

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 0, // 0 = white, 1 = dark
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [1, 1, 1],
            markerColor: [1, 0.22, 0.36], // Accent color (RGB from 0 to 1) - Pink/Red
            glowColor: [1, 1, 1],
            markers: markers as any,
            onRender: (state) => {
                // Called on every animation frame.
                if (!pointerInteracting.current) {
                    // auto spin when not interacting
                    phi += 0.005;
                }

                currentR = r.get();
                state.phi = phi + currentR;
                state.width = width * 2;
                state.height = width * 2;
            },
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [parrains, r]);

    return (
        <div className="col-span-full my-8 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#fafafa] py-12 px-4 shadow-sm ring-1 ring-gray-200 sm:px-6">
            <div className="mb-4 max-w-2xl text-center">
                <h3 className="text-2xl font-bold tracking-tight text-[#222] sm:text-3xl">
                    Notre communauté à travers le monde
                </h3>
                <p className="mt-4 text-gray-500">
                    Trouve un parrain dans les pays mis en évidence ci-dessous. Interagis avec le globe pour explorer nos destinations !
                </p>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[500px] cursor-grab active:cursor-grabbing">
                <canvas
                    ref={canvasRef}
                    onPointerDown={(e) => {
                        pointerInteracting.current =
                            e.clientX - pointerInteractionMovement.current;
                        if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
                    }}
                    onPointerUp={() => {
                        pointerInteracting.current = null;
                        if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
                    }}
                    onPointerOut={() => {
                        pointerInteracting.current = null;
                        if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
                    }}
                    onPointerMove={(e) => {
                        if (pointerInteracting.current !== null) {
                            const delta = e.clientX - pointerInteracting.current;
                            pointerInteractionMovement.current = delta;
                            api.start({ r: delta / 200 });
                        }
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        contain: 'layout paint size',
                        opacity: 1,
                        transition: 'opacity 1s ease',
                        touchAction: 'none'
                    }}
                />
            </div>
        </div>
    );
}
