/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Park Pick-Up (Module 13/24)
 * File: src/modules/park-pick-up/components/FilterEngine.jsx
 * * DESCRIPTION:
 * The kinetic filter matrix. Allows passengers to rapidly triage the 
 * driver roster by their specific destination park and preferred vehicle type.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. HARDWARE-ACCELERATED SCROLLING: Uses hidden scrollbars and native 
 * iOS/Android momentum scrolling for a frictionless UX.
 * 2. KINETIC SNAP: Employs CSS `scroll-snap` to ensure pills perfectly 
 * align to the edge of the screen after a swipe.
 * 3. STATELESS ARCHITECTURE: Passes selection intents upward to the parent 
 * orchestrator, ensuring the UI and the driver database query stay in 100% sync.
 */

import React from 'react';
import { 
    MapPin, 
    Car, 
    Navigation,
    LayoutGrid
} from 'lucide-react';

export const FilterEngine = ({ 
    activePark, 
    activeVehicle, 
    onParkChange, 
    onVehicleChange,
    availableParks = [],
    availableVehicles = []
}) => {
    // ========================================================================
    // 1. SMART DEFAULTS (Failsafes)
    // If the database is still booting, provide the common East African baseline
    // ========================================================================
    const parks = availableParks.length > 0 ? availableParks : [
        "Namayiba Bus Terminal", 
        "Kisenyi Park", 
        "Jinja Central Park",
        "Mbarara Highway Stop",
        "Gulu Main Park"
    ];

    const vehicles = availableVehicles.length > 0 ? availableVehicles : [
        "Boda Boda", 
        "Saloon Car", 
        "Toyota Wish", 
        "Minivan"
    ];

    // ========================================================================
    // 2. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="fe-chassis">
            
            {/* --- TRACK 1: DESTINATION PARKS --- */}
            <div className="fe-section">
                <div className="fe-header">
                    <MapPin size={16} className="fe-brand-icon" />
                    <h3>Destination Park</h3>
                </div>
                
                <div className="fe-track" aria-label="Filter by destination park">
                    {/* The "All / Reset" Pill */}
                    <button 
                        className={`fe-pill ${activePark === 'ALL' ? 'fe-pill-active' : ''}`}
                        onClick={() => onParkChange('ALL')}
                    >
                        <Navigation size={14} />
                        <span>All Parks</span>
                    </button>

                    {/* Dynamic Data Pills */}
                    {parks.map((park) => (
                        <button 
                            key={`park-${park}`}
                            className={`fe-pill ${activePark === park ? 'fe-pill-active' : ''}`}
                            onClick={() => onParkChange(park)}
                        >
                            {park}
                        </button>
                    ))}
                    
                    {/* Spacer to allow the last pill to scroll fully away from the right edge */}
                    <div className="fe-spacer" />
                </div>
            </div>

            {/* --- TRACK 2: VEHICLE TYPES --- */}
            <div className="fe-section">
                <div className="fe-header">
                    <Car size={16} className="fe-brand-icon" />
                    <h3>Vehicle Preference</h3>
                </div>
                
                <div className="fe-track" aria-label="Filter by vehicle type">
                    {/* The "All / Reset" Pill */}
                    <button 
                        className={`fe-pill ${activeVehicle === 'ALL' ? 'fe-pill-active' : ''}`}
                        onClick={() => onVehicleChange('ALL')}
                    >
                        <LayoutGrid size={14} />
                        <span>Any Vehicle</span>
                    </button>

                    {/* Dynamic Data Pills */}
                    {vehicles.map((vehicle) => (
                        <button 
                            key={`veh-${vehicle}`}
                            className={`fe-pill ${activeVehicle === vehicle ? 'fe-pill-active' : ''}`}
                            onClick={() => onVehicleChange(vehicle)}
                        >
                            {vehicle}
                        </button>
                    ))}

                    <div className="fe-spacer" />
                </div>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .fe-chassis {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                    /* Negative margins allow the tracks to bleed to the edges of mobile screens */
                    margin: 0 -24px;
                    width: calc(100% + 48px);
                }

                /* --- SECTION DOMAIN --- */
                .fe-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .fe-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0 24px; /* Keeps text aligned with the master layout */
                }

                .fe-brand-icon {
                    color: var(--text-muted);
                }

                .fe-header h3 {
                    margin: 0;
                    color: var(--text-main);
                    font-size: 14px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* --- HORIZONTAL TRACK --- */
                .fe-track {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding: 0 24px 8px 24px; /* Bottom padding for focus rings/shadows */
                    scroll-snap-type: x mandatory;
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch; /* Momentum scrolling on iOS */
                    
                    /* Hide scrollbars completely for native app feel */
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .fe-track::-webkit-scrollbar {
                    display: none;
                }

                /* --- THE KINETIC PILLS --- */
                .fe-pill {
                    flex-shrink: 0; /* Prevents squishing */
                    scroll-snap-align: start; /* Snaps to left edge */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 40px;
                    padding: 0 20px;
                    border-radius: var(--radius-full); /* Creates the perfect oval */
                    border: 1px solid var(--border-subtle);
                    background: var(--bg-surface);
                    color: var(--text-muted);
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    white-space: nowrap; /* Forces text to stay on one line */
                    outline: none;
                }

                .fe-pill:hover {
                    border-color: var(--brand-primary);
                    color: var(--text-main);
                }

                .fe-pill:focus-visible {
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 20%, transparent);
                }

                /* THE ACTIVE STATE (Illumination) */
                .fe-pill-active {
                    background: var(--brand-primary);
                    border-color: var(--brand-primary);
                    color: #FFFFFF; /* Hardcoded white ensures high contrast on the brand primary color */
                    box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary) 30%, transparent);
                }
                
                .fe-pill-active:hover {
                    color: #FFFFFF;
                }

                /* Spacer ensures the last pill doesn't hug the right edge of the screen */
                .fe-spacer {
                    flex-shrink: 0;
                    width: 14px;
                    height: 1px;
                }

                /* --- RESPONSIVE ADJUSTMENTS --- */
                @media (max-width: 768px) {
                    .fe-chassis {
                        margin: 0 -16px;
                        width: calc(100% + 32px);
                        gap: 20px;
                    }
                    .fe-header { padding: 0 16px; }
                    .fe-track { padding: 0 16px 8px 16px; }
                    .fe-pill { height: 36px; padding: 0 16px; font-size: 13px; }
                }
            `}</style>
        </div>
    );
};