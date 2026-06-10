/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Digital Ticket Vault (Module 7/24)
 * File: src/modules/tickets/components/TicketEmptyState.jsx
 * * DESCRIPTION:
 * The high-conversion "Zero Data" view. Renders when the data engine 
 * returns an empty array for active or past tickets.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. CONVERSION-FOCUSED UI: Transforms a dead-end "No Tickets" screen 
 * into a direct funnel back to the booking engine.
 * 2. HOLOGRAPHIC LAYERING: Uses hardware-accelerated CSS blurs and 
 * brand-tinted glows to make the empty state feel like a premium feature 
 * rather than an error or missing data.
 * 3. ISOLATED ROUTING: Exposes an `onBookTrip` event hook, allowing the 
 * parent module to dictate navigation physics without breaking component purity.
 */

import React from 'react';
import { Ticket, Search, ArrowRight } from 'lucide-react';

export const TicketEmptyState = ({ 
    type = 'active', // 'active' | 'past' - Allows dynamic text based on the active tab
    onBookTrip = () => window.location.href = '/' // Failsafe routing back to discovery
}) => {
    // ========================================================================
    // DYNAMIC CONTENT RESOLVER
    // ========================================================================
    const content = {
        active: {
            title: "No Upcoming Journeys",
            subtitle: "Your digital boarding pass vault is currently empty. Book your next trip across East Africa to instantly secure your tickets here."
        },
        past: {
            title: "No Travel History",
            subtitle: "You haven't completed any trips with us yet. Once you travel, your historical boarding passes and receipts will be archived here."
        }
    };

    const currentContext = content[type] || content.active;

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="tes-viewport fade-in">
            <div className="tes-chassis">
                
                {/* --- THE HOLOGRAPHIC ICON MATRIX --- */}
                <div className="tes-icon-vault">
                    <div className="tes-glow-orb"></div>
                    <div className="tes-icon-shield">
                        <Ticket size={48} strokeWidth={1.5} className="tes-primary-icon" />
                        <div className="tes-micro-badge">
                            <Search size={14} strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* --- TYPOGRAPHY --- */}
                <div className="tes-text-group">
                    <h3 className="tes-title">{currentContext.title}</h3>
                    <p className="tes-subtitle">{currentContext.subtitle}</p>
                </div>

                {/* --- CONVERSION ROUTING --- */}
                <button className="ayabus-btn tes-action-btn" onClick={onBookTrip}>
                    <span>Find a Route</span>
                    <ArrowRight size={18} />
                </button>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for instantaneous theming.
            ======================================================================== */}
            <style>{`
                .tes-viewport {
                    width: 100%;
                    min-height: 55vh; /* Ensures it takes up sufficient vertical space in the vault */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                }

                .tes-chassis {
                    max-width: 440px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 32px;
                }

                /* --- ICON MATRIX --- */
                .tes-icon-vault {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .tes-glow-orb {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: color-mix(in srgb, var(--brand-primary) 15%, transparent);
                    filter: blur(24px);
                    z-index: 0;
                    animation: pulseGlow 4s ease-in-out infinite alternate;
                }

                .tes-icon-shield {
                    position: relative;
                    z-index: 1;
                    width: 88px;
                    height: 88px;
                    border-radius: var(--radius-full);
                    background: var(--bg-surface);
                    border: 2px dashed var(--border-subtle);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.04);
                }

                .tes-primary-icon {
                    color: var(--brand-primary);
                    opacity: 0.9;
                }

                .tes-micro-badge {
                    position: absolute;
                    bottom: -4px;
                    right: -4px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: var(--brand-primary);
                    color: #ffffff; /* Explicit white to contrast with brand color */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid var(--bg-body); /* Creates a cut-out effect */
                    box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary) 40%, transparent);
                }

                /* --- TEXT GEOMETRY --- */
                .tes-text-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .tes-title {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .tes-subtitle {
                    margin: 0;
                    font-size: 15px;
                    line-height: 1.6;
                    color: var(--text-muted);
                }

                /* --- ACTION BUTTON --- */
                .tes-action-btn {
                    height: 56px;
                    padding: 0 36px;
                    font-size: 16px;
                    letter-spacing: 0.5px;
                    gap: 12px;
                    border-radius: var(--radius-md);
                    box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 25%, transparent);
                }

                /* --- ANIMATIONS --- */
                .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @keyframes fadeIn { 
                    0% { opacity: 0; transform: scale(0.98) translateY(10px); } 
                    100% { opacity: 1; transform: scale(1) translateY(0); } 
                }

                @keyframes pulseGlow {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.1); opacity: 1; }
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 480px) {
                    .tes-viewport { padding: 32px 16px; min-height: 50vh; }
                    .tes-title { font-size: 22px; }
                    .tes-action-btn { width: 100%; justify-content: center; }
                    .tes-icon-vault { width: 100px; height: 100px; }
                    .tes-icon-shield { width: 72px; height: 72px; }
                }
            `}</style>
        </div>
    );
};