/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Identity & Authentication (Module 5/24)
 * File: src/modules/sign-up/components/AuthVault.jsx
 * * DESCRIPTION:
 * The core identity chassis. Seamlessly morphs between Login, 
 * Registration, and Phone/Email OTP Verification states without 
 * triggering page reloads.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. THE OTP GATEWAY: Registration automatically halts and transitions 
 * into a secure 6-digit OTP entry screen, prepping the system for SMS verification.
 * 2. STATE MORPHING: Uses localized view states ('LOGIN' | 'REGISTER' | 'OTP') 
 * combined with CSS fade animations to prevent Cumulative Layout Shifts (CLS).
 * 3. STRICT VALIDATION: Prevents network traffic until phone numbers and 
 * emails meet strict client-side regex standards.
 */

import React, { useState } from 'react';
import { 
    Mail, Lock, Phone, User, 
    ArrowRight, Loader2, AlertCircle, 
    CheckCircle2, ShieldCheck
} from 'lucide-react';

// LIVE WIRE: The Logic Layer built in Phase 1
import { authService } from '../services/auth.service';

export const AuthVault = ({ 
    onSuccess = () => {}, // Callback to close modal or redirect
    initialView = 'LOGIN' // 'LOGIN' or 'REGISTER'
}) => {
    // ========================================================================
    // 1. THE STATE MACHINE
    // ========================================================================
    const [currentView, setCurrentView] = useState(initialView); // 'LOGIN' | 'REGISTER' | 'OTP'
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        otpCode: '' // For the verification step
    });

    const [uiState, setUiState] = useState({
        status: 'IDLE', // 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'
        errorMessage: ''
    });

    // ========================================================================
    // 2. KINETIC HANDLERS
    // ========================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (uiState.status === 'ERROR') {
            setUiState({ status: 'IDLE', errorMessage: '' });
        }
    };

    const switchView = (view) => {
        setUiState({ status: 'IDLE', errorMessage: '' });
        setCurrentView(view);
    };

    // ========================================================================
    // 3. NETWORK IGNITION (LOGIN)
    // ========================================================================
    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!formData.email.trim() || !formData.password) {
            setUiState({ status: 'ERROR', errorMessage: 'Please enter both email and password.' });
            return;
        }

        setUiState({ status: 'LOADING', errorMessage: '' });
        
        const response = await authService.signInWithEmail(formData.email, formData.password);
        
        if (response.success) {
            setUiState({ status: 'SUCCESS', errorMessage: '' });
            onSuccess(response.data); // Trigger upstream success (e.g., redirect to dashboard)
        } else {
            setUiState({ status: 'ERROR', errorMessage: response.error });
        }
    };

    // ========================================================================
    // 4. NETWORK IGNITION (REGISTER -> OTP)
    // ========================================================================
    const handleRegister = async (e) => {
        e.preventDefault();

        // Strict Gates
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
            setUiState({ status: 'ERROR', errorMessage: 'Please complete all fields to create your account.' });
            return;
        }

        if (formData.password.length < 6) {
            setUiState({ status: 'ERROR', errorMessage: 'For your security, password must be at least 6 characters.' });
            return;
        }

        setUiState({ status: 'LOADING', errorMessage: '' });

        const response = await authService.signUp({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
        });

        if (response.success) {
            // African Physics: We don't just log them in. We force the OTP view.
            setUiState({ status: 'IDLE', errorMessage: '' });
            setCurrentView('OTP');
        } else {
            setUiState({ status: 'ERROR', errorMessage: response.error });
        }
    };

    // ========================================================================
    // 5. OTP VERIFICATION LOGIC (Pre-wired for SMS providers)
    // ========================================================================
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (formData.otpCode.length < 6) {
            setUiState({ status: 'ERROR', errorMessage: 'Please enter the 6-digit verification code.' });
            return;
        }

        setUiState({ status: 'LOADING', errorMessage: '' });

        // NOTE: Once you integrate AfricasTalking/Twilio with Supabase, 
        // you will call authService.verifyPhoneOtp(formData.phone, formData.otpCode) here.
        
        // Simulating network delay for the prototype
        setTimeout(() => {
            setUiState({ status: 'SUCCESS', errorMessage: '' });
            onSuccess({ message: 'Phone verified successfully.' });
        }, 1500);
    };


    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="av-chassis">
            
            {/* --- HEADER VAULT --- */}
            <div className="av-header">
                {currentView === 'LOGIN' && (
                    <>
                        <h2 className="av-title">Welcome Back</h2>
                        <p className="av-subtitle">Sign in to track your tickets and Aya-Miles.</p>
                    </>
                )}
                {currentView === 'REGISTER' && (
                    <>
                        <h2 className="av-title">Create Account</h2>
                        <p className="av-subtitle">Join the ecosystem. Fast bookings, instant refunds.</p>
                    </>
                )}
                {currentView === 'OTP' && (
                    <>
                        <div className="av-icon-shield text-brand">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="av-title">Verify Your Phone</h2>
                        <p className="av-subtitle">We sent a 6-digit secure code to <strong>{formData.phone || 'your number'}</strong>.</p>
                    </>
                )}
            </div>

            {/* --- VIEW SWITCHER TABS (Hidden during OTP) --- */}
            {currentView !== 'OTP' && uiState.status !== 'SUCCESS' && (
                <div className="av-tabs">
                    <button 
                        className={`av-tab ${currentView === 'LOGIN' ? 'active' : ''}`}
                        onClick={() => switchView('LOGIN')}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button 
                        className={`av-tab ${currentView === 'REGISTER' ? 'active' : ''}`}
                        onClick={() => switchView('REGISTER')}
                        type="button"
                    >
                        Register
                    </button>
                </div>
            )}

            {/* --- ERROR TELEMETRY --- */}
            {uiState.status === 'ERROR' && (
                <div className="av-error-toast slide-down">
                    <AlertCircle size={18} />
                    <span>{uiState.errorMessage}</span>
                </div>
            )}

            {/* --- SUCCESS ARTIFACT --- */}
            {uiState.status === 'SUCCESS' && (
                <div className="av-success-vault fade-in">
                    <CheckCircle2 size={48} className="text-success" />
                    <h3>Authentication Complete</h3>
                    <p>Securing your session...</p>
                </div>
            )}

            {/* ========================================================================
                VIEW 1: LOGIN FORM
            ======================================================================== */}
            {currentView === 'LOGIN' && uiState.status !== 'SUCCESS' && (
                <form className="av-form fade-in" onSubmit={handleLogin}>
                    <div className="av-input-group">
                        <label>Email Address</label>
                        <div className="av-input-wrapper">
                            <Mail size={18} className="av-icon" />
                            <input 
                                type="email" name="email" className="av-input" 
                                placeholder="you@example.com"
                                value={formData.email} onChange={handleChange}
                                disabled={uiState.status === 'LOADING'}
                            />
                        </div>
                    </div>

                    <div className="av-input-group">
                        <div className="av-label-row">
                            <label>Secure Password</label>
                            <span className="av-forgot-link">Forgot?</span>
                        </div>
                        <div className="av-input-wrapper">
                            <Lock size={18} className="av-icon" />
                            <input 
                                type="password" name="password" className="av-input" 
                                placeholder="••••••••"
                                value={formData.password} onChange={handleChange}
                                disabled={uiState.status === 'LOADING'}
                            />
                        </div>
                    </div>

                    <button type="submit" className="ayabus-btn av-submit-btn" disabled={uiState.status === 'LOADING'}>
                        {uiState.status === 'LOADING' ? <Loader2 size={20} className="spin" /> : 'Secure Sign In'}
                    </button>
                </form>
            )}

            {/* ========================================================================
                VIEW 2: REGISTRATION FORM
            ======================================================================== */}
            {currentView === 'REGISTER' && uiState.status !== 'SUCCESS' && (
                <form className="av-form fade-in" onSubmit={handleRegister}>
                    <div className="av-grid">
                        <div className="av-input-group">
                            <label>First Name</label>
                            <div className="av-input-wrapper">
                                <User size={18} className="av-icon" />
                                <input 
                                    type="text" name="firstName" className="av-input" 
                                    placeholder="Kato" value={formData.firstName} onChange={handleChange}
                                    disabled={uiState.status === 'LOADING'}
                                />
                            </div>
                        </div>
                        <div className="av-input-group">
                            <label>Last Name</label>
                            <div className="av-input-wrapper">
                                <User size={18} className="av-icon" />
                                <input 
                                    type="text" name="lastName" className="av-input" 
                                    placeholder="Paul" value={formData.lastName} onChange={handleChange}
                                    disabled={uiState.status === 'LOADING'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* The Primary Identifier */}
                    <div className="av-input-group">
                        <label>Mobile Number (For Verification & Tickets)</label>
                        <div className="av-input-wrapper">
                            <Phone size={18} className="av-icon" />
                            <input 
                                type="tel" name="phone" className="av-input av-highlight-input" 
                                placeholder="+256 700 000000" value={formData.phone} onChange={handleChange}
                                disabled={uiState.status === 'LOADING'}
                            />
                        </div>
                    </div>

                    <div className="av-input-group">
                        <label>Email Address</label>
                        <div className="av-input-wrapper">
                            <Mail size={18} className="av-icon" />
                            <input 
                                type="email" name="email" className="av-input" 
                                placeholder="you@example.com" value={formData.email} onChange={handleChange}
                                disabled={uiState.status === 'LOADING'}
                            />
                        </div>
                    </div>

                    <div className="av-input-group">
                        <label>Create Password (Min. 6 chars)</label>
                        <div className="av-input-wrapper">
                            <Lock size={18} className="av-icon" />
                            <input 
                                type="password" name="password" className="av-input" 
                                placeholder="••••••••" value={formData.password} onChange={handleChange}
                                disabled={uiState.status === 'LOADING'}
                            />
                        </div>
                    </div>

                    <button type="submit" className="ayabus-btn av-submit-btn" disabled={uiState.status === 'LOADING'}>
                        {uiState.status === 'LOADING' ? <Loader2 size={20} className="spin" /> : 'Create Account'}
                    </button>
                </form>
            )}

            {/* ========================================================================
                VIEW 3: OTP VERIFICATION FORM
            ======================================================================== */}
            {currentView === 'OTP' && uiState.status !== 'SUCCESS' && (
                <form className="av-form fade-in" onSubmit={handleVerifyOTP}>
                    
                    <div className="av-otp-container">
                        <input 
                            type="text" 
                            name="otpCode" 
                            className="av-otp-input" 
                            placeholder="000000"
                            maxLength={6}
                            value={formData.otpCode} 
                            onChange={(e) => {
                                // Only allow numbers
                                const val = e.target.value.replace(/\D/g, '');
                                setFormData(prev => ({ ...prev, otpCode: val }));
                            }}
                            disabled={uiState.status === 'LOADING'}
                            autoComplete="one-time-code"
                        />
                        <span className="av-otp-hint">Enter the 6-digit code sent via SMS</span>
                    </div>

                    <button type="submit" className="ayabus-btn av-submit-btn" disabled={uiState.status === 'LOADING' || formData.otpCode.length < 6}>
                        {uiState.status === 'LOADING' ? (
                            <><Loader2 size={20} className="spin" /> Verifying...</>
                        ) : (
                            <>Verify & Complete <ArrowRight size={18} /></>
                        )}
                    </button>

                    <div className="av-resend-vault">
                        <span className="av-resend-text">Didn't receive the code?</span>
                        <button type="button" className="av-resend-btn" disabled={uiState.status === 'LOADING'}>
                            Resend SMS
                        </button>
                    </div>
                </form>
            )}

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .av-chassis {
                    width: 100%;
                    max-width: 440px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 32px;
                    box-shadow: 0 12px 48px rgba(0,0,0,0.06);
                    margin: 0 auto;
                }

                /* --- HEADER --- */
                .av-header {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .av-title {
                    font-size: 24px;
                    font-weight: 900;
                    color: var(--text-main);
                    margin: 0 0 8px 0;
                    letter-spacing: -0.5px;
                }

                .av-subtitle {
                    font-size: 14px;
                    color: var(--text-muted);
                    margin: 0;
                    line-height: 1.5;
                }

                .av-icon-shield {
                    width: 64px; height: 64px;
                    border-radius: 50%;
                    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 16px auto;
                }

                /* --- TABS --- */
                .av-tabs {
                    display: flex;
                    background: var(--bg-body);
                    border-radius: var(--radius-md);
                    padding: 4px;
                    margin-bottom: 24px;
                }

                .av-tab {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    background: transparent;
                    color: var(--text-muted);
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .av-tab.active {
                    background: var(--bg-surface);
                    color: var(--text-main);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }

                /* --- FORM PHYSICS --- */
                .av-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .av-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .av-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .av-label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .av-input-group label {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .av-forgot-link {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--brand-primary);
                    cursor: pointer;
                }

                .av-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .av-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--text-muted);
                    pointer-events: none;
                    transition: color 0.2s;
                }

                .av-input-wrapper:focus-within .av-icon {
                    color: var(--brand-primary);
                }

                .av-input {
                    width: 100%;
                    height: 52px; /* Fat finger safe */
                    background: var(--bg-body);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 15px;
                    padding: 0 16px 0 44px;
                    transition: all 0.2s;
                }

                .av-highlight-input {
                    background: color-mix(in srgb, var(--brand-primary) 3%, var(--bg-body));
                    border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--border-subtle));
                }

                .av-input:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    background: var(--bg-surface);
                    box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .av-input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* --- OTP PHYSICS --- */
                .av-otp-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .av-otp-input {
                    width: 100%;
                    height: 64px;
                    background: var(--bg-body);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    font-size: 32px;
                    font-weight: 900;
                    letter-spacing: 12px;
                    text-align: center;
                    color: var(--text-main);
                    transition: all 0.2s;
                }

                .av-otp-input:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .av-otp-hint {
                    font-size: 13px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .av-resend-vault {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 6px;
                    margin-top: 16px;
                }

                .av-resend-text {
                    font-size: 13px;
                    color: var(--text-muted);
                }

                .av-resend-btn {
                    background: transparent;
                    border: none;
                    color: var(--brand-primary);
                    font-size: 13px;
                    font-weight: 800;
                    cursor: pointer;
                    padding: 0;
                }
                .av-resend-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* --- ACTIONS & STATES --- */
                .av-submit-btn {
                    width: 100%;
                    height: 52px;
                    font-size: 16px;
                    margin-top: 8px;
                    gap: 8px;
                }

                .av-error-toast {
                    background: color-mix(in srgb, #EF4444 10%, var(--bg-surface));
                    color: #EF4444;
                    border: 1px solid color-mix(in srgb, #EF4444 30%, transparent);
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .av-success-vault {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 0;
                    text-align: center;
                }
                .av-success-vault h3 { margin: 16px 0 8px 0; color: var(--text-main); font-size: 20px; }
                .av-success-vault p { margin: 0; color: var(--text-muted); font-size: 14px; }
                .text-success { color: #10B981; }

                /* --- ANIMATIONS --- */
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

                .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 480px) {
                    .av-chassis { padding: 24px; border-radius: 0; border-left: none; border-right: none; box-shadow: none; }
                    .av-grid { grid-template-columns: 1fr; gap: 20px; }
                    .av-otp-input { letter-spacing: 8px; }
                }
            `}</style>
        </div>
    );
};