/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Park Finder (Module 8/24)
 * File: src/modules/park-finder/ParkFinderModule.jsx
 * * DESCRIPTION:
 * The apex orchestrator for the Geolocation Directory. It manages the 
 * global state between the Query Engine, the Form Matrix, and the Live Map.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ASYMMETRIC FLUID GRID: On desktop, the map is pinned to the right side 
 * (sticky) while the form scrolls. On mobile, it stacks gracefully without 
 * creating a "scroll trap" over the map interface.
 * 2. THE SATELLITE BOOT SEQUENCE: Implements a highly polished loading state 
 * that mimics establishing a GPS connection, reducing perceived wait times.
 * 3. GRACEFUL DEGRADATION: If the Supabase query fails (e.g., weak 3G network), 
 * it traps the error and offers a frictionless "Retry Connection" button 
 * instead of a blank white screen.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertTriangle, RefreshCw, Map as MapIcon } from 'lucide-react';

// ========================================================================
// LIVE WIRES (Internal Organs)
// ========================================================================
import { parkQueries } from './services/park.queries';
import { ParkFinderForm } from './components/ParkFinderForm';
import { LiveMapViewer } from './components/LiveMapViewer';
import { ParkDetailCard } from './components/ParkDetailCard';

export const ParkFinderModule = () => {
    // ========================================================================
    // 1. STATE MACHINE
    // ========================================================================
    const [isBooting, setIsBooting] = useState(true);
    const [matrixData, setMatrixData] = useState([]);
    const [dictionaries, setDictionaries] = useState({ cities: [], partners: [] });
    
    // The currently targeted location
    const [activePark, setActivePark] = useState(null);
    
    // Failsafe state
    const [systemError, setSystemError] = useState(null);

    // ========================================================================
    // 2. THE IGNITION SEQUENCE (Data Hydration)
    // ========================================================================
    const bootNetwork = useCallback(async () => {
        setIsBooting(true);
        setSystemError(null);
        setActivePark(null);

        const response = await parkQueries.fetchActiveParksMatrix();
        
        if (response.success) {
            setMatrixData(response.data);
            // Generate the strictly unique dropdown lists
            setDictionaries(parkQueries.getDropdownDictionaries(response.data));
        } else {
            setSystemError(response.error || 'Failed to establish satellite uplink.');
        }
        
        setIsBooting(false);
    }, []);

    // Fire on initial mount
    useEffect(() => {
        bootNetwork();
    }, [bootNetwork]);

    // ========================================================================
    // 3. KINETIC HANDLERS
    // ========================================================================
    const handleParkFound = (park) => {
        setActivePark(park);
        
        // On Mobile, automatically scroll down to the map when a park is found
        if (window.innerWidth <= 992) {
            const mapZone = document.getElementById('pfm-map-anchor');
            if (mapZone) {
                mapZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const handleClearPark = () => {
        setActivePark(null);
    };

    // ========================================================================
    // 4. RENDER PAYLOADS
    // ========================================================================

    // A. The Boot State (Loading)
    if (isBooting) {
        return (
            <div className="pfm-viewport pfm-center-stage">
                <div className="pfm-loader-chassis">
                    <Loader2 size={48} className="pfm-spin text-brand" />
                    <h3 className="pfm-loader-title">Establishing GPS Uplink...</h3>
                    <p className="pfm-loader-text">Synchronizing bus park coordinates</p>
                </div>
            </div>
        );
    }

    // B. The Failsafe State (Network Error)
    if (systemError) {
        return (
            <div className="pfm-viewport pfm-center-stage">
                <div className="pfm-error-chassis">
                    <div className="pfm-error-icon-box">
                        <AlertTriangle size={32} />
                    </div>
                    <h2>Network Desynchronized</h2>
                    <p>{systemError}</p>
                    <button className="ayabus-btn ayabus-btn-ghost pfm-retry-btn" onClick={bootNetwork}>
                        <RefreshCw size={18} /> Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    // C. The Master Interface
    return (
        <div className="ayabus-viewport pfm-viewport">
            <div className="ayabus-scroll-area pfm-scroll-chassis">
                
                {/* THE ASYMMETRIC GRID */}
                <div className="pfm-master-grid">
                    
                    {/* LEFT DOMAIN: The Command Center */}
                    <div className="pfm-form-zone">
                        <div className="pfm-form-container">
                            <ParkFinderForm 
                                matrix={matrixData}
                                dictionaries={dictionaries}
                                onParkFound={handleParkFound}
                                isLoading={false}
                            />

                            {/* Supplementary Instructions below the form */}
                            <div className="pfm-info-panel">
                                <h4>How it works</h4>
                                <ul>
                                    <li>Select your current city.</li>
                                    <li>Choose your preferred bus operator.</li>
                                    <li>Click "Find Park" to get exact live coordinates.</li>
                                    <li>Tap the "Start Journey" button to open Google Maps or Apple Maps for live directions.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT DOMAIN: The Live Viewport */}
                    <div className="pfm-map-zone" id="pfm-map-anchor">
                        <div className="pfm-map-enclosure">
                            
                            {/* The Hardware-Accelerated Map */}
                            <LiveMapViewer activePark={activePark} />
                            
                            {/* The Floating Telemetry Card (Only renders if activePark exists) */}
                            <ParkDetailCard 
                                park={activePark} 
                                onClose={handleClearPark} 
                            />
                            
                        </div>
                    </div>

                </div>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                /* --- MASTER CHASSIS --- */
                .pfm-viewport {
                    width: 100vw;
                    height: 100vh;
                    background: var(--bg-body);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .pfm-scroll-chassis {
                    flex: 1;
                    padding: 24px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                /* --- STATES --- */
                .pfm-center-stage {
                    justify-content: center;
                    align-items: center;
                }

                .pfm-loader-chassis, .pfm-error-chassis {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    max-width: 400px;
                    padding: 32px;
                }

                .pfm-spin { animation: spin 1.2s linear infinite; margin-bottom: 24px; }
                .text-brand { color: var(--brand-primary); }

                .pfm-loader-title { margin: 0 0 8px 0; color: var(--text-main); font-size: 20px; }
                .pfm-loader-text { margin: 0; color: var(--text-muted); }

                .pfm-error-icon-box {
                    width: 64px; height: 64px;
                    border-radius: var(--radius-full);
                    background: color-mix(in srgb, #EF4444 15%, transparent);
                    color: #EF4444;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 16px;
                }
                .pfm-error-chassis h2 { margin: 0 0 8px 0; color: var(--text-main); }
                .pfm-error-chassis p { color: var(--text-muted); margin-bottom: 24px; }
                .pfm-retry-btn { gap: 8px; }

                /* --- THE ASYMMETRIC GRID --- */
                .pfm-master-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr; /* Map gets slightly more space */
                    gap: 32px;
                    max-width: 1400px;
                    margin: 0 auto;
                    min-height: calc(100vh - 48px); /* Full height minus padding */
                }

                /* --- FORM ZONE (Scrollable) --- */
                .pfm-form-zone {
                    display: flex;
                    flex-direction: column;
                }

                .pfm-form-container {
                    /* Allows the form side to stick if the page scrolls */
                    position: sticky;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .pfm-info-panel {
                    background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
                    border: 1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                }
                .pfm-info-panel h4 { margin: 0 0 12px 0; color: var(--brand-primary); font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
                .pfm-info-panel ul { margin: 0; padding-left: 20px; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px; font-size: 14px; line-height: 1.5; }

                /* --- MAP ZONE (Fixed viewport) --- */
                .pfm-map-zone {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .pfm-map-enclosure {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    min-height: 600px;
                    background: var(--bg-surface);
                    border-radius: var(--radius-xl);
                    border: 1px solid var(--border-subtle);
                    overflow: hidden;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.06);
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 992px) {
                    .pfm-scroll-chassis { padding: 16px; }
                    .pfm-master-grid {
                        grid-template-columns: 1fr;
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                        min-height: auto;
                    }

                    .pfm-form-container { position: relative; }

                    .pfm-map-zone {
                        height: 70vh; /* Takes up exactly 70% of phone height when scrolled to */
                        min-height: 500px;
                        margin-bottom: 40px;
                    }
                }

                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};