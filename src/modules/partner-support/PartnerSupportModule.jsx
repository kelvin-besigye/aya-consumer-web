/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Partner Support (Module 4/24)
 * File: src/modules/partner-support/PartnerSupport.jsx
 * * DESCRIPTION:
 * The apex wrapper for the B2B Partnership portal. Orchestrates the 
 * layout of the corporate intake form and the executive directory.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. FOCUSED READING COLUMN: Constrains the maximum width to 900px to 
 * maintain optimal line-length readability (60-80 characters) for 
 * complex enterprise forms.
 * 2. ZERO-DISTRACTION VAULT: Centers the entire module mathematically 
 * on the screen, forcing the user's attention entirely onto the proposal 
 * creation process.
 * 3. THEMATIC AUTHORITY: Uses the `bg-surface` and strict border variables 
 * from index.css to create a distinct, "secure document" aesthetic, 
 * separating it visually from the consumer booking pages.
 */

import React from 'react';
import { Handshake, ShieldCheck } from 'lucide-react';

// LIVE WIRES: The Atomic Components from Phase 2
import { PartnershipForm } from './components/PartnershipForm';
import { ManagementFooter } from './components/ManagementFooter';

export const PartnerSupport = () => {
    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="ps-viewport fade-in">
            <div className="ps-central-column">
                
                {/* --- CORPORATE HERO VAULT --- */}
                <header className="ps-header-vault">
                    
                    {/* Trust Indicator */}
                    <div className="ps-trust-badge">
                        <ShieldCheck size={14} className="text-brand" />
                        <span>AyaBus Secure Corporate Portal</span>
                    </div>

                    <div className="ps-icon-shield">
                        <Handshake size={36} strokeWidth={1.5} />
                    </div>
                    
                    <h1 className="ps-title">Partner With the Future of Transit</h1>
                    <p className="ps-subtitle">
                        We are actively expanding our network of bus operators, logistics fleets, and infrastructure partners across East Africa. Submit your formal proposal directly to our executive team.
                    </p>
                </header>

                {/* --- THE INTAKE ENGINE --- */}
                <main className="ps-form-vault">
                    <PartnershipForm />
                </main>

                {/* --- THE EXECUTIVE DIRECTORY --- */}
                <footer className="ps-footer-vault">
                    <ManagementFooter />
                </footer>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for instantaneous theming.
            ======================================================================== */}
            <style>{`
                .ps-viewport {
                    width: 100%;
                    min-height: calc(100vh - var(--header-height));
                    background: var(--bg-body); /* Uses the main body background to let the surface form pop */
                    padding: 48px 24px 80px 24px;
                    display: flex;
                    justify-content: center;
                }

                /* THE FOCUSED COLUMN */
                .ps-central-column {
                    width: 100%;
                    max-width: 900px; /* Constrained width for B2B readability */
                    display: flex;
                    flex-direction: column;
                    gap: 48px;
                }

                /* --- HERO HEADER --- */
                .ps-header-vault {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }

                .ps-trust-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
                    border: 1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent);
                    border-radius: 100px;
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }
                
                .text-brand {
                    color: var(--brand-primary);
                }

                .ps-icon-shield {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: var(--bg-surface);
                    color: var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-subtle);
                    margin-bottom: 8px;
                }

                .ps-title {
                    margin: 0;
                    font-size: 40px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -1px;
                    line-height: 1.1;
                }

                .ps-subtitle {
                    margin: 0;
                    font-size: 18px;
                    color: var(--text-muted);
                    font-weight: 500;
                    max-width: 700px;
                    line-height: 1.6;
                }

                /* --- VAULTS --- */
                .ps-form-vault {
                    width: 100%;
                    /* Form handles its own interior padding and surface background */
                }

                .ps-footer-vault {
                    width: 100%;
                }

                /* --- ANIMATIONS --- */
                .fade-in {
                    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 768px) {
                    .ps-viewport {
                        padding: 32px 16px 64px 16px;
                    }
                    .ps-central-column {
                        gap: 40px;
                    }
                    .ps-title {
                        font-size: 32px;
                    }
                    .ps-subtitle {
                        font-size: 16px;
                    }
                }

                @media (max-width: 480px) {
                    .ps-viewport {
                        padding: 24px 0 48px 0; /* Bleed to edges on very small screens */
                    }
                    .ps-header-vault {
                        padding: 0 20px; /* Keep header padded since viewport lost its padding */
                    }
                    .ps-footer-vault {
                        padding: 0 20px;
                    }
                    .ps-icon-shield {
                        width: 64px;
                        height: 64px;
                    }
                    .ps-title {
                        font-size: 28px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PartnerSupport;