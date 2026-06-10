/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Accounts Dashboard (Module 6/24)
 * File: src/modules/accounts/AccountsModule.jsx
 * * DESCRIPTION:
 * The apex routing shell for the Accounts ecosystem. Orchestrates the 
 * secure rendering of the Profile, Credentials, and Danger Zone.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-CRASH HYDRATION: Implements a strict `isAuthenticated` gate. 
 * If a guest accesses this route, it perfectly morphs into the Feature 
 * Discovery interceptor (`GuestPrompt`).
 * 2. ASYMMETRIC DASHBOARD GEOMETRY: Utilizes a CSS Grid `1.5fr 1fr` 
 * layout on desktop to prioritize the spatial requirements of the 
 * Profile Editor while keeping security settings highly visible.
 * 3. FLUID RESPONSIVENESS: The grid automatically collapses into a 
 * linear, vertical stack at `960px`, perfectly preserving thumb-reach 
 * accessibility for tablet and mobile users.
 */

import React from 'react';
import { Settings2, Shield, UserCircle } from 'lucide-react';

// LIVE WIRES: Global State
import { useAuth } from '../../context/AuthContext';

// ATOMIC COMPONENTS: Phase 2 Builds
import { GuestPrompt } from './components/GuestPrompt';
import { ProfileEditor } from './components/ProfileEditor';
import { CredentialManager } from './components/CredentialManager';
import { DangerZone } from './components/DangerZone';

export const AccountsModule = () => {
    // 1. Hook into the Global Brain
    const { isAuthenticated, passengerProfile, user } = useAuth();

    // ========================================================================
    // ROUTING HANDLER (For Guest Interceptor)
    // ========================================================================
    const handleNavigateToAuth = (view) => {
        // African Physics: If using React Router, this is where you fire navigate()
        // e.g., navigate(`/sign-up?view=${view}`);
        
        // Failsafe physical routing for the blueprint:
        console.log(`[AyaBus Router] Intercepted Guest. Routing to Auth Flow: ${view}`);
        window.location.href = `/sign-up?view=${view}`; 
    };

    // ========================================================================
    // GATEKEEPER: THE GUEST INTERCEPTOR
    // ========================================================================
    if (!isAuthenticated) {
        return (
            <div className="am-guest-wrapper">
                <GuestPrompt onNavigateToAuth={handleNavigateToAuth} />
                <style>{`
                    .am-guest-wrapper {
                        width: 100%;
                        height: 100%;
                        min-height: calc(100vh - var(--header-height));
                        display: flex;
                        background: var(--bg-body);
                        overflow-y: auto;
                    }
                `}</style>
            </div>
        );
    }

    // ========================================================================
    // RENDER PAYLOAD: THE SOVEREIGN DASHBOARD
    // ========================================================================
    
    // Determine the safest display name for the greeting
    const displayName = passengerProfile?.first_name 
        || user?.email?.split('@')[0] 
        || 'Traveler';

    return (
        <div className="am-viewport fade-in">
            <div className="am-scroll-container">
                <div className="am-dashboard-chassis">
                    
                    {/* --- MASTER HEADER --- */}
                    <div className="am-header-vault">
                        <div className="am-header-titles">
                            <div className="am-icon-badge">
                                <Settings2 size={28} />
                            </div>
                            <div>
                                <h1 className="am-title">Welcome back, {displayName}</h1>
                                <p className="am-subtitle">Manage your sovereign identity, security credentials, and system preferences.</p>
                            </div>
                        </div>
                    </div>

                    {/* --- THE ASYMMETRIC GRID --- */}
                    <div className="am-grid">
                        
                        {/* LEFT COLUMN: High-Volume Data (1.5fr) */}
                        <div className="am-col-left">
                            <ProfileEditor />
                        </div>

                        {/* RIGHT COLUMN: Secure Data & Friction Zones (1fr) */}
                        <div className="am-col-right">
                            <CredentialManager />
                            <DangerZone />
                        </div>

                    </div>

                </div>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables for instantaneous theming.
            ======================================================================== */}
            <style>{`
                .am-viewport {
                    width: 100%;
                    height: 100%; /* Adapts to whatever parent container/router gives it */
                    min-height: calc(100vh - var(--header-height));
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-body);
                    overflow: hidden; /* Prevent double scrollbars on the window */
                }

                .am-scroll-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 40px 24px;
                    /* Hardware acceleration for smooth scrolling */
                    -webkit-overflow-scrolling: touch; 
                }

                .am-dashboard-chassis {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                /* --- HEADER --- */
                .am-header-vault {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-bottom: 24px;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .am-header-titles {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .am-icon-badge {
                    width: 56px;
                    height: 56px;
                    border-radius: var(--radius-lg);
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    color: var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .am-title {
                    margin: 0 0 4px 0;
                    font-size: 28px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .am-subtitle {
                    margin: 0;
                    font-size: 15px;
                    color: var(--text-muted);
                }

                /* --- GRID GEOMETRY --- */
                .am-grid {
                    display: grid;
                    /* African Physics Asymmetric Layout: Left side gets 1.5x the space of the right side */
                    grid-template-columns: 1.5fr 1fr;
                    gap: 32px;
                    align-items: start; /* Prevents columns from artificially stretching to match heights */
                }

                .am-col-left {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .am-col-right {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                /* --- ANIMATIONS --- */
                .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 960px) {
                    /* On tablets, crush the asymmetric grid into a vertical stack */
                    .am-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 600px) {
                    .am-scroll-container {
                        padding: 24px 16px;
                    }
                    
                    .am-header-vault {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 16px;
                    }
                    
                    .am-title {
                        font-size: 24px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AccountsModule;