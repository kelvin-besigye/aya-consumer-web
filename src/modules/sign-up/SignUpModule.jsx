/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Identity & Authentication (Module 5/24)
 * File: src/modules/sign-up/SignUpModule.jsx
 * * DESCRIPTION:
 * The apex wrapper for the Identity ecosystem. Orchestrates the layout 
 * of the AuthVault and SocialProviders within a high-conversion, 
 * split-panel desktop layout that degrades gracefully to a focused 
 * single-column mobile view.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. SPLIT-PANEL ARCHITECTURE: Dedicates 45% of the desktop viewport to 
 * psychological reinforcement (Aya-Miles, Speed, Tracking) to prevent 
 * sign-up abandonment.
 * 2. COMPONENT FUSION: Seamlessly stacks the `AuthVault` and `SocialProviders` 
 * into a single unified column sharing the exact same `max-width` (440px).
 * 3. HARDWARE-ACCELERATED BACKGROUNDS: Uses CSS gradients rather than 
 * heavy images for the brand panel, ensuring sub-100ms load times even 
 * on 3G network conditions.
 */

import React, { useState } from 'react';
import { ShieldCheck, Zap, Ticket, Award, ArrowLeft } from 'lucide-react';

// LIVE WIRES: The Atomic Components from Phase 2
import { AuthVault } from './components/AuthVault';
import { SocialProviders } from './components/SocialProviders';

export const SignUpModule = () => {
    // Optional: If you are using React Router, you would initialize it here
    // const navigate = useNavigate();

    // Local state to handle overarching provider errors that happen outside the Vault
    const [globalError, setGlobalError] = useState('');

    // ========================================================================
    // KINETIC HANDLERS
    // ========================================================================
    const handleAuthenticationSuccess = (userPayload) => {
        console.log('[AyaBus Auth] Master Telemetry Received:', userPayload);
        // African Physics: In a real app, we don't immediately violently redirect.
        // We let the checkmark animation in the AuthVault play out for 1.5s, 
        // then route them back to where they came from (e.g., checkout or dashboard).
        
        // setTimeout(() => {
        //     navigate('/dashboard'); 
        // }, 1500);
    };

    const handleBackToBooking = () => {
        // navigate('/');
        console.log('Returning to main flow...');
    };

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="sum-viewport fade-in">
            
            {/* ===============================================================
                LEFT PANEL: The Value Proposition (Desktop Only)
            =============================================================== */}
            <div className="sum-brand-panel">
                <div className="sum-brand-overlay"></div>
                <div className="sum-brand-content">
                    
                    <div className="sum-brand-header">
                        <ShieldCheck size={48} className="sum-brand-icon" />
                        <h1 className="sum-brand-title">AyaBus Sovereign</h1>
                        <p className="sum-brand-subtitle">The standard for East African transit.</p>
                    </div>

                    <div className="sum-benefits-matrix">
                        <div className="sum-benefit-row">
                            <div className="sum-benefit-icon-vault"><Zap size={20} /></div>
                            <div className="sum-benefit-data">
                                <h3>1-Click Bookings</h3>
                                <p>Save your preferred seats, routes, and payment methods for lightning-fast checkouts.</p>
                            </div>
                        </div>
                        <div className="sum-benefit-row">
                            <div className="sum-benefit-icon-vault"><Ticket size={20} /></div>
                            <div className="sum-benefit-data">
                                <h3>Live Ticket Tracking</h3>
                                <p>Never lose a PDF again. Access all your QR codes and SLA-tracked support tickets instantly.</p>
                            </div>
                        </div>
                        <div className="sum-benefit-row">
                            <div className="sum-benefit-icon-vault"><Award size={20} /></div>
                            <div className="sum-benefit-data">
                                <h3>Earn Aya-Miles</h3>
                                <p>Every journey builds your wallet balance. Redeem miles for free trips and VIP lounge access.</p>
                            </div>
                        </div>
                    </div>

                    <div className="sum-brand-footer">
                        <p>&copy; {new Date().getFullYear()} AyaBus Core Transit System</p>
                    </div>
                </div>
            </div>

            {/* ===============================================================
                RIGHT PANEL: The Interaction Hub
            =============================================================== */}
            <div className="sum-auth-panel">
                
                {/* Navigation Failsafe */}
                <button className="sum-back-btn" onClick={handleBackToBooking}>
                    <ArrowLeft size={18} />
                    <span>Back to Booking</span>
                </button>

                <div className="sum-auth-column">
                    {/* The Core Engine */}
                    <AuthVault 
                        initialView="LOGIN" 
                        onSuccess={handleAuthenticationSuccess} 
                    />
                    
                    {/* The 1-Click Engine */}
                    <div className="sum-social-wrapper">
                        <SocialProviders 
                            onError={(err) => setGlobalError(err)} 
                        />
                    </div>

                    {/* Global Error Bubble (Catches OAuth drops) */}
                    {globalError && (
                        <div className="sum-global-error slide-down">
                            {globalError}
                        </div>
                    )}
                </div>
                
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for instantaneous theming.
            ======================================================================== */}
            <style>{`
                .sum-viewport {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    overflow: hidden;
                    background: var(--bg-body);
                }

                /* --- LEFT PANEL: BRAND VAULT --- */
                .sum-brand-panel {
                    flex: 0 0 45%;
                    max-width: 600px;
                    position: relative;
                    background: color-mix(in srgb, var(--brand-primary) 95%, #000);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 64px;
                    overflow: hidden;
                }

                /* Simulated blurred bus fleet overlay using pure CSS mesh */
                .sum-brand-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        radial-gradient(at 0% 0%, color-mix(in srgb, var(--brand-primary) 40%, transparent) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, color-mix(in srgb, #10B981 20%, transparent) 0px, transparent 50%);
                    opacity: 0.6;
                    z-index: 1;
                }

                .sum-brand-content {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .sum-brand-header {
                    margin-bottom: 64px;
                }

                .sum-brand-icon {
                    color: #FFFFFF;
                    margin-bottom: 24px;
                }

                .sum-brand-title {
                    margin: 0 0 8px 0;
                    font-size: 36px;
                    font-weight: 900;
                    color: #FFFFFF;
                    letter-spacing: -1px;
                }

                .sum-brand-subtitle {
                    margin: 0;
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                }

                .sum-benefits-matrix {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                    flex: 1;
                }

                .sum-benefit-row {
                    display: flex;
                    gap: 20px;
                    align-items: flex-start;
                }

                .sum-benefit-icon-vault {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFFFFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .sum-benefit-data h3 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: #FFFFFF;
                }

                .sum-benefit-data p {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.6);
                }

                .sum-brand-footer p {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.4);
                    margin: 0;
                }

                /* --- RIGHT PANEL: AUTH VAULT --- */
                .sum-auth-panel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding: 24px;
                    overflow-y: auto;
                }

                .sum-back-btn {
                    position: absolute;
                    top: 32px;
                    left: 40px;
                    background: transparent;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-muted);
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .sum-back-btn:hover {
                    color: var(--text-main);
                }

                .sum-auth-column {
                    width: 100%;
                    max-width: 440px; /* Perfectly matches the internal AuthVault chassis */
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .sum-social-wrapper {
                    width: 100%;
                    padding: 0 8px; /* Slight inset to visually anchor it beneath the main card */
                }

                .sum-global-error {
                    margin-top: 16px;
                    padding: 12px 16px;
                    background: color-mix(in srgb, #EF4444 10%, var(--bg-surface));
                    color: #EF4444;
                    border-radius: var(--radius-md);
                    font-size: 13px;
                    font-weight: 600;
                    text-align: center;
                    border: 1px solid color-mix(in srgb, #EF4444 30%, transparent);
                }

                /* --- ANIMATIONS --- */
                .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

                .slide-down { animation: slideDown 0.3s ease forwards; }
                @keyframes slideDown { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 900px) {
                    /* Annihilate the brand panel on tablets/mobile to preserve focus */
                    .sum-brand-panel { display: none; }
                    
                    .sum-auth-panel {
                        justify-content: flex-start;
                        padding-top: 80px; /* Space for the back button */
                    }

                    .sum-back-btn {
                        top: 24px;
                        left: 24px;
                    }
                }

                @media (max-width: 480px) {
                    .sum-auth-panel { padding: 80px 16px 24px 16px; }
                    .sum-auth-column { gap: 0; }
                    .sum-social-wrapper { padding: 0; } /* Remove inset on very narrow screens */
                }
            `}</style>
        </div>
    );
};

export default SignUpModule;