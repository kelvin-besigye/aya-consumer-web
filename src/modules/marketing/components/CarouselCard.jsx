/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Marketing (Module 12/24)
 * File: src/modules/marketing/components/CarouselCard.jsx
 * * DESCRIPTION:
 * The tactile, physical card rendered inside the horizontal auto-scroll track.
 * It serves as the primary visual hook to grab passenger attention and drive 
 * clicks into the deeper value propositions.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. SEMANTIC ACCESSIBILITY: The entire card is a `<button>`, ensuring 
 * native screen-reader support and keyboard 'Tab' navigation.
 * 2. RIGID GEOMETRY: Utilizes `flex-shrink: 0` and `scroll-snap-align: center` 
 * to act as a flawless physical anchor within the parent CSS grid.
 * 3. KINETIC HOVER STATE: Employs a combination of translateY, border-color 
 * transitions, and icon-scaling to create an irresistible urge to click.
 */

import React from 'react';
import { 
    Armchair, 
    Gift, 
    SmartphoneNfc, 
    RefreshCcw, 
    Headset,
    ArrowRight,
    Sparkles // Failsafe fallback icon
} from 'lucide-react';

// ========================================================================
// 1. THE ICON RESOLVER
// Maps the string from marketing.payload.js to the physical SVG component
// ========================================================================
const ICON_MAP = {
    'Armchair': Armchair,
    'Gift': Gift,
    'SmartphoneNfc': SmartphoneNfc,
    'RefreshCcw': RefreshCcw,
    'Headset': Headset
};

export const CarouselCard = ({ feature, onClick }) => {
    // Failsafe: Ensure component doesn't crash if data is missing
    if (!feature) return null;

    // Resolve the exact icon, defaulting to Sparkles if a new one is added to the payload but not mapped
    const IconComponent = ICON_MAP[feature.iconName] || Sparkles;

    return (
        <button 
            className="mc-card" 
            onClick={() => onClick(feature)}
            aria-label={`Learn more about ${feature.title}`}
        >
            <div className="mc-icon-vault">
                <IconComponent size={24} className="mc-feature-icon" />
            </div>

            <div className="mc-content-core">
                <h3 className="mc-title">{feature.title}</h3>
                <p className="mc-desc">{feature.short_desc}</p>
            </div>

            <div className="mc-action-footer">
                <span className="mc-action-text">Explore</span>
                <ArrowRight size={16} className="mc-action-arrow" />
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for Light/Dark mode respect.
            ======================================================================== */}
            <style>{`
                .mc-card {
                    /* The Physics of the Slide */
                    flex-shrink: 0;
                    scroll-snap-align: center;
                    width: 280px;
                    height: 100%;
                    min-height: 220px;
                    
                    /* Layout & Visuals */
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                    padding: 24px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    
                    /* The iOS Spring Transition */
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    outline: none; /* Removed default outline for custom focus-visible */
                }

                /* --- KINETIC INTERACTIONS --- */
                .mc-card:hover {
                    transform: translateY(-6px);
                    border-color: var(--brand-primary);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.04);
                }

                .mc-card:active {
                    transform: translateY(-2px);
                    transition-duration: 0.1s;
                }

                .mc-card:focus-visible {
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 20%, transparent);
                }

                /* --- THE ICON VAULT --- */
                .mc-icon-vault {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: var(--radius-md);
                    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
                    margin-bottom: 20px;
                    transition: background 0.3s ease;
                }

                .mc-feature-icon {
                    color: var(--brand-primary);
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .mc-card:hover .mc-feature-icon {
                    transform: scale(1.15) rotate(-5deg);
                }

                /* --- CONTENT TYPOGRAPHY --- */
                .mc-content-core {
                    flex-grow: 1; /* Pushes the footer to the bottom evenly */
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .mc-title {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                }

                .mc-desc {
                    margin: 0;
                    font-size: 13px;
                    color: var(--text-muted);
                    line-height: 1.5;
                    font-weight: 500;
                }

                /* --- ACTION FOOTER --- */
                .mc-action-footer {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 24px;
                    color: var(--brand-primary);
                    font-weight: 700;
                    font-size: 13px;
                    opacity: 0.8;
                    transition: all 0.3s ease;
                }

                .mc-action-arrow {
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                /* Hover effects strictly isolated to the arrow snapping forward */
                .mc-card:hover .mc-action-footer {
                    opacity: 1;
                }

                .mc-card:hover .mc-action-arrow {
                    transform: translateX(4px);
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 768px) {
                    .mc-card {
                        width: 260px; /* Slightly narrower on mobile to show the 'next' card peeking */
                        padding: 20px;
                        scroll-snap-align: start; /* On mobile, snap to the left edge rather than center */
                    }
                    .mc-icon-vault {
                        width: 40px;
                        height: 40px;
                        margin-bottom: 16px;
                    }
                    .mc-feature-icon {
                        width: 20px;
                        height: 20px;
                    }
                }
            `}</style>
        </button>
    );
};