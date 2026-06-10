/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Partner Support (Module 4/24)
 * File: src/modules/partner-support/components/ManagementFooter.jsx
 * * DESCRIPTION:
 * The executive directory. Provides direct communication lines to 
 * the management and partnership desks.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-SHIFT GRID: The layout uses CSS Grid to maintain perfect 
 * alignment of the phone and email columns, preventing jagged text edges.
 * 2. NATIVE PROTOCOL ROUTING: Implements `tel:` and `mailto:` protocols 
 * to securely hand off the interaction to the device's native OS dialer 
 * or enterprise email client (like Outlook).
 * 3. CLIPBOARD PHYSICS: Provides a seamless copy-to-clipboard interaction 
 * with a self-resolving checkmark animation for users who prefer manual data entry.
 */

import React, { useState } from 'react';
import { Phone, Mail, Copy, CheckCircle2, Building } from 'lucide-react';

// LIVE WIRE: The Executive Telemetry from Phase 1
import { MANAGEMENT_CONTACTS } from '../data/partner.constants';

export const ManagementFooter = () => {
    // State to track which item was copied for the visual toast
    const [copiedRef, setCopiedRef] = useState(null); // format: 'phone-0', 'email-1', etc.

    // ========================================================================
    // 1. CLIPBOARD ENGINE
    // ========================================================================
    const handleCopy = async (text, refId) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedRef(refId);
            // Auto-reset the visual checkmark after 2 seconds
            setTimeout(() => setCopiedRef(null), 2000);
        } catch (err) {
            console.error('[AyaBus B2B Telemetry] Clipboard access denied:', err);
        }
    };

    // ========================================================================
    // 2. RENDER PAYLOAD
    // ========================================================================
    return (
        <section className="mf-chassis">
            
            {/* The Executive Statement */}
            <div className="mf-statement-vault">
                <div className="mf-icon-shield">
                    <Building size={24} />
                </div>
                <p className="mf-statement-text">
                    {MANAGEMENT_CONTACTS.statement}
                </p>
            </div>

            {/* The Telemetry Grid */}
            <div className="mf-telemetry-grid">
                
                {/* COLUMN 1: Direct Phone Lines */}
                <div className="mf-contact-column">
                    <h4 className="mf-column-title">
                        <Phone size={16} className="mf-title-icon" />
                        Executive Direct Lines
                    </h4>
                    <div className="mf-list">
                        {MANAGEMENT_CONTACTS.phones.map((phone, idx) => {
                            const refId = `phone-${idx}`;
                            const isCopied = copiedRef === refId;

                            return (
                                <div key={idx} className="mf-contact-item">
                                    <div className="mf-item-data">
                                        <span className="mf-label">{phone.label}</span>
                                        <a href={`tel:${phone.value}`} className="mf-link">
                                            {phone.display}
                                        </a>
                                    </div>
                                    <button 
                                        className="mf-copy-btn"
                                        onClick={() => handleCopy(phone.display, refId)}
                                        aria-label={`Copy ${phone.display}`}
                                        title="Copy to clipboard"
                                    >
                                        {isCopied ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMN 2: Corporate Email Lines */}
                <div className="mf-contact-column">
                    <h4 className="mf-column-title">
                        <Mail size={16} className="mf-title-icon" />
                        Corporate Email Desks
                    </h4>
                    <div className="mf-list">
                        {MANAGEMENT_CONTACTS.emails.map((email, idx) => {
                            const refId = `email-${idx}`;
                            const isCopied = copiedRef === refId;

                            return (
                                <div key={idx} className="mf-contact-item">
                                    <div className="mf-item-data">
                                        <span className="mf-label">{email.label}</span>
                                        <a href={`mailto:${email.value}`} className="mf-link">
                                            {email.display}
                                        </a>
                                    </div>
                                    <button 
                                        className="mf-copy-btn"
                                        onClick={() => handleCopy(email.display, refId)}
                                        aria-label={`Copy ${email.display}`}
                                        title="Copy to clipboard"
                                    >
                                        {isCopied ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* ========================================================================
                3. COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .mf-chassis {
                    width: 100%;
                    border-top: 2px solid var(--border-subtle);
                    padding-top: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                /* --- STATEMENT VAULT --- */
                .mf-statement-vault {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    background: color-mix(in srgb, var(--brand-primary) 4%, transparent);
                    padding: 24px;
                    border-radius: var(--radius-lg);
                    border: 1px solid color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .mf-icon-shield {
                    width: 48px;
                    height: 48px;
                    flex-shrink: 0;
                    border-radius: var(--radius-md);
                    background: var(--bg-surface);
                    color: var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .mf-statement-text {
                    margin: 0;
                    font-size: 15px;
                    line-height: 1.6;
                    color: var(--text-main);
                    font-weight: 500;
                }

                /* --- GRID PHYSICS --- */
                .mf-telemetry-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                }

                /* --- COLUMN STYLES --- */
                .mf-contact-column {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .mf-column-title {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .mf-title-icon {
                    color: var(--text-main);
                }

                .mf-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* --- INTERACTIVE ITEM ROW --- */
                .mf-contact-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 16px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .mf-contact-item:hover {
                    border-color: color-mix(in srgb, var(--brand-primary) 40%, transparent);
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }

                .mf-item-data {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .mf-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .mf-link {
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .mf-link:hover {
                    color: var(--brand-primary);
                }

                /* --- COPY BUTTON PHYSICS --- */
                .mf-copy-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .mf-copy-btn:hover {
                    background: var(--bg-body);
                    color: var(--text-main);
                }

                .text-success {
                    color: #10B981 !important;
                    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes scaleIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 768px) {
                    .mf-telemetry-grid {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }
                    .mf-statement-vault {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                }

                @media (max-width: 480px) {
                    .mf-contact-item { padding: 12px; }
                    .mf-link { font-size: 15px; }
                }
            `}</style>
        </section>
    );
};