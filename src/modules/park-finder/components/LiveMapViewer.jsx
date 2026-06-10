/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Park Finder (Module 8/24)
 * File: src/modules/park-finder/components/LiveMapViewer.jsx
 * * DESCRIPTION:
 * A read-only, high-performance geolocation viewport. It strips away all 
 * administrative editing controls and focuses entirely on cinematic routing 
 * and visual telemetry.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. CINEMATIC ROUTING: Uses a dedicated `MapController` sub-component to 
 * listen for coordinate changes and triggers a hardware-accelerated `flyTo` animation.
 * 2. DOM-NATIVE MARKERS: Bypasses standard image rendering. Uses `L.divIcon` to 
 * render a mathematically perfect, CSS-animated pulsating marker synced to the brand color.
 * 3. INVERTED DARK THEME: Automatically applies a color matrix filter to standard 
 * OSM tiles when the global theme shifts to dark mode, saving network requests for custom dark tiles.
 */

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ========================================================================
// 1. THE CINEMATIC CONTROLLER
// Silently watches the active coordinates and triggers the drone-fly effect.
// ========================================================================
const MapController = ({ center }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center && center.lat && center.lng) {
            // Stop any current animations and fly to the new target
            map.flyTo([center.lat, center.lng], 16, {
                duration: 1.8,          // 1.8 seconds feels premium
                easeLinearity: 0.25     // Smooth acceleration/deceleration
            });
        }
    }, [center, map]);

    return null; // This is a logic-only component, it renders no DOM
};

// ========================================================================
// 2. THE APEX VIEWER
// ========================================================================
export const LiveMapViewer = ({ activePark }) => {
    
    // Failsafe: Default to Kampala City Square if no park is selected yet
    const defaultCenter = { lat: 0.3136, lng: 32.5811 };
    
    // Extract safe coordinates
    const center = activePark?.coordinates || defaultCenter;
    const hasActivePin = !!activePark?.coordinates;

    // ========================================================================
    // 3. THE BRANDED DOM MARKER
    // Generated inside useMemo to prevent memory leaks on re-renders
    // ========================================================================
    const ayaBusPin = useMemo(() => {
        return L.divIcon({
            className: 'ayabus-custom-pin',
            html: `
                <div class="ab-pin-chassis">
                    <div class="ab-pin-core"></div>
                    <div class="ab-pin-pulse"></div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20] // Perfectly centered over the coordinate
        });
    }, []);

    return (
        <div className="lmv-viewport">
            
            <MapContainer 
                center={[center.lat, center.lng]} 
                zoom={hasActivePin ? 16 : 12} 
                className="lmv-map-instance"
                zoomControl={false} // We remove the default top-left control to avoid UI collisions
                scrollWheelZoom={true}
                dragging={true}
            >
                {/* Using CartoDB Positron as the base. It strips away useless 
                    terrain data and focuses purely on roads and navigation. 
                */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* The Logic Brain */}
                <MapController center={center} />

                {/* The Visual Pin */}
                {hasActivePin && (
                    <Marker 
                        position={[center.lat, center.lng]} 
                        icon={ayaBusPin} 
                    />
                )}
            </MapContainer>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
            ======================================================================== */}
            <style>{`
                /* --- VIEWPORT CHASSIS --- */
                .lmv-viewport {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    background: var(--bg-canvas); /* Matches the skeleton load state */
                    z-index: 1; /* Keep below floating cards */
                }

                .lmv-map-instance {
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }

                /* --- DARK MODE THEME MATRIX --- */
                /* When the global html/body has dark mode enabled, invert the map tiles */
                @media (prefers-color-scheme: dark) {
                    :root:not([data-theme="light"]) .leaflet-tile-pane {
                        filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                    }
                }
                [data-theme="dark"] .leaflet-tile-pane {
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                }

                /* Ensure the custom marker does NOT get inverted */
                .leaflet-marker-pane .ayabus-custom-pin {
                    filter: none !important;
                }

                /* --- THE BRAND PIN GEOMETRY --- */
                .ayabus-custom-pin {
                    background: transparent;
                    border: none;
                }

                .ab-pin-chassis {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ab-pin-core {
                    width: 16px;
                    height: 16px;
                    background-color: var(--brand-primary);
                    border: 3px solid var(--bg-surface);
                    border-radius: 50%;
                    z-index: 2;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }

                .ab-pin-pulse {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: var(--brand-primary);
                    border-radius: 50%;
                    z-index: 1;
                    opacity: 0;
                    animation: radarPulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                }

                @keyframes radarPulse {
                    0% {
                        transform: scale(0.5);
                        opacity: 0.8;
                    }
                    70% {
                        transform: scale(1.2);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1.2);
                        opacity: 0;
                    }
                }

                /* --- LEAFLET UI CLEANUP --- */
                /* Remove the grey focus outline when clicking the map */
                .leaflet-container:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
};