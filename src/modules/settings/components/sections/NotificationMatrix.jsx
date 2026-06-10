/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Settings (Module 11/24)
 * File: src/modules/settings/components/sections/NotificationMatrix.jsx
 * * DESCRIPTION:
 * The telemetry control panel. It leverages the NativeToggle primitive 
 * to allow passengers to curate exactly how the platform communicates with them.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. COGNITIVE SEPARATION: Visually separates critical journey alerts from 
 * marketing promotions, reducing the "global opt-out" churn rate.
 * 2. REGIONAL OPTIMIZATION: Includes a WhatsApp toggle natively, recognizing 
 * it as the apex communication channel for the East African demographic.
 * 3. STATELESS ARCHITECTURE: Acts as a pure "dumb" component. It reads state 
 * and fires update events to the parent wrapper, ensuring the JSONB payload 
 * is assembled correctly before hitting the Supabase service.
 */

import React from 'react';
import { 
    BellRing, 
    MessageSquare, 
    Mail, 
    Gift, 
    Smartphone 
} from 'lucide-react';

// Live Wire: The DOM primitive built in Phase 2, File 3
import { NativeToggle } from '../ui/NativeToggle';

export const NotificationMatrix = ({ notifications = {}, onUpdate }) => {

    // ========================================================================
    // 1. THE MUTATOR DISPATCHER
    // Merges the toggled boolean into the specific sub-domain
    // ========================================================================
    const handleToggle = (telemetryKey) => {
        if (!onUpdate) return;
        
        // Tells the parent: "Update the 'notifications' block, and flip this specific key"
        onUpdate('notifications', {
            ...notifications,
            [telemetryKey]: !notifications[telemetryKey]
        });
    };

    // ========================================================================
    // 2. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="nm-chassis">
            
            {/* --- HEADER --- */}
            <div className="nm-header">
                <BellRing size={20} className="nm-brand-icon" />
                <h2>Communication Preferences</h2>
            </div>

            <div className="nm-body">
                
                {/* --- ZONE 1: TRANSACTIONAL ALERTS --- */}
                <div className="nm-zone">
                    <div className="nm-zone-title">
                        <Smartphone size={16} />
                        <h3>Critical Journey Updates</h3>
                    </div>
                    <p className="nm-zone-desc">
                        Live boarding passes, bus delays, and route changes.
                    </p>

                    <div className="nm-toggle-stack">
                        <NativeToggle 
                            id="toggle-whatsapp"
                            label="WhatsApp Integration"
                            description="Receive your boarding pass and live tracking links directly via WhatsApp."
                            isOn={!!notifications.whatsapp_alerts}
                            onToggle={() => handleToggle('whatsapp_alerts')}
                        />
                        
                        <NativeToggle 
                            id="toggle-sms"
                            label="SMS Text Messages"
                            description="Standard text alerts for departure times and platform changes."
                            isOn={!!notifications.sms_transactional}
                            onToggle={() => handleToggle('sms_transactional')}
                        />

                        <NativeToggle 
                            id="toggle-email"
                            label="Email Receipts"
                            description="PDF financial receipts and formal booking confirmations."
                            isOn={!!notifications.email_receipts}
                            onToggle={() => handleToggle('email_receipts')}
                        />
                    </div>
                </div>

                <div className="nm-divider" />

                {/* --- ZONE 2: MARKETING & RETENTION --- */}
                <div className="nm-zone">
                    <div className="nm-zone-title">
                        <Gift size={16} />
                        <h3>AyaMiles & Promotions</h3>
                    </div>
                    <p className="nm-zone-desc">
                        Discount codes and rewards from the AyaMiles frequency engine.
                    </p>

                    <div className="nm-toggle-stack">
                        <NativeToggle 
                            id="toggle-promos"
                            label="Exclusive Offers"
                            description="Be the first to know when you unlock a 20% discount voucher or holiday specials."
                            isOn={!!notifications.marketing_promos}
                            onToggle={() => handleToggle('marketing_promos')}
                        />
                    </div>
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .nm-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
                    width: 100%;
                }

                /* --- HEADER --- */
                .nm-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-subtle);
                    background: color-mix(in srgb, var(--bg-surface) 95%, var(--border-subtle));
                }

                .nm-brand-icon {
                    color: var(--brand-primary);
                }

                .nm-header h2 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                }

                /* --- BODY & ZONES --- */
                .nm-body {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 32px; /* Large spatial gap between major zones */
                }

                .nm-zone {
                    display: flex;
                    flex-direction: column;
                }

                .nm-zone-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-main);
                    margin-bottom: 4px;
                }

                .nm-zone-title h3 {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .nm-zone-title svg {
                    color: var(--text-muted);
                }

                .nm-zone-desc {
                    margin: 0 0 20px 0;
                    font-size: 13px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                /* --- THE STACK --- */
                .nm-toggle-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    background: var(--bg-body);
                    padding: 16px 20px;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border-subtle);
                }

                /* A clean separator between major configuration zones */
                .nm-divider {
                    height: 1px;
                    width: 100%;
                    background: var(--border-subtle);
                    /* Subtle dashed effect for technical elegance */
                    background-image: repeating-linear-gradient(
                        90deg, 
                        var(--border-subtle) 0, 
                        var(--border-subtle) 4px, 
                        transparent 4px, 
                        transparent 8px
                    );
                }

                /* --- RESPONSIVE ADJUSTMENTS --- */
                @media (max-width: 480px) {
                    .nm-header { padding: 16px 20px; }
                    .nm-body { padding: 20px; gap: 24px; }
                    .nm-toggle-stack { padding: 16px; gap: 16px; }
                }
            `}</style>
        </div>
    );
};