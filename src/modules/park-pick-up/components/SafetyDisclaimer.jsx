/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Park Pick-Up (Module 13/24)
 * File: src/modules/park-pick-up/components/SafetyDisclaimer.jsx
 * * DESCRIPTION:
 * The absolute bottom line of defense. A highly visible, non-dismissible 
 * advisory panel that educates the passenger on safety protocols while 
 * legally shielding AyaBus from third-party last-mile disputes.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. THE AMBER ZONE: Utilizes high-contrast amber accents to visually 
 * separate legal warnings from standard UI elements, ensuring it is read.
 * 2. COGNITIVE CHUNKING: Translates dense legal liability copy into three 
 * rapidly scannable, icon-driven directives for passengers in a rush.
 * 3. NO-FLEX LAYOUT: Built with rigid spacing to ensure it never collapses 
 * or breaks, regardless of the device's screen size or orientation.
 */

import React from 'react';
import { 
    ShieldAlert, 
    ScanEye, 
    UserCheck, 
    Banknote 
} from 'lucide-react';

export const SafetyDisclaimer = () => {
    return (
        <div className="psd-chassis" aria-labelledby="psd-title">
            
            <div className="psd-header">
                <div className="psd-icon-vault">
                    <ShieldAlert size={20} className="psd-warning-icon" />
                </div>
                <h3 id="psd-title" className="psd-title">Passenger Safety Advisory</h3>
            </div>

            <p className="psd-lead-text">
                AyaBus provides this directory as a convenience. These drivers are independent partners. For your absolute safety, you must adhere to the following rules before boarding:
            </p>

            <div className="psd-directive-grid">
                
                {/* Rule 1: Visual Matching */}
                <div className="psd-rule-item">
                    <ScanEye size={18} className="psd-rule-icon" />
                    <div className="psd-rule-content">
                        <h4>Verify the License Plate</h4>
                        <p>Never enter a vehicle if the physical number plate does not perfectly match the one listed on their AyaBus profile.</p>
                    </div>
                </div>

                {/* Rule 2: Identity Matching */}
                <div className="psd-rule-item">
                    <UserCheck size={18} className="psd-rule-icon" />
                    <div className="psd-rule-content">
                        <h4>Verify the Driver</h4>
                        <p>Ensure the person driving the vehicle matches the portrait and name on their profile. Do not accept "substitute" drivers.</p>
                    </div>
                </div>

                {/* Rule 3: Liability & Pricing */}
                <div className="psd-rule-item">
                    <Banknote size={18} className="psd-rule-icon" />
                    <div className="psd-rule-content">
                        <h4>Independent Negotiation</h4>
                        <p>AyaBus takes zero commission on last-mile rides. All price negotiations and payments are strictly between you and the driver.</p>
                    </div>
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .psd-chassis {
                    background: color-mix(in srgb, #F59E0B 4%, var(--bg-surface));
                    border: 1px solid color-mix(in srgb, #F59E0B 30%, var(--border-subtle));
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 100%;
                }

                /* --- HEADER --- */
                .psd-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .psd-icon-vault {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: color-mix(in srgb, #F59E0B 15%, transparent);
                    border-radius: var(--radius-sm);
                }

                .psd-warning-icon {
                    color: #F59E0B; /* Universal Amber Warning */
                }

                .psd-title {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                    text-transform: uppercase;
                }

                .psd-lead-text {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.6;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                /* --- THE DIRECTIVES --- */
                .psd-directive-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-top: 8px;
                    background: var(--bg-surface);
                    padding: 16px;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border-subtle);
                }

                .psd-rule-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }

                .psd-rule-icon {
                    color: var(--text-muted);
                    margin-top: 2px;
                    flex-shrink: 0;
                }

                .psd-rule-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .psd-rule-content h4 {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .psd-rule-content p {
                    margin: 0;
                    font-size: 13px;
                    line-height: 1.5;
                    color: var(--text-muted);
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 480px) {
                    .psd-chassis {
                        padding: 20px;
                        border-radius: 0; /* Flush to edges on mobile */
                        border-left: none;
                        border-right: none;
                    }
                    .psd-directive-grid {
                        padding: 12px;
                        gap: 20px; /* Increase gap slightly when stacking tight text */
                    }
                }
            `}</style>
        </div>
    );
};