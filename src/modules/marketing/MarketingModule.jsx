/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Marketing (Module 12/24)
 * File: src/modules/marketing/MarketingModule.jsx
 * * DESCRIPTION:
 * The Master Orchestrator for the Marketing ecosystem. Designed to be 
 * injected directly adjacent to the core Booking Module. It manages 
 * the interactive state between the automated carousel and the expansion modal.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. STATE LIFTING: Holds the `activeFeature` state at the highest level, 
 * ensuring the carousel and modal remain perfectly synchronized without prop drilling.
 * 2. FLUID CHASSIS: Completely responsive. Uses `width: 100%` and `overflow: hidden` 
 * to guarantee it never breaks the parent grid layout, whether on Desktop or Mobile.
 * 3. ZERO-LATENCY BOOT: Imports the static JS payload directly, meaning 
 * the marketing engine renders in 0ms without waiting for a database fetch.
 */

import React, { useState } from 'react';
import { Award } from 'lucide-react';

// Live Wires: The Core Data Payload (Phase 1)
import { MARKETING_PAYLOAD } from './data/marketing.payload';

// Live Wires: The Atomic UI Components (Phase 2)
import { MarketingCarousel } from './components/MarketingCarousel';
import { FeatureDetailModal } from './components/FeatureDetailModal';

export const MarketingModule = () => {
    // ========================================================================
    // 1. STATE MACHINE
    // Tracks which feature the passenger wants to deep-dive into.
    // ========================================================================
    const [activeFeature, setActiveFeature] = useState(null);

    const handleFeatureSelect = (feature) => {
        setActiveFeature(feature);
    };

    const handleCloseModal = () => {
        setActiveFeature(null);
    };

    // ========================================================================
    // 2. RENDER PAYLOAD
    // ========================================================================
    return (
        <section className="mmod-chassis" aria-label="Why Choose AyaBus">
            
            {/* --- THE MARKETING HEADER --- */}
            <div className="mmod-header">
                <div className="mmod-title-group">
                    <Award size={20} className="mmod-brand-icon" />
                    <h2 className="mmod-title">The AyaBus Standard</h2>
                </div>
                <p className="mmod-subtitle">
                    World-class travel, engineered for the East African road.
                </p>
            </div>

            {/* --- THE KINETIC CAROUSEL --- */}
            <div className="mmod-carousel-zone">
                <MarketingCarousel 
                    features={MARKETING_PAYLOAD} 
                    onFeatureSelect={handleFeatureSelect} 
                />
            </div>

            {/* --- THE GLASSMORPHIC EXPANSION --- */}
            <FeatureDetailModal 
                isOpen={!!activeFeature} 
                feature={activeFeature} 
                onClose={handleCloseModal} 
            />

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .mmod-chassis {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                    /* overflow: hidden ensures the carousel optical mask doesn't bleed */
                    overflow: hidden; 
                    /* Subtle spacing to separate it from the booking engine */
                    padding: 16px 0; 
                }

                /* --- HEADER DOMAIN --- */
                .mmod-header {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    padding: 0 24px;
                    margin-bottom: 8px; /* Tight margin because the carousel has its own top padding */
                }

                .mmod-title-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .mmod-brand-icon {
                    color: var(--brand-primary);
                }

                .mmod-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                    text-transform: uppercase;
                }

                .mmod-subtitle {
                    margin: 0;
                    font-size: 14px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                /* --- CAROUSEL ZONE --- */
                .mmod-carousel-zone {
                    width: 100%;
                    /* Pulls the carousel slightly wider than the padding to 
                       allow the cards to slide off-screen beautifully */
                    margin-left: -8px;
                    width: calc(100% + 16px);
                }

                /* --- RESPONSIVE ADJUSTMENTS --- */
                @media (max-width: 768px) {
                    .mmod-chassis {
                        padding: 24px 0;
                    }
                    .mmod-header {
                        padding: 0 16px;
                        margin-bottom: 0;
                    }
                    .mmod-title {
                        font-size: 16px;
                    }
                    .mmod-subtitle {
                        font-size: 13px;
                    }
                }
            `}</style>
        </section>
    );
};