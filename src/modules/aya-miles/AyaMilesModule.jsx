/**
 * 🌍 AYABUS CONSUMER WEB (The Frequency Engine)
 * ------------------------------------------------------------------
 * Module: AyaMiles (Module 9/24)
 * File: src/modules/aya-miles/AyaMilesModule.jsx
 * * DESCRIPTION:
 * The master orchestrator for the loyalty dashboard. It manages the global 
 * state, handles authentication interception, and routes data to the Ring and Vault.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. AUTH INTERCEPTOR: Automatically blocks guest users with a high-conversion 
 * prompt, preventing null-reference crashes on database queries.
 * 2. THE ASYMMETRIC FLUID GRID: Uses CSS Grid to pin the progress ring on desktop 
 * while allowing the vault to scroll. On mobile, it stacks gracefully.
 * 3. ZERO-LATENCY MOUNTING: Uses local state to manage the boot sequence, 
 * rendering a skeleton frame instantly before the network payload arrives.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Loader2, 
    AlertTriangle, 
    RefreshCw, 
    ShieldAlert, 
    LogIn,
    Info
} from 'lucide-react';

// ========================================================================
// LIVE WIRES
// ========================================================================
import { useAuth } from '../../context/AuthContext'; // Adjust path to your actual AuthContext
import { rewardsService } from './services/rewards.service';
import { FrequencyRing } from './components/FrequencyRing';
import { RewardVault } from './components/RewardVault';

export const AyaMilesModule = () => {
    // ========================================================================
    // 1. STATE & CONTEXT
    // ========================================================================
    const { user, passengerProfile, isAuthenticated, isBooting: authIsBooting } = useAuth();
    
    const [isFetching, setIsFetching] = useState(true);
    const [systemError, setSystemError] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [vouchers, setVouchers] = useState([]);

    // ========================================================================
    // 2. THE DATA HYDRATION ENGINE
    // ========================================================================
    const bootLoyaltyNetwork = useCallback(async () => {
        if (!user?.id) return;

        setIsFetching(true);
        setSystemError(null);

        // Extract failsafe names for the Vault minting process
        const pName = passengerProfile?.first_name 
            ? `${passengerProfile.first_name} ${passengerProfile.last_name || ''}`.trim() 
            : 'Valued Client';
        const pPhone = passengerProfile?.phone_number || 'N/A';

        const response = await rewardsService.fetchLoyaltyStatus(user.id, pName, pPhone);

        if (response.success) {
            setMetrics(response.data.metrics);
            setVouchers(response.data.vault);
        } else {
            setSystemError(response.error || 'Failed to sync loyalty data with the server.');
        }

        setIsFetching(false);
    }, [user, passengerProfile]);

    // Fire when the component mounts or the user identity changes
    useEffect(() => {
        if (isAuthenticated && !authIsBooting) {
            bootLoyaltyNetwork();
        }
    }, [isAuthenticated, authIsBooting, bootLoyaltyNetwork]);

    // ========================================================================
    // 3. RENDER PAYLOADS
    // ========================================================================

    // A. The Auth Boot State
    if (authIsBooting) {
        return (
            <div className="ayabus-viewport am-center-stage">
                <Loader2 size={40} className="am-spin text-brand" />
            </div>
        );
    }

    // B. The Interceptor State (Guest User)
    if (!isAuthenticated) {
        return (
            <div className="ayabus-viewport am-viewport">
                <div className="ayabus-scroll-area am-scroll-chassis am-center-stage">
                    <div className="am-guest-prompt">
                        <div className="am-guest-icon-box">
                            <ShieldAlert size={32} />
                        </div>
                        <h2>Unlock AyaMiles</h2>
                        <p>Create an account to track your trips. Every 20 trips automatically unlocks a 20% discount voucher for your next journey.</p>
                        <button className="ayabus-btn am-login-btn">
                            <LogIn size={18} />
                            <span>Sign In / Create Account</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // C. The Failsafe State (Network Error)
    if (systemError && !isFetching) {
        return (
            <div className="ayabus-viewport am-viewport">
                <div className="ayabus-scroll-area am-scroll-chassis am-center-stage">
                    <div className="am-error-chassis">
                        <AlertTriangle size={32} className="am-error-icon" />
                        <h2>Sync Failed</h2>
                        <p>{systemError}</p>
                        <button className="ayabus-btn ayabus-btn-ghost am-retry-btn" onClick={bootLoyaltyNetwork}>
                            <RefreshCw size={18} /> Retry Connection
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // D. The Master Interface
    return (
        <div className="ayabus-viewport am-viewport">
            <div className="ayabus-scroll-area am-scroll-chassis">
                
                {/* PAGE HEADER */}
                <div className="am-page-header">
                    <h1 className="am-page-title">AyaMiles</h1>
                    <p className="am-page-subtitle">Your rewards and trip history</p>
                </div>

                {/* THE ASYMMETRIC GRID */}
                <div className="am-master-grid">
                    
                    {/* LEFT DOMAIN: The Psychological Anchor (Sticky) */}
                    <div className="am-ring-zone">
                        <div className="am-sticky-container">
                            <FrequencyRing 
                                metrics={metrics} 
                                isLoading={isFetching} 
                            />
                            
                            {/* Supplementary Rules Panel */}
                            <div className="am-rules-panel">
                                <div className="am-rules-header">
                                    <Info size={16} />
                                    <span>How it works</span>
                                </div>
                                <div className="am-rule-text">
                                    Every completed trip earns you <strong>10 Miles</strong>. Hit <strong>200 Miles</strong> to automatically generate a 20% discount voucher.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT DOMAIN: The Digital Wallet (Scrollable) */}
                    <div className="am-vault-zone">
                        <RewardVault 
                            vouchers={vouchers} 
                            isLoading={isFetching} 
                        />
                    </div>

                </div>
            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                /* --- MASTER CHASSIS --- */
                .am-viewport {
                    background: var(--bg-body);
                    display: flex;
                    flex-direction: column;
                }

                .am-scroll-chassis {
                    padding: 32px 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }

                /* --- STATES --- */
                .am-center-stage {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: calc(100vh - var(--header-height, 70px));
                }

                .am-spin { animation: spin 1s linear infinite; }
                .text-brand { color: var(--brand-primary); }

                /* --- GUEST PROMPT --- */
                .am-guest-prompt, .am-error-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 48px 32px;
                    text-align: center;
                    max-width: 480px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.04);
                }

                .am-guest-icon-box {
                    width: 72px; height: 72px;
                    border-radius: var(--radius-full);
                    background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
                    color: var(--brand-primary);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 24px;
                }

                .am-guest-prompt h2, .am-error-chassis h2 {
                    margin: 0 0 12px 0;
                    font-size: 24px;
                    font-weight: 900;
                    color: var(--text-main);
                }

                .am-guest-prompt p, .am-error-chassis p {
                    margin: 0 0 32px 0;
                    font-size: 15px;
                    color: var(--text-muted);
                    line-height: 1.6;
                }

                .am-login-btn { width: 100%; height: 52px; font-size: 16px; gap: 12px; }
                
                .am-error-icon { color: #EF4444; margin-bottom: 16px; }
                .am-retry-btn { gap: 8px; }

                /* --- PAGE HEADER --- */
                .am-page-header {
                    margin-bottom: 32px;
                }

                .am-page-title {
                    margin: 0 0 8px 0;
                    font-size: 32px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .am-page-subtitle {
                    margin: 0;
                    font-size: 16px;
                    color: var(--text-muted);
                }

                /* --- THE ASYMMETRIC GRID --- */
                .am-master-grid {
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 32px;
                    align-items: start;
                }

                /* --- RING ZONE (Sticky) --- */
                .am-sticky-container {
                    position: sticky;
                    top: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .am-rules-panel {
                    background: color-mix(in srgb, var(--text-muted) 5%, transparent);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 20px;
                }

                .am-rules-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-main);
                    font-size: 13px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }

                .am-rule-text {
                    font-size: 14px;
                    color: var(--text-muted);
                    line-height: 1.6;
                }
                .am-rule-text strong { color: var(--text-main); font-weight: 700; }

                /* --- ANIMATIONS --- */
                @keyframes spin { 100% { transform: rotate(360deg); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 992px) {
                    .am-scroll-chassis { padding: 24px 16px; }
                    .am-master-grid {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                    .am-sticky-container { position: relative; top: 0; }
                }
            `}</style>
        </div>
    );
};