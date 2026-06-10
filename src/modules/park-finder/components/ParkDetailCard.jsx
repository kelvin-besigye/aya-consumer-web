/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Park Finder (Module 8/24)
 * File: src/modules/park-finder/components/ParkDetailCard.jsx
 * * DESCRIPTION:
 * The interactive overlay that renders the selected park's coordinates 
 * and triggers the external navigation intent.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. UNIVERSAL MAPS INTENT: Uses a standard search API query string to 
 * guarantee deep-linking into native navigation apps across iOS, Android, and Web.
 * 2. ADAPTIVE GEOMETRY: Acts as a floating widget on large screens, but 
 * morphs into a bottom-sheet (thumb-zone) layout on mobile devices.
 * 3. DEFENSIVE RENDERING: Includes graceful fallbacks for missing logos 
 * and handles layout shifts seamlessly.
 * * NOTE: Contact PII (Names/Phones) intentionally excluded per architecture spec.
 */

import React from 'react';
import { 
    MapPin, 
    Navigation, 
    CheckCircle2, 
    X, 
    Map as MapIcon 
} from 'lucide-react';

export const ParkDetailCard = ({ park, onClose }) => {
    // Failsafe: Do not render if no park is selected
    if (!park) return null;

    // ========================================================================
    // KINETIC ROUTING ENGINE
    // Triggers universal mapping protocols
    // ========================================================================
    const handleStartJourney = () => {
        if (!park.coordinates?.lat || !park.coordinates?.lng) return;
        
        // This specific API construction guarantees a pin drop on all modern devices
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${park.coordinates.lat},${park.coordinates.lng}`;
        window.open(mapUrl, '_blank', 'noopener,noreferrer');
    };

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="pdc-floating-chassis slide-up">
            
            {/* --- HEADER: VALIDATION & CONTROLS --- */}
            <div className="pdc-header">
                <div className="pdc-success-badge">
                    <CheckCircle2 size={16} />
                    <span>Park Found</span>
                </div>
                <button className="pdc-close-btn" onClick={onClose} aria-label="Close details">
                    <X size={20} />
                </button>
            </div>

            {/* --- CORE MATRIX: BRAND & LOCATION --- */}
            <div className="pdc-grid-body">
                <div className="pdc-logo-vault">
                    <img 
                        src={park.partnerLogo} 
                        alt={`${park.partnerName} logo`} 
                        className="pdc-logo"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = '/assets/fallbacks/bus-placeholder.png';
                        }}
                    />
                </div>
                
                <div className="pdc-telemetry">
                    <h3 className="pdc-partner-name">{park.partnerName}</h3>
                    <h4 className="pdc-park-name">{park.parkName}</h4>
                    
                    <div className="pdc-address-row">
                        <MapPin size={14} className="pdc-icon-muted" />
                        <span className="pdc-address-text">{park.address}</span>
                    </div>
                </div>
            </div>

            {/* --- FOOTER: ACTION TRIGGER --- */}
            <div className="pdc-footer">
                <button className="ayabus-btn pdc-action-btn pulse-glow" onClick={handleStartJourney}>
                    <Navigation size={18} className="pdc-nav-icon" />
                    <span>Start Journey (Open Maps)</span>
                </button>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                /* --- THE CHASSIS --- */
                .pdc-floating-chassis {
                    position: absolute;
                    bottom: 24px;
                    left: 24px;
                    width: 380px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12), 
                                0 8px 16px rgba(0, 0, 0, 0.08);
                    z-index: 1000; /* Must sit above Leaflet map controls */
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }

                /* --- HEADER --- */
                .pdc-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px 12px 20px;
                    border-bottom: 1px solid color-mix(in srgb, var(--border-subtle) 50%, transparent);
                }

                .pdc-success-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: color-mix(in srgb, #10B981 12%, transparent);
                    color: #10B981;
                    padding: 4px 12px;
                    border-radius: var(--radius-full);
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .pdc-close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: var(--radius-sm);
                    transition: all 0.2s;
                }
                .pdc-close-btn:hover {
                    background: var(--bg-body);
                    color: var(--text-main);
                }

                /* --- THE GRID BODY --- */
                .pdc-grid-body {
                    display: grid;
                    grid-template-columns: 64px 1fr;
                    gap: 16px;
                    padding: 20px;
                    align-items: center;
                }

                .pdc-logo-vault {
                    width: 64px;
                    height: 64px;
                    background: var(--bg-body);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pdc-logo {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }

                .pdc-telemetry {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .pdc-partner-name {
                    margin: 0;
                    font-size: 13px;
                    color: var(--brand-primary);
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .pdc-park-name {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 900;
                    color: var(--text-main);
                    line-height: 1.2;
                    letter-spacing: -0.3px;
                }

                .pdc-address-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                    margin-top: 4px;
                }

                .pdc-icon-muted {
                    color: var(--text-muted);
                    margin-top: 2px;
                    flex-shrink: 0;
                }

                .pdc-address-text {
                    font-size: 13px;
                    color: var(--text-muted);
                    line-height: 1.4;
                }

                /* --- FOOTER ACTION --- */
                .pdc-footer {
                    padding: 0 20px 20px 20px;
                }

                .pdc-action-btn {
                    width: 100%;
                    height: 52px; /* Fat-finger safe height */
                    font-size: 16px;
                    gap: 12px;
                    border-radius: var(--radius-lg);
                    box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 25%, transparent);
                }

                .pdc-nav-icon {
                    /* Custom rotate to make the navigation arrow point "forward" */
                    transform: rotate(45deg);
                    margin-bottom: 2px;
                }

                /* --- ANIMATIONS --- */
                .slide-up { animation: pdcSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes pdcSlideUp { 
                    0% { opacity: 0; transform: translateY(40px) scale(0.95); } 
                    100% { opacity: 1; transform: translateY(0) scale(1); } 
                }

                /* --- RESPONSIVE DEGRADATION (Mobile Bottom Sheet) --- */
                @media (max-width: 600px) {
                    .pdc-floating-chassis {
                        bottom: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
                        border-bottom: none;
                        border-left: none;
                        border-right: none;
                    }

                    /* Add a subtle drag handle visual cue for mobile */
                    .pdc-header::before {
                        content: '';
                        position: absolute;
                        top: 8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 40px;
                        height: 4px;
                        border-radius: 4px;
                        background: var(--border-subtle);
                    }
                }
            `}</style>
        </div>
    );
};