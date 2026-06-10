/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Park Pick-Up (Module 13/24)
 * File: src/modules/park-pick-up/ParkPickUpModule.jsx
 * * DESCRIPTION:
 * The Apex Orchestrator for Last-Mile Logistics. It mounts the global 
 * viewport, fetches the live database payload, and manages the reactive 
 * filtering state across the entire Trust Matrix.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. FLUID AUTO-GRID: Employs CSS `grid-template-columns: repeat(auto-fill, minmax(...))` 
 * to create a hardware-accelerated layout that organically stacks on mobile 
 * and expands to a multi-column masonry-style grid on desktop.
 * 2. DYNAMIC TAXONOMY: Programmatically extracts unique filter constraints 
 * from the live data stream, guaranteeing the FilterEngine only displays 
 * options that actually exist in the current roster.
 * 3. STICKY INTERFACE: Anchors the FilterEngine to the top of the scroll 
 * area using z-index manipulation, allowing passengers to re-filter deep lists instantly.
 */

import React, { useState, useEffect, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';

// Live Wires: The Data Engine (Phase 1)
import { pickupService } from './services/pickup.service';

// Live Wires: The Atomic UI (Phase 2)
import { FilterEngine } from './components/FilterEngine';
import { DriverCard } from './components/DriverCard';
import { SafetyDisclaimer } from './components/SafetyDisclaimer';

export const ParkPickUpModule = () => {
    // ========================================================================
    // 0. FAILSAFE ICON RESOLUTION
    // Prevents React crashes if specific icon names are missing from the
    // currently installed version of lucide-react.
    // ========================================================================
    const BrandIcon = LucideIcons.ShieldCheck || LucideIcons.Shield;
    const EmptyIcon = LucideIcons.MapX || LucideIcons.AlertCircle;

    // ========================================================================
    // 1. THE STATE MACHINE
    // ========================================================================
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter Constraints
    const [activePark, setActivePark] = useState('ALL');
    const [activeVehicle, setActiveVehicle] = useState('ALL');

    // ========================================================================
    // 2. THE BOOT SEQUENCE
    // Pulls the verified partners from Supabase on component mount
    // ========================================================================
    useEffect(() => {
        let isMounted = true;

        const loadNetwork = async () => {
            setIsLoading(true);
            const response = await pickupService.fetchActivePartners();
            
            if (isMounted) {
                if (response.success) {
                    setDrivers(response.data);
                } else {
                    setError(response.error);
                }
                setIsLoading(false);
            }
        };

        loadNetwork();

        return () => { isMounted = false; };
    }, []);

    // ========================================================================
    // 3. THE DATA TRIAGE (Dynamic Extraction & Filtering)
    // ========================================================================
    
    // Dynamically extract unique parks and vehicles from the live data
    // useMemo prevents recalculating this array unless the base 'drivers' data changes
    const availableParks = useMemo(() => {
        return [...new Set(drivers.map(d => d.base_park))].sort();
    }, [drivers]);

    const availableVehicles = useMemo(() => {
        return [...new Set(drivers.map(d => d.vehicle_type))].sort();
    }, [drivers]);

    // Apply the active filters to the roster
    const filteredDrivers = useMemo(() => {
        return drivers.filter(driver => {
            const matchesPark = activePark === 'ALL' || driver.base_park === activePark;
            const matchesVehicle = activeVehicle === 'ALL' || driver.vehicle_type === activeVehicle;
            return matchesPark && matchesVehicle;
        });
    }, [drivers, activePark, activeVehicle]);

    // ========================================================================
    // 4. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="ayabus-viewport ppum-viewport">
            <div className="ayabus-scroll-area ppum-scroll-area">
                
                <div className="ppum-master-chassis">
                    
                    {/* --- MODULE HEADER --- */}
                    <div className="ppum-header">
                        <div className="ppum-title-group">
                            <BrandIcon size={28} className="ppum-brand-icon" />
                            <div>
                                <h1 className="ppum-page-title">Trusted Pick-Up</h1>
                                <p className="ppum-page-subtitle">Verified last-mile partners to get you home safely.</p>
                            </div>
                        </div>
                    </div>

                    {/* --- THE STICKY FILTER MATRIX --- */}
                    <div className="ppum-sticky-filter">
                        <FilterEngine 
                            activePark={activePark}
                            activeVehicle={activeVehicle}
                            onParkChange={setActivePark}
                            onVehicleChange={setActiveVehicle}
                            availableParks={availableParks}
                            availableVehicles={availableVehicles}
                        />
                    </div>

                    {/* --- THE DRIVER ROSTER (Grid Layout) --- */}
                    <div className="ppum-content-zone">
                        {isLoading ? (
                            // SKELETON BOOT STATE
                            <div className="ppum-grid">
                                {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="ppum-skeleton-card pulse-glow" />
                                ))}
                            </div>
                        ) : error ? (
                            // CRITICAL ERROR STATE
                            <div className="ppum-empty-state">
                                <EmptyIcon size={48} className="ppum-empty-icon" />
                                <h3>Network Offline</h3>
                                <p>{error}</p>
                            </div>
                        ) : filteredDrivers.length === 0 ? (
                            // ZERO MATCHES STATE
                            <div className="ppum-empty-state slide-up">
                                <EmptyIcon size={48} className="ppum-empty-icon" />
                                <h3>No Drivers Available</h3>
                                <p>We couldn't find any partners matching this exact filter combination right now. Try selecting 'All Parks' or 'Any Vehicle'.</p>
                                <button 
                                    className="ayabus-btn-ghost ppum-reset-btn"
                                    onClick={() => { setActivePark('ALL'); setActiveVehicle('ALL'); }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            // THE LIVE GRID
                            <div className="ppum-grid slide-up">
                                {filteredDrivers.map(driver => (
                                    <DriverCard key={driver.id} driver={driver} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- THE LEGAL FAILSAFE --- */}
                    {!isLoading && !error && (
                        <div className="ppum-disclaimer-wrapper slide-up">
                            <SafetyDisclaimer />
                        </div>
                    )}

                    {/* Mobile Bottom Spacer to prevent Home Bar overlap */}
                    <div className="ppum-bottom-spacer" />
                </div>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                /* --- LAYOUT CHASSIS --- */
                .ppum-viewport {
                    background: var(--bg-body);
                }

                .ppum-scroll-area {
                    padding: 0; /* Padding is handled internally to allow the sticky header to bleed to edges */
                    display: flex;
                    justify-content: center;
                }

                .ppum-master-chassis {
                    width: 100%;
                    max-width: 1200px; /* Expansive layout for high-end desktop displays */
                    display: flex;
                    flex-direction: column;
                    padding: 32px 24px;
                }

                /* --- HEADER --- */
                .ppum-header {
                    margin-bottom: 24px;
                }

                .ppum-title-group {
                    display: flex;
                    gap: 16px;
                }

                .ppum-brand-icon {
                    color: var(--brand-primary);
                    margin-top: 4px;
                }

                .ppum-page-title {
                    margin: 0 0 8px 0;
                    font-size: 32px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -1px;
                    line-height: 1;
                }

                .ppum-page-subtitle {
                    margin: 0;
                    font-size: 15px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                /* --- STICKY FILTER --- */
                .ppum-sticky-filter {
                    position: sticky;
                    top: -32px; /* Offsets the master chassis padding */
                    z-index: var(--z-dock);
                    /* Slight background blur over the body color to make scrolling cards underneath look beautiful */
                    background: color-mix(in srgb, var(--bg-body) 90%, transparent);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    padding: 24px 0 16px 0;
                    margin-bottom: 16px;
                    /* Negative margins to allow the blurred background to touch the edges */
                    margin-left: -24px;
                    margin-right: -24px;
                    padding-left: 24px;
                    padding-right: 24px;
                    border-bottom: 1px solid var(--border-subtle);
                }

                /* --- FLUID AUTO-GRID (The Physics Core) --- */
                .ppum-content-zone {
                    min-height: 400px; /* Prevents layout jump when rendering */
                    margin-bottom: 40px;
                }

                .ppum-grid {
                    display: grid;
                    /* This single line of CSS creates a masonry-style responsive layout. 
                       It creates as many columns as will fit, ensuring no column is ever smaller than 340px. 
                       If the screen is smaller than 340px (mobile), it perfectly stacks into 1 column. */
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 24px;
                    align-items: start; /* Prevents cards from artificially stretching vertically */
                }

                /* --- STATES --- */
                .ppum-skeleton-card {
                    height: 280px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                }

                .ppum-empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 60px 24px;
                    background: var(--bg-surface);
                    border: 1px dashed var(--border-subtle);
                    border-radius: var(--radius-lg);
                }

                .ppum-empty-icon {
                    color: var(--border-subtle);
                    margin-bottom: 16px;
                }

                .ppum-empty-state h3 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .ppum-empty-state p {
                    margin: 0 0 24px 0;
                    font-size: 14px;
                    color: var(--text-muted);
                    max-width: 400px;
                    line-height: 1.5;
                }

                .ppum-reset-btn {
                    height: 40px;
                    padding: 0 24px;
                }

                /* --- ANIMATIONS & LAYOUT FIXES --- */
                .slide-up { animation: ppumSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @keyframes ppumSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .ppum-bottom-spacer {
                    height: 80px; /* Safe space for iOS Home Bar / Android Navigation */
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 768px) {
                    .ppum-master-chassis { padding: 24px 16px; }
                    .ppum-sticky-filter {
                        top: -24px;
                        margin-left: -16px;
                        margin-right: -16px;
                        padding-left: 16px;
                        padding-right: 16px;
                    }
                    .ppum-grid {
                        /* On highly constrained phone screens, allow the card to shrink slightly more */
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 16px;
                    }
                }
            `}</style>
        </div>
    );
};