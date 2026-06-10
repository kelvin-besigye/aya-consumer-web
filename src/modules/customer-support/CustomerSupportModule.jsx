/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Customer Support (Module 3/24)
 * File: src/modules/customer-support/CustomerSupport.jsx
 * * DESCRIPTION:
 * The apex wrapper for the Customer Support module. Orchestrates the 
 * layout of telemetry cards, the direct message form, and social links.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ASYMMETRIC GRID: Uses a 1fr / 1.2fr grid allocation on desktop to 
 * perfectly balance the visual weight of the Contact Cards against the 
 * larger Direct Message Form.
 * 2. ZERO-SHIFT RESPONSIVENESS: Instantly snaps to a single-column flex 
 * column on screens < 1024px without relying on slow JavaScript listeners.
 * 3. THEMATIC HARMONY: Fully respects index.css root variables, ensuring 
 * flawless switching between Light and Dark modes.
 */

import React from 'react';
import { PhoneCall, MessageCircle, Mail, HelpCircle } from 'lucide-react';

// LIVE WIRES: The Engine Data & Atomic Components
import { SUPPORT_TELEMETRY } from './data/support.constants';
import { ContactCard } from './components/ContactCard';
import { DirectMessageForm } from './components/DirectMessageForm';
import { SocialFooter } from './components/SocialFooter';

export const CustomerSupport = () => {
    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="cs-chassis fade-in">
            
            {/* --- HERO HEADER VAULT --- */}
            <header className="cs-header-vault">
                <div className="cs-header-icon">
                    <HelpCircle size={32} />
                </div>
                <h1 className="cs-title">How can we help you today?</h1>
                <p className="cs-subtitle">
                    {SUPPORT_TELEMETRY.header_statement}
                </p>
            </header>

            {/* --- ASYMMETRIC WORKSPACE GRID --- */}
            <main className="cs-main-grid">
                
                {/* LEFT COLUMN: The Immediate Telemetry Stack */}
                <div className="cs-telemetry-column">
                    <ContactCard 
                        title="Call Us" 
                        icon={PhoneCall} 
                        items={SUPPORT_TELEMETRY.phone} 
                        type="phone" 
                    />
                    
                    <ContactCard 
                        title="WhatsApp Us" 
                        icon={MessageCircle} 
                        items={SUPPORT_TELEMETRY.whatsapp} 
                        type="whatsapp" 
                    />
                    
                    <ContactCard 
                        title="Email Us" 
                        icon={Mail} 
                        items={SUPPORT_TELEMETRY.email} 
                        type="email" 
                    />
                </div>

                {/* RIGHT COLUMN: The SLA-Generating Form */}
                <div className="cs-form-column">
                    <DirectMessageForm />
                </div>

            </main>

            {/* --- SOCIAL ROUTING FOOTER --- */}
            <footer className="cs-footer-vault">
                <SocialFooter />
            </footer>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for instantaneous theming.
            ======================================================================== */}
            <style>{`
                .cs-chassis {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 24px 80px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 48px;
                    min-height: calc(100vh - var(--header-height));
                }

                /* --- HERO HEADER --- */
                .cs-header-vault {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .cs-header-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    color: var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 8px;
                }

                .cs-title {
                    margin: 0;
                    font-size: 36px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -1px;
                    line-height: 1.1;
                }

                .cs-subtitle {
                    margin: 0;
                    font-size: 18px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                /* --- MAIN GRID PHYSICS --- */
                .cs-main-grid {
                    display: grid;
                    /* The Asymmetric Split: Form takes slightly more horizontal space */
                    grid-template-columns: 1fr 1.3fr; 
                    gap: 40px;
                    align-items: start;
                }

                .cs-telemetry-column {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    position: sticky;
                    top: calc(var(--header-height) + 24px); /* Locks to screen as user scrolls on large monitors */
                }

                .cs-form-column {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }

                /* --- FOOTER VAULT --- */
                .cs-footer-vault {
                    margin-top: 24px;
                    width: 100%;
                }

                /* --- ANIMATIONS --- */
                .fade-in {
                    animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 1024px) {
                    .cs-chassis {
                        padding: 32px 20px 60px 20px;
                        gap: 32px;
                    }

                    .cs-title {
                        font-size: 28px;
                    }

                    .cs-main-grid {
                        /* Force snap to a vertical stack for tablets and mobile */
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }

                    .cs-telemetry-column {
                        position: relative; /* Remove sticky on mobile */
                        top: 0;
                    }
                }

                @media (max-width: 640px) {
                    .cs-chassis {
                        padding: 24px 16px 48px 16px;
                    }
                    .cs-header-icon {
                        width: 56px;
                        height: 56px;
                    }
                    .cs-title {
                        font-size: 24px;
                    }
                    .cs-subtitle {
                        font-size: 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default CustomerSupport;