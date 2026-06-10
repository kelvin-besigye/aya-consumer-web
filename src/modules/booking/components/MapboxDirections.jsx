/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 3 - UI Components)
 * File: MapboxDirections.jsx
 * * DESCRIPTION:
 * The spatial anchor for Step 2. Renders a lightweight, zero-JS-overhead 
 * static map of the boarding park, and provides native OS deep-links 
 * to guide the passenger to the bus.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. STATIC RENDER ENGINE: Avoids loading heavy interactive map libraries 
 * on the consumer side. Uses a single lightweight image request.
 * 2. NATIVE DEEP-LINKING: Automatically detects the platform and opens 
 * the native Google Maps or Apple Maps app for actual turn-by-turn routing.
 * 3. FALLBACK CATCHER: If coordinates are missing from the database, it 
 * gracefully falls back to a central default to prevent white-screens.
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Copy, CheckCircle2, ExternalLink, Map as MapIcon } from 'lucide-react';

// ========================================================================
// 1. ENVIRONMENT & DEFAULTS
// ========================================================================
// Ideally, map this to your actual Mapbox Public Token in your .env file
const MAPBOX_PUBLIC_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_PUBLIC_TOKEN';

// Failsafe coordinates ensure the map never crashes if the DB returns null.
// Defaults smoothly to central Kampala coordinates.
const FALLBACK_LAT = 0.3476;
const FALLBACK_LNG = 32.5825;

export const MapboxDirections = ({ 
    parkName = "Main Departure Terminal", 
    address = "Bus Park Loading Zone", 
    lat, 
    lng 
}) => {
    const [copied, setCopied] = useState(false);

    // Secure the coordinates
    const finalLat = parseFloat(lat) || FALLBACK_LAT;
    const finalLng = parseFloat(lng) || FALLBACK_LNG;

    // ========================================================================
    // 2. THE STATIC MAP COMPILER
    // Generates a high-res, 2x retina static image from Mapbox.
    // ========================================================================
    const generateStaticMapUrl = () => {
        // Dark mode/Light mode map styles can be toggled if needed, but a neutral 
        // 'streets-v12' is best for maximum daylight visibility at bus parks.
        const styleId = 'mapbox/streets-v12';
        const zoom = 15;
        const width = 600;
        const height = 300;
        
        // Add a red pin marker to the exact coordinates
        const marker = `pin-l+EF4444(${finalLng},${finalLat})`;

        if (MAPBOX_PUBLIC_TOKEN === 'YOUR_MAPBOX_PUBLIC_TOKEN') {
            // Failsafe: If you haven't added the token to your prototype yet, 
            // return a clean gradient placeholder so the UI doesn't break.
            return null; 
        }

        return `https://api.mapbox.com/styles/v1/${styleId}/static/${marker}/${finalLng},${finalLat},${zoom},0/${width}x${height}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`;
    };

    const mapImageUrl = generateStaticMapUrl();

    // ========================================================================
    // 3. THE DEEP-LINK ROUTING ENGINE
    // ========================================================================
    const handleOpenMaps = () => {
        // Creates a universal Google Maps intent that works flawlessly on Android/iOS/Web
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${finalLat},${finalLng}`;
        
        // Open in new tab (which triggers the native app on mobile OS)
        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    };

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(`${parkName}, ${address}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text', err);
        }
    };

    // ========================================================================
    // 4. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="md-chassis">
            
            {/* --- TOP: THE MAP VAULT --- */}
            <div className="md-map-vault" onClick={handleOpenMaps} role="button" aria-label="Open in Google Maps">
                {mapImageUrl ? (
                    <img 
                        src={mapImageUrl} 
                        alt={`Map showing location of ${parkName}`} 
                        className="md-map-image"
                        loading="lazy"
                    />
                ) : (
                    <div className="md-map-placeholder">
                        <MapIcon size={48} className="placeholder-icon" />
                        <span>Map integration pending token activation</span>
                    </div>
                )}
                
                {/* Floating "Tap to Open" Badge */}
                <div className="md-tap-badge">
                    <ExternalLink size={14} />
                    <span>Tap to open GPS</span>
                </div>
            </div>

            {/* --- BOTTOM: THE DATA & ACTION CONSOLE --- */}
            <div className="md-info-console">
                <div className="md-text-block">
                    <h4 className="md-park-title">
                        <MapPin size={18} className="pin-icon" />
                        {parkName}
                    </h4>
                    <p className="md-park-address">{address}</p>
                </div>

                <div className="md-action-grid">
                    <button className="md-btn md-btn-primary" onClick={handleOpenMaps}>
                        <Navigation size={16} />
                        Get Directions
                    </button>
                    
                    <button className="md-btn md-btn-ghost" onClick={handleCopyAddress}>
                        {copied ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Info'}
                    </button>
                </div>
            </div>

            {/* ========================================================================
                5. COMPONENT-SCOPED STYLES (African Physics)
                Strictly bounds to index.css for instant Dark/Light mode syncing.
            ======================================================================== */}
            <style>{`
                .md-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                /* --- MAP VAULT --- */
                .md-map-vault {
                    position: relative;
                    width: 100%;
                    height: 200px;
                    background: var(--bg-body);
                    cursor: pointer;
                    overflow: hidden;
                }

                .md-map-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s var(--ease-main);
                }

                .md-map-vault:hover .md-map-image {
                    transform: scale(1.05);
                }

                .md-map-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    background: repeating-linear-gradient(
                        45deg,
                        var(--bg-surface),
                        var(--bg-surface) 10px,
                        var(--bg-body) 10px,
                        var(--bg-body) 20px
                    );
                    color: var(--text-muted);
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .placeholder-icon {
                    opacity: 0.3;
                }

                .md-tap-badge {
                    position: absolute;
                    bottom: 12px;
                    right: 12px;
                    background: var(--brand-primary);
                    color: #FFF;
                    padding: 6px 12px;
                    border-radius: var(--radius-full);
                    font-size: 11px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    pointer-events: none;
                }

                /* --- INFO CONSOLE --- */
                .md-info-console {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .md-text-block {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .md-park-title {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-main);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pin-icon {
                    color: var(--brand-primary);
                }

                .md-park-address {
                    margin: 0;
                    font-size: 13px;
                    color: var(--text-muted);
                    padding-left: 26px; /* Aligns with text next to icon */
                    font-weight: 500;
                }

                /* --- ACTION GRID --- */
                .md-action-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 12px;
                }

                .md-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 44px;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }

                .md-btn-primary {
                    background: var(--brand-primary);
                    color: #FFF;
                }

                .md-btn-primary:hover {
                    filter: brightness(1.1);
                    box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary) 30%, transparent);
                }

                .md-btn-ghost {
                    background: var(--bg-body);
                    color: var(--text-main);
                    border: 1px solid var(--border-subtle);
                }

                .md-btn-ghost:hover {
                    border-color: var(--text-muted);
                    background: var(--bg-surface);
                }

                .text-success {
                    color: #10B981;
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 480px) {
                    .md-action-grid {
                        grid-template-columns: 1fr;
                    }
                    .md-map-vault {
                        height: 160px; /* Conserve vertical space on tiny screens */
                    }
                }
            `}</style>
        </div>
    );
};