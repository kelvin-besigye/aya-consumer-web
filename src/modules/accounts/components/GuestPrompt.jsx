/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Accounts Dashboard (Module 6/24)
 * File: src/modules/accounts/components/GuestPrompt.jsx
 * * DESCRIPTION:
 * The high-conversion interceptor. If the AuthContext detects a 
 * logged-out user trying to access the Accounts tab, this component 
 * renders instead of an empty dashboard, routing them to Module 5.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-FRICTION ROUTING: Provides distinct entry points for both 
 * 'REGISTER' and 'LOGIN' so the downstream AuthVault knows exactly 
 * which view to open instantly.
 * 2. PREMIUM FEATURE FRAMING: Uses a CSS Grid layout to display the 
 * three core benefits (Speed, Tracking, Miles) as premium upgrades 
 * rather than system requirements.
 * 3. FLUID DEGRADATION: Flexes from a wide 3-column desktop layout 
 * into a highly readable, thumb-friendly vertical stack on mobile.
 */

import React from 'react';
import { 
    UserCircle2, 
    Zap, 
    Ticket, 
    Award, 
    ArrowRight 
} from 'lucide-react';

export const GuestPrompt = ({ onNavigateToAuth = (view) => {} }) => {
    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="gp-viewport fade-in">
            <div className="gp-chassis">
                
                {/* --- HERO HEADER --- */}
                <div className="gp-header">
                    <div className="gp-icon-shield">
                        <UserCircle2 size={48} strokeWidth={1.5} />
                    </div>
                    <h2 className="gp-title">Unlock the Full AyaBus Experience</h2>
                    <p className="gp-subtitle">
                        Create a free sovereign account to manage your identity, track your journeys, and earn rewards across East Africa.
                    </p>
                </div>

                {/* --- THE VALUE MATRIX --- */}
                <div className="gp-value-matrix">
                    
                    <div className="gp-value-card">
                        <div className="gp-card-icon text-brand">
                            <Zap size={24} />
                        </div>
                        <h3>Lightning Fast Checkout</h3>
                        <p>Save your preferred seats, payment methods, and emergency contacts for 1-click bookings.</p>
                    </div>

                    <div className="gp-value-card">
                        <div className="gp-card-icon text-brand">
                            <Ticket size={24} />
                        </div>
                        <h3>The Ticket Vault</h3>
                        <p>Never lose a PDF again. Access all your upcoming and past digital boarding passes instantly.</p>
                    </div>

                    <div className="gp-value-card">
                        <div className="gp-card-icon text-brand">
                            <Award size={24} />
                        </div>
                        <h3>Earn Aya-Miles</h3>
                        <p>Every ticket purchased builds your wallet balance. Redeem miles for free travel and upgrades.</p>
                    </div>

                </div>

                {/* --- ACTION ROUTING --- */}
                <div className="gp-actions">
                    <button 
                        className="ayabus-btn gp-primary-btn"
                        onClick={() => onNavigateToAuth('REGISTER')}
                    >
                        <span>Create Free Account</span>
                        <ArrowRight size={18} />
                    </button>
                    
                    <div className="gp-secondary-action">
                        <span className="gp-text-muted">Already have an account?</span>
                        <button 
                            className="gp-text-btn"
                            onClick={() => onNavigateToAuth('LOGIN')}
                        >
                            Sign In Securely
                        </button>
                    </div>
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .gp-viewport {
                    width: 100%;
                    min-height: 70vh; /* Takes up majority of the dashboard area */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    /* Subtle brand glow behind the interceptor */
                    background: radial-gradient(circle at center top, color-mix(in srgb, var(--brand-primary) 3%, transparent) 0%, transparent 60%);
                }

                .gp-chassis {
                    max-width: 900px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 48px;
                }

                /* --- HEADER --- */
                .gp-header {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    max-width: 600px;
                }

                .gp-icon-shield {
                    width: 88px;
                    height: 88px;
                    border-radius: 50%;
                    background: var(--bg-surface);
                    color: var(--brand-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.06);
                    border: 1px solid var(--border-subtle);
                    margin-bottom: 24px;
                }

                .gp-title {
                    margin: 0 0 12px 0;
                    font-size: 32px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .gp-subtitle {
                    margin: 0;
                    font-size: 16px;
                    color: var(--text-muted);
                    line-height: 1.6;
                }

                /* --- MATRIX --- */
                .gp-value-matrix {
                    width: 100%;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }

                .gp-value-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 32px 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
                }

                .gp-value-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.04);
                    border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--border-subtle));
                }

                .gp-card-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: var(--radius-md);
                    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .text-brand { color: var(--brand-primary); }

                .gp-value-card h3 {
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .gp-value-card p {
                    margin: 0;
                    font-size: 14px;
                    color: var(--text-muted);
                    line-height: 1.5;
                }

                /* --- ACTIONS --- */
                .gp-actions {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                }

                .gp-primary-btn {
                    height: 60px;
                    padding: 0 40px;
                    font-size: 16px;
                    letter-spacing: 0.5px;
                    gap: 12px;
                    border-radius: var(--radius-md);
                    box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 25%, transparent);
                }

                .gp-secondary-action {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 15px;
                }

                .gp-text-muted { color: var(--text-muted); }

                .gp-text-btn {
                    background: transparent;
                    border: none;
                    color: var(--brand-primary);
                    font-weight: 800;
                    cursor: pointer;
                    padding: 0;
                    transition: opacity 0.2s;
                }

                .gp-text-btn:hover { opacity: 0.8; }

                /* --- ANIMATIONS --- */
                .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeIn { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 900px) {
                    .gp-value-matrix {
                        grid-template-columns: 1fr;
                        max-width: 440px; /* Constrain width when stacked */
                    }
                    .gp-value-card {
                        padding: 24px;
                        flex-direction: row;
                        text-align: left;
                        gap: 20px;
                    }
                    .gp-card-icon { margin-bottom: 0; flex-shrink: 0; }
                }

                @media (max-width: 480px) {
                    .gp-viewport { padding: 32px 16px; }
                    .gp-title { font-size: 26px; }
                    .gp-value-card { flex-direction: column; text-align: center; }
                    .gp-card-icon { margin-bottom: 12px; }
                    .gp-primary-btn { width: 100%; padding: 0 24px; }
                }
            `}</style>
        </div>
    );
};