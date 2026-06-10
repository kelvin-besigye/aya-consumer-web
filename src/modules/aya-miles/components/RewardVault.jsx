/**
 * 🌍 AYABUS CONSUMER WEB (The Frequency Engine)
 * ------------------------------------------------------------------
 * Module: AyaMiles (Module 9/24)
 * File: src/modules/aya-miles/components/RewardVault.jsx
 * * DESCRIPTION:
 * The digital locker for earned discount codes. It renders active vouchers 
 * as physical-looking tickets and provides a frictionless 1-tap copy mechanism.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-IMAGE TICKET GEOMETRY: Uses pure CSS radial drop-outs to simulate 
 * the perforated edges of a physical bus ticket, ensuring 0ms load times and 
 * perfect scaling across all devices.
 * 2. KINETIC CLIPBOARD: Tapping the code interacts directly with the OS clipboard, 
 * providing an immediate visual state-change to confirm success to the user.
 * 3. GRACEFUL DEGRADATION: If the user has no rewards, it renders a high-fidelity 
 * empty state that acts as a motivational anchor rather than a dead end.
 */

import React, { useState } from 'react';
import { 
    Ticket, 
    Copy, 
    CheckCircle2, 
    Gift, 
    Info 
} from 'lucide-react';

export const RewardVault = ({ vouchers = [], isLoading }) => {
    // ========================================================================
    // 1. THE HAPTIC STATE MACHINE
    // Tracks which specific voucher code was just copied
    // ========================================================================
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopy = async (code) => {
        if (!code) return;
        
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            
            // Revert the button back to the "Copy" icon after 2.5 seconds
            setTimeout(() => {
                setCopiedCode(null);
            }, 2500);
        } catch (err) {
            console.error('[AyaBus Vault] Failed to write to clipboard:', err);
        }
    };

    // ========================================================================
    // 2. RENDER PAYLOADS
    // ========================================================================

    // A. The Boot State
    if (isLoading) {
        return (
            <div className="rv-chassis">
                <div className="rv-header-row">
                    <h3 className="rv-title">Active Rewards</h3>
                </div>
                <div className="rv-ticket-skeleton pulse-glow" />
            </div>
        );
    }

    // B. The Empty State (Motivational Failsafe)
    if (!vouchers || vouchers.length === 0) {
        return (
            <div className="rv-chassis">
                <div className="rv-header-row">
                    <h3 className="rv-title">Reward Vault</h3>
                    <span className="rv-count-badge">0</span>
                </div>
                
                <div className="rv-empty-state">
                    <div className="rv-empty-icon-box">
                        <Gift size={32} className="rv-empty-icon" />
                    </div>
                    <h4>Your vault is empty</h4>
                    <p>Complete your first 20 trips to automatically unlock your first 20% discount voucher.</p>
                </div>
            </div>
        );
    }

    // C. The Active Vault
    return (
        <div className="rv-chassis">
            <div className="rv-header-row">
                <h3 className="rv-title">Reward Vault</h3>
                <span className="rv-count-badge">{vouchers.length}</span>
            </div>

            <div className="rv-ticket-list">
                {vouchers.map((voucher, index) => {
                    const isCopied = copiedCode === voucher.code;

                    return (
                        <div 
                            key={voucher.id || index} 
                            className="rv-ticket slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* LEFT SIDE: The Value Matrix */}
                            <div className="rv-value-zone">
                                <div className="rv-discount-circle">
                                    <span className="rv-discount-number">{voucher.discount_percentage}</span>
                                    <span className="rv-discount-symbol">%</span>
                                </div>
                                <span className="rv-discount-label">OFF ANY TRIP</span>
                            </div>

                            {/* RIGHT SIDE: The Cryptographic Code */}
                            <div className="rv-code-zone">
                                <div className="rv-code-header">
                                    <Ticket size={14} className="rv-code-icon" />
                                    <span>Single-Use Voucher</span>
                                </div>
                                
                                <div className="rv-code-display">
                                    <span className="rv-exact-code">{voucher.code}</span>
                                </div>

                                <button 
                                    className={`rv-copy-btn ${isCopied ? 'rv-copied' : ''}`}
                                    onClick={() => handleCopy(voucher.code)}
                                >
                                    {isCopied ? (
                                        <>
                                            <CheckCircle2 size={16} />
                                            <span>Copied to Clipboard</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            <span>Copy Code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Supplementary Info */}
            <div className="rv-info-row">
                <Info size={14} className="rv-info-icon" />
                <span>Paste your code at checkout. Valid for any route.</span>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for Light/Dark mode respect.
            ======================================================================== */}
            <style>{`
                .rv-chassis {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* --- HEADER --- */
                .rv-header-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 4px;
                }

                .rv-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .rv-count-badge {
                    background: var(--brand-primary);
                    color: var(--bg-body); /* High contrast */
                    font-size: 12px;
                    font-weight: 900;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                }

                /* --- THE DIGITAL TICKET GEOMETRY --- */
                .rv-ticket-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .rv-ticket {
                    display: flex;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
                }

                /* The CSS "Bite Marks" for the physical ticket feel */
                .rv-ticket::before,
                .rv-ticket::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    background-color: var(--bg-body); /* Must match parent background */
                    border-radius: 50%;
                    border: 1px solid var(--border-subtle);
                    z-index: 2;
                }

                .rv-ticket::before {
                    left: -11px;
                    border-right-color: transparent; /* Hides the inner border */
                    border-top-color: transparent;
                    border-bottom-color: transparent;
                }

                .rv-ticket::after {
                    right: -11px;
                    border-left-color: transparent;
                    border-top-color: transparent;
                    border-bottom-color: transparent;
                }

                /* --- VALUE ZONE (Left Side) --- */
                .rv-value-zone {
                    flex: 0 0 120px;
                    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px 16px;
                    border-right: 2px dashed var(--border-subtle);
                }

                .rv-discount-circle {
                    display: flex;
                    align-items: baseline;
                    color: var(--brand-primary);
                }

                .rv-discount-number {
                    font-size: 40px;
                    font-weight: 900;
                    line-height: 1;
                    letter-spacing: -2px;
                }

                .rv-discount-symbol {
                    font-size: 20px;
                    font-weight: 800;
                    margin-left: 2px;
                }

                .rv-discount-label {
                    margin-top: 4px;
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    text-align: center;
                }

                /* --- CODE ZONE (Right Side) --- */
                .rv-code-zone {
                    flex: 1;
                    padding: 20px 24px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .rv-code-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-muted);
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }

                .rv-exact-code {
                    font-size: 22px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: 2px;
                    font-family: monospace; /* Ensures distinct character recognition */
                }

                /* --- ACTION BUTTON --- */
                .rv-copy-btn {
                    margin-top: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    height: 40px;
                    background: var(--bg-input);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .rv-copy-btn:hover {
                    border-color: var(--brand-primary);
                    color: var(--brand-primary);
                }

                .rv-copy-btn.rv-copied {
                    background: color-mix(in srgb, #10B981 10%, transparent);
                    border-color: #10B981;
                    color: #10B981;
                }

                /* --- EMPTY & LOADING STATES --- */
                .rv-empty-state {
                    background: var(--bg-surface);
                    border: 1px dashed var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 40px 24px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .rv-empty-icon-box {
                    width: 64px;
                    height: 64px;
                    background: var(--bg-body);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                }

                .rv-empty-icon { color: var(--text-muted); }
                .rv-empty-state h4 { margin: 0 0 8px 0; color: var(--text-main); font-size: 16px; }
                .rv-empty-state p { margin: 0; color: var(--text-muted); font-size: 14px; max-width: 280px; line-height: 1.5; }

                .rv-ticket-skeleton {
                    height: 140px;
                    background: var(--bg-surface);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-subtle);
                }

                .rv-info-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    color: var(--text-muted);
                    font-size: 12px;
                    margin-top: 8px;
                }

                /* --- ANIMATIONS --- */
                .slide-up { animation: rvSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
                @keyframes rvSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* --- RESPONSIVE ADJUSTMENTS --- */
                @media (max-width: 480px) {
                    .rv-ticket { flex-direction: column; }
                    .rv-value-zone { 
                        flex: auto; 
                        padding: 16px; 
                        border-right: none; 
                        border-bottom: 2px dashed var(--border-subtle); 
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    .rv-discount-label { margin-top: 0; margin-left: 12px; text-align: left; }
                    
                    /* Adjust bite marks for vertical stack */
                    .rv-ticket::before, .rv-ticket::after {
                        top: auto;
                        bottom: auto;
                        left: auto;
                        right: auto;
                        /* This would require specific vertical repositioning, but hiding them on extreme mobile is cleaner */
                        display: none; 
                    }
                }
            `}</style>
        </div>
    );
};