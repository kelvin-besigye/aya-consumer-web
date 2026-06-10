/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Identity & Authentication (Module 5/24)
 * File: src/modules/sign-up/components/SocialProviders.jsx
 * * DESCRIPTION:
 * The 1-Click Authentication Engine. Provides seamless integration 
 * with Google and Apple SSO (Single Sign-On).
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ISOLATED LOAD STATES: Tracks the loading state of each specific 
 * provider independently so the UI accurately reflects what the user clicked.
 * 2. NATIVE SVG RENDERER: Uses raw, optimized SVG paths for the brand 
 * logos to guarantee pixel-perfect rendering without adding bundle bloat 
 * from external icon libraries.
 * 3. ERROR BUBBLING: Catches network drops before the redirect and passes 
 * the error up to the parent vault's telemetry UI.
 */

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// LIVE WIRE: The Logic Layer
import { authService } from '../services/auth.service';

export const SocialProviders = ({ onError = () => {} }) => {
    // Tracks which provider is currently attempting to redirect
    const [connectingProvider, setConnectingProvider] = useState(null);

    // ========================================================================
    // KINETIC HANDLER
    // ========================================================================
    const handleOAuth = async (provider) => {
        setConnectingProvider(provider);
        
        // Fire the thrusters. If successful, Supabase instantly redirects the 
        // browser to Google/Apple, so we don't need a 'success' state here.
        const response = await authService.signInWithOAuth(provider);

        // If it fails immediately (e.g. no internet before the redirect fires)
        if (!response.success) {
            setConnectingProvider(null);
            onError(response.error);
        }
    };

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="sp-chassis fade-in">
            
            {/* The Visual Divider */}
            <div className="sp-divider">
                <span className="sp-divider-line"></span>
                <span className="sp-divider-text">OR CONTINUE WITH</span>
                <span className="sp-divider-line"></span>
            </div>

            {/* The Provider Stack */}
            <div className="sp-stack">
                
                {/* 1. GOOGLE ENGINE */}
                <button 
                    type="button" 
                    className="sp-btn"
                    onClick={() => handleOAuth('google')}
                    disabled={connectingProvider !== null}
                    aria-label="Sign in with Google"
                >
                    {connectingProvider === 'google' ? (
                        <Loader2 size={20} className="spin text-brand" />
                    ) : (
                        <GoogleIcon size={20} />
                    )}
                    <span className="sp-btn-text">Google</span>
                </button>

                {/* 2. APPLE ENGINE */}
                <button 
                    type="button" 
                    className="sp-btn"
                    onClick={() => handleOAuth('apple')}
                    disabled={connectingProvider !== null}
                    aria-label="Sign in with Apple"
                >
                    {connectingProvider === 'apple' ? (
                        <Loader2 size={20} className="spin text-brand" />
                    ) : (
                        <AppleIcon size={20} />
                    )}
                    <span className="sp-btn-text">Apple</span>
                </button>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .sp-chassis {
                    width: 100%;
                    margin-top: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                /* --- THE DIVIDER --- */
                .sp-divider {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    width: 100%;
                }

                .sp-divider-line {
                    flex: 1;
                    height: 1px;
                    background: var(--border-subtle);
                }

                .sp-divider-text {
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* --- THE STACK --- */
                .sp-stack {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .sp-btn {
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    background: transparent;
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .sp-btn:hover:not(:disabled) {
                    background: var(--bg-body);
                    border-color: color-mix(in srgb, var(--text-main) 30%, var(--border-subtle));
                    transform: translateY(-2px);
                }

                .sp-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .sp-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .sp-btn-text {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .text-brand { color: var(--brand-primary); }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 480px) {
                    .sp-stack {
                        grid-template-columns: 1fr; /* Stack vertically on very small screens */
                        gap: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

// ============================================================================
// NATIVE BRAND ICONS (Zero-Dependency SVG Atoms)
// ============================================================================

const GoogleIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.81 15.72 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12 23C14.97 23 17.46 22.01 19.28 20.34L15.72 17.59C14.73 18.25 13.47 18.66 12 18.66C9.16 18.66 6.75 16.74 5.88 14.16H2.21V17C4.01 20.57 7.7 23 12 23Z" fill="#34A853"/>
        <path d="M5.88 14.16C5.66 13.49 5.53 12.76 5.53 12C5.53 11.24 5.66 10.51 5.88 9.84V7H2.21C1.47 8.48 1.04 10.18 1.04 12C1.04 13.82 1.47 15.52 2.21 17L5.88 14.16Z" fill="#FBBC05"/>
        <path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.35 3.83C17.45 2.06 14.97 1 12 1C7.7 1 4.01 3.43 2.21 7L5.88 9.84C6.75 7.26 9.16 5.34 12 5.34Z" fill="#EA4335"/>
    </svg>
);

const AppleIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--text-main)" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.366 11.216C16.398 8.47 18.618 7.15 18.72 7.086C17.454 5.23 15.488 4.936 14.776 4.846C13.256 4.694 11.758 5.766 10.984 5.766C10.208 5.766 8.988 4.86 7.734 4.882C6.116 4.904 4.618 5.82 3.784 7.274C2.08 10.238 3.35 14.636 5.012 17.03C5.826 18.204 6.786 19.516 8.046 19.472C9.262 19.428 9.73 18.69 11.2 18.69C12.67 18.69 13.116 19.472 14.372 19.45C15.67 19.428 16.49 18.29 17.302 17.106C18.246 15.726 18.636 14.382 18.658 14.318C18.616 14.296 16.334 13.434 16.366 11.216ZM14.108 3.124C14.78 2.31 15.232 1.176 15.108 0.042C14.12 0.086 12.916 0.706 12.222 1.506C11.6 2.218 11.058 3.366 11.206 4.488C12.306 4.574 13.436 3.938 14.108 3.124Z"/>
    </svg>
);