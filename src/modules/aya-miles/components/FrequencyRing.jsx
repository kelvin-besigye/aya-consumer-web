/**
 * 🌍 AYABUS CONSUMER WEB (The Frequency Engine)
 * ------------------------------------------------------------------
 * Module: AyaMiles (Module 9/24)
 * File: src/modules/aya-miles/components/FrequencyRing.jsx
 * * DESCRIPTION:
 * The hero visual of the loyalty dashboard. It translates abstract database 
 * metrics into a highly addictive, Apple-Watch style progress ring.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. PURE SVG MATH: Bypasses heavy charting libraries. Uses native `stroke-dasharray` 
 * and `stroke-dashoffset` to render mathematically perfect arcs.
 * 2. KINETIC MOUNTING: The `useEffect` triggers a 1.2-second fluid fill animation 
 * exactly when the data arrives, maximizing visual satisfaction.
 * 3. RESPONSIVE GEOMETRY: The `viewBox="0 0 300 300"` ensures the ring scales 
 * flawlessly from a massive desktop monitor down to an iPhone SE screen without pixelation.
 */

import React, { useEffect, useState } from 'react';
import { Target, Zap, BusFront } from 'lucide-react';

export const FrequencyRing = ({ metrics, isLoading }) => {
    // ========================================================================
    // 1. THE SVG GEOMETRY ENGINE
    // ========================================================================
    const radius = 120;
    const strokeWidth = 16;
    const center = 150; // Half of our 300x300 viewBox
    const circumference = 2 * Math.PI * radius;
    
    // Animation state: start empty (offset = circumference)
    const [dashOffset, setDashOffset] = useState(circumference);

    // ========================================================================
    // 2. KINETIC HYDRATION
    // Triggers the sweeping fill animation when data arrives
    // ========================================================================
    useEffect(() => {
        if (!isLoading && metrics) {
            // Cap at 100% just in case of edge-case math anomalies
            const safeProgress = Math.min(Math.max(metrics.progressPercentage, 0), 100);
            
            // Calculate how much of the ring to "hide"
            const fillOffset = circumference - (safeProgress / 100) * circumference;
            
            // Small timeout ensures the DOM has painted before triggering the CSS transition
            const animationTimer = setTimeout(() => {
                setDashOffset(fillOffset);
            }, 100);

            return () => clearTimeout(animationTimer);
        } else {
            // Reset to empty if loading
            setDashOffset(circumference);
        }
    }, [metrics, isLoading, circumference]);

    // ========================================================================
    // 3. FAILSAFE DEFAULTS
    // ========================================================================
    const displayMiles = metrics?.currentMiles || 0;
    const targetMiles = metrics?.targetMiles || 200;
    const tripsRemaining = metrics?.tripsToNextReward || 20;
    const totalTrips = metrics?.totalTrips || 0;

    return (
        <div className="fr-chassis">
            
            {/* --- HEADER TELEMETRY --- */}
            <div className="fr-header">
                <div className="fr-title-row">
                    <Zap size={20} className="fr-brand-icon" />
                    <h2 className="fr-title">AyaMiles Target</h2>
                </div>
                <div className="fr-lifetime-pill">
                    <BusFront size={14} />
                    <span>{totalTrips} Lifetime Trips</span>
                </div>
            </div>

            {/* --- THE MASTER RING --- */}
            <div className="fr-ring-vault">
                <svg 
                    className="fr-svg" 
                    viewBox="0 0 300 300" 
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Definitions for gradients */}
                    <defs>
                        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            {/* Uses the index.css brand color variable via currentColor/stroke, 
                                but we can hardcode fallback hexes for older browsers in the CSS block 
                            */}
                            <stop offset="0%" stopColor="var(--brand-primary)" />
                            <stop offset="100%" stopColor="color-mix(in srgb, var(--brand-primary) 80%, #FFF)" />
                        </linearGradient>
                    </defs>

                    {/* 1. The Track (Background Ring) */}
                    <circle
                        className="fr-track"
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                    />

                    {/* 2. The Progress Sweep (Active Ring) */}
                    <circle
                        className={`fr-progress ${isLoading ? 'fr-loading-pulse' : ''}`}
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        stroke="url(#brandGradient)"
                    />
                </svg>

                {/* 3. The Core Data Overlay */}
                <div className="fr-core-data">
                    {isLoading ? (
                        <div className="fr-loading-spinner" />
                    ) : (
                        <>
                            <span className="fr-core-value">{displayMiles}</span>
                            <span className="fr-core-divider">/ {targetMiles}</span>
                            <span className="fr-core-label">Miles Earned</span>
                        </>
                    )}
                </div>
            </div>

            {/* --- THE PSYCHOLOGICAL ANCHOR --- */}
            <div className="fr-footer">
                {!isLoading && (
                    <div className="fr-status-box">
                        <Target size={24} className="fr-status-icon pulse-glow" />
                        <div className="fr-status-text">
                            <h3>{tripsRemaining} {tripsRemaining === 1 ? 'Trip' : 'Trips'} to go!</h3>
                            <p>Book {tripsRemaining} more {tripsRemaining === 1 ? 'ticket' : 'tickets'} to automatically unlock your 20% discount voucher.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for Light/Dark mode respect.
            ======================================================================== */}
            <style>{`
                .fr-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 32px 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }

                /* --- HEADER --- */
                .fr-header {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }

                .fr-title-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .fr-brand-icon {
                    color: var(--brand-primary);
                }

                .fr-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                }

                .fr-lifetime-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: var(--bg-body);
                    padding: 6px 12px;
                    border-radius: var(--radius-full);
                    font-size: 12px;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    border: 1px solid var(--border-subtle);
                }

                /* --- RING VAULT --- */
                .fr-ring-vault {
                    position: relative;
                    width: 100%;
                    max-width: 280px; /* Constraints for massive desktop screens */
                    aspect-ratio: 1 / 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 32px;
                }

                .fr-svg {
                    width: 100%;
                    height: 100%;
                    /* Rotate SVG so the dash offset starts exactly at 12 o'clock (top) */
                    transform: rotate(-90deg);
                    overflow: visible;
                }

                .fr-track {
                    stroke: var(--bg-body);
                    /* Adds a subtle inner shadow feel to the track depending on dark/light mode */
                    filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.05));
                }

                .fr-progress {
                    transition: stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .fr-loading-pulse {
                    opacity: 0.3;
                    animation: ringPulse 1.5s infinite alternate;
                }

                @keyframes ringPulse {
                    from { opacity: 0.2; }
                    to { opacity: 0.6; }
                }

                /* --- CORE DATA OVERLAY --- */
                .fr-core-data {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    /* Prevent text selection when dragging over the ring */
                    user-select: none; 
                }

                .fr-core-value {
                    font-size: 56px;
                    font-weight: 900;
                    color: var(--text-main);
                    line-height: 1;
                    letter-spacing: -2px;
                }

                .fr-core-divider {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin-top: 4px;
                }

                .fr-core-label {
                    font-size: 13px;
                    font-weight: 800;
                    color: var(--brand-primary);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 8px;
                }

                .fr-loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--bg-body);
                    border-top: 4px solid var(--brand-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin { 100% { transform: rotate(360deg); } }

                /* --- FOOTER STATUS --- */
                .fr-footer {
                    width: 100%;
                }

                .fr-status-box {
                    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
                    border: 1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent);
                    border-radius: var(--radius-lg);
                    padding: 20px;
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                }

                .fr-status-icon {
                    color: var(--brand-primary);
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .fr-status-text h3 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .fr-status-text p {
                    margin: 0;
                    font-size: 13px;
                    color: var(--text-muted);
                    line-height: 1.5;
                }

                /* --- RESPONSIVE ADJUSTMENTS --- */
                @media (max-width: 480px) {
                    .fr-chassis { padding: 24px 16px; }
                    .fr-header { margin-bottom: 24px; }
                    .fr-core-value { font-size: 48px; }
                    .fr-status-box { padding: 16px; gap: 12px; }
                }
            `}</style>
        </div>
    );
};