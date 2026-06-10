/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Customer Support (Module 3/24)
 * File: src/modules/customer-support/components/ContactCard.jsx
 * * DESCRIPTION:
 * A high-fidelity, interactive card displaying communication channels.
 * * WORLD-CLASS ENGINEERING:
 * 1. NATIVE PROTOCOL ROUTING: Dynamically builds hrefs tailored to the OS 
 * (tel, mailto, wa.me) to leverage the device's native hardware.
 * 2. CLIPBOARD PHYSICS: Implements a frictionless copy-to-clipboard API 
 * with an auto-expiring visual confirmation state.
 * 3. FLUID HOVER METRICS: Subtle background and transform transitions 
 * provide tactile feedback before the user even clicks.
 */

import React, { useState } from 'react';
import { Copy, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const ContactCard = ({ 
    title, 
    icon: Icon, 
    items = [], 
    type = 'phone' // 'phone' | 'whatsapp' | 'email'
}) => {
    // State to track which item was copied for the visual toast
    const [copiedIndex, setCopiedIndex] = useState(null);

    // ========================================================================
    // 1. HARDWARE HANDOFF LOGIC
    // Generates the exact link props needed to trigger native OS apps
    // ========================================================================
    const getLinkProps = (type, value) => {
        switch (type) {
            case 'whatsapp':
                return { href: `https://wa.me/${value}`, target: '_blank', rel: 'noopener noreferrer' };
            case 'phone':
                return { href: `tel:${value}` };
            case 'email':
                return { href: `mailto:${value}` };
            default:
                return { href: '#' };
        }
    };

    // ========================================================================
    // 2. CLIPBOARD ENGINE
    // Failsafe for users who don't want to use native app routing
    // ========================================================================
    const handleCopy = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            // Auto-reset the visual checkmark after 2 seconds
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('[AyaBus Telemetry] Clipboard access denied:', err);
        }
    };

    // ========================================================================
    // 3. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="cc-chassis">
            {/* Header Vault */}
            <div className="cc-header">
                <div className={`cc-icon-wrapper is-${type}`}>
                    <Icon size={20} />
                </div>
                <h3 className="cc-title">{title}</h3>
            </div>

            {/* List Matrix */}
            <div className="cc-list-matrix">
                {items.map((item, idx) => {
                    const isCopied = copiedIndex === idx;
                    const linkProps = getLinkProps(type, item.value);

                    return (
                        <div key={idx} className="cc-item-row">
                            
                            {/* Left: Metadata */}
                            <div className="cc-item-data">
                                <span className="item-label">{item.label}</span>
                                <span className="item-display">{item.display}</span>
                            </div>

                            {/* Right: Actions */}
                            <div className="cc-item-actions">
                                {/* The Clipboard Failsafe */}
                                <button 
                                    className="cc-action-btn copy-btn" 
                                    onClick={() => handleCopy(item.display, idx)}
                                    aria-label={`Copy ${item.display}`}
                                    title="Copy to clipboard"
                                >
                                    {isCopied ? (
                                        <CheckCircle2 size={16} className="text-success scale-in" />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>

                                {/* The Native Hardware Trigger */}
                                <a 
                                    {...linkProps}
                                    className="ayabus-btn cc-launch-btn"
                                    aria-label={`Open in ${type}`}
                                >
                                    <span className="hide-on-mobile">Connect</span>
                                    <ArrowUpRight size={16} />
                                </a>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* ========================================================================
                4. COMPONENT-SCOPED STYLES
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .cc-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .cc-chassis:hover {
                    border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--border-subtle));
                    box-shadow: 0 12px 32px rgba(0,0,0,0.06);
                }

                /* --- HEADER --- */
                .cc-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 24px;
                    border-bottom: 1px solid var(--border-subtle);
                    background: var(--bg-body);
                }

                .cc-icon-wrapper {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Contextual Colors for different contact methods */
                .cc-icon-wrapper.is-phone { background: color-mix(in srgb, var(--brand-primary) 15%, transparent); color: var(--brand-primary); }
                .cc-icon-wrapper.is-whatsapp { background: color-mix(in srgb, #10B981 15%, transparent); color: #10B981; }
                .cc-icon-wrapper.is-email { background: color-mix(in srgb, #6366F1 15%, transparent); color: #6366F1; }

                .cc-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                /* --- LIST MATRIX --- */
                .cc-list-matrix {
                    display: flex;
                    flex-direction: column;
                }

                .cc-item-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-subtle);
                    transition: background 0.2s;
                }

                .cc-item-row:last-child {
                    border-bottom: none;
                }

                .cc-item-row:hover {
                    background: var(--bg-body);
                }

                /* --- DATA LEFT --- */
                .cc-item-data {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .item-label {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .item-display {
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                /* --- ACTIONS RIGHT --- */
                .cc-item-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .cc-action-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: 1px solid var(--border-subtle);
                    background: var(--bg-surface);
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .cc-action-btn:hover {
                    background: var(--bg-body);
                    color: var(--text-main);
                    border-color: var(--text-main);
                }

                .text-success { color: #10B981 !important; }

                .cc-launch-btn {
                    height: 44px;
                    padding: 0 20px;
                    gap: 8px;
                    font-size: 14px;
                    background: var(--text-main);
                    color: var(--bg-surface);
                    text-decoration: none;
                }

                .cc-launch-btn:hover {
                    filter: brightness(1.2);
                    transform: translateY(-2px);
                }

                /* --- ANIMATIONS --- */
                .scale-in {
                    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes scaleIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 640px) {
                    .hide-on-mobile { display: none; }
                    .cc-item-row { padding: 16px; flex-direction: column; align-items: flex-start; gap: 16px; }
                    .cc-item-actions { width: 100%; justify-content: flex-end; border-top: 1px dashed var(--border-subtle); padding-top: 16px; }
                    .cc-launch-btn { flex: 1; justify-content: center; } /* Button takes remaining width */
                }
            `}</style>
        </div>
    );
};