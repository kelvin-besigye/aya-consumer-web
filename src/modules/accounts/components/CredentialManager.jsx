/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Accounts Dashboard (Module 6/24)
 * File: src/modules/accounts/components/CredentialManager.jsx
 * * DESCRIPTION:
 * The Tier-2 Secure Credential Engine. Manages high-risk mutations 
 * (Email, Phone, Password) using a strict verify-before-update protocol.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO-TRUST MUTATIONS: Prevents immediate database overwrites. Routes 
 * phone changes to an SMS OTP gateway and email changes to a Magic Link lock.
 * 2. ISOLATED TELEMETRY: Uses distinct state objects for Phone, Email, 
 * and Password. An error in one does not pollute the visual state of the others.
 * 3. KINETIC LOCKDOWN: While an OTP is pending, the original credential 
 * input is `disabled`, forcing the user to complete the handshake or cancel it.
 */

import React, { useState, useEffect } from 'react';
import { 
    Phone, Mail, Lock, KeyRound, 
    ShieldCheck, AlertCircle, CheckCircle2, 
    Loader2, ArrowRight, XCircle
} from 'lucide-react';

// LIVE WIRES: Context & Mutations
import { useAuth } from '../../../context/AuthContext';
import { accountMutations } from '../services/account.mutations';

export const CredentialManager = () => {
    // 1. Global Brain
    const { user } = useAuth(); // We pull email/phone directly from the secure auth object

    // 2. Local State Matrices (Isolated tracking for each credential type)
    const [phoneState, setPhoneState] = useState({
        value: '', original: '', otpCode: '',
        status: 'IDLE', errorMessage: '' // IDLE | LOADING | PENDING_VERIFY | SUCCESS | ERROR
    });

    const [emailState, setEmailState] = useState({
        value: '', original: '',
        status: 'IDLE', errorMessage: '' 
    });

    const [passwordState, setPasswordState] = useState({
        value: '',
        status: 'IDLE', errorMessage: ''
    });

    // ========================================================================
    // HYDRATION ENGINE
    // ========================================================================
    useEffect(() => {
        if (user) {
            setPhoneState(prev => ({ 
                ...prev, 
                value: user.phone || '', 
                original: user.phone || '',
                // If it was successful, let it return to IDLE so it looks normal again
                status: prev.status === 'SUCCESS' ? 'IDLE' : prev.status 
            }));
            
            setEmailState(prev => ({ 
                ...prev, 
                value: user.email || '', 
                original: user.email || '',
                status: prev.status === 'SUCCESS' ? 'IDLE' : prev.status
            }));
        }
    }, [user]);

    // ========================================================================
    // ENGINE 1: PHONE SECURE MUTATION (OTP Handshake)
    // ========================================================================
    const handlePhoneRequest = async () => {
        if (phoneState.value === phoneState.original) return;
        
        setPhoneState(prev => ({ ...prev, status: 'LOADING', errorMessage: '' }));
        
        const response = await accountMutations.requestCredentialChange('phone', phoneState.value);

        if (response.success && response.requiresVerification) {
            setPhoneState(prev => ({ ...prev, status: 'PENDING_VERIFY' }));
        } else {
            setPhoneState(prev => ({ ...prev, status: 'ERROR', errorMessage: response.error }));
        }
    };

    const handlePhoneVerify = async () => {
        if (phoneState.otpCode.length < 6) return;

        setPhoneState(prev => ({ ...prev, status: 'LOADING', errorMessage: '' }));

        const response = await accountMutations.verifyPhoneChange(phoneState.value, phoneState.otpCode);

        if (response.success) {
            // Success! The AuthContext listener will automatically catch the USER_UPDATED 
            // event from Supabase and refresh the global state.
            setPhoneState(prev => ({ ...prev, status: 'SUCCESS', otpCode: '' }));
        } else {
            // Keep them in PENDING_VERIFY so they can try the code again
            setPhoneState(prev => ({ ...prev, status: 'PENDING_VERIFY', errorMessage: response.error }));
        }
    };

    const cancelPhoneUpdate = () => {
        setPhoneState(prev => ({ ...prev, status: 'IDLE', value: prev.original, otpCode: '', errorMessage: '' }));
    };

    // ========================================================================
    // ENGINE 2: EMAIL SECURE MUTATION (Magic Link)
    // ========================================================================
    const handleEmailRequest = async () => {
        if (emailState.value === emailState.original) return;
        
        setEmailState(prev => ({ ...prev, status: 'LOADING', errorMessage: '' }));
        
        const response = await accountMutations.requestCredentialChange('email', emailState.value);

        if (response.success && response.requiresVerification) {
            // Emails require clicking a link, not typing an OTP here.
            setEmailState(prev => ({ ...prev, status: 'PENDING_VERIFY' }));
        } else {
            setEmailState(prev => ({ ...prev, status: 'ERROR', errorMessage: response.error }));
        }
    };

    const cancelEmailUpdate = () => {
        setEmailState(prev => ({ ...prev, status: 'IDLE', value: prev.original, errorMessage: '' }));
    };

    // ========================================================================
    // ENGINE 3: PASSWORD MUTATION
    // ========================================================================
    const handlePasswordUpdate = async () => {
        if (passwordState.value.length < 6) {
            setPasswordState(prev => ({ ...prev, status: 'ERROR', errorMessage: 'Password must be at least 6 characters.' }));
            return;
        }

        setPasswordState(prev => ({ ...prev, status: 'LOADING', errorMessage: '' }));
        
        const response = await accountMutations.updateSecurePassword(passwordState.value);

        if (response.success) {
            setPasswordState(prev => ({ ...prev, status: 'SUCCESS', value: '' }));
            setTimeout(() => setPasswordState(prev => ({ ...prev, status: 'IDLE' })), 4000);
        } else {
            setPasswordState(prev => ({ ...prev, status: 'ERROR', errorMessage: response.error }));
        }
    };

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="cm-chassis fade-in">
            
            <div className="cm-header-vault">
                <div className="cm-header-flex">
                    <ShieldCheck size={24} className="text-brand" />
                    <div>
                        <h3 className="cm-title">Secure Credentials</h3>
                        <p className="cm-subtitle">Changes to these fields require secure verification.</p>
                    </div>
                </div>
            </div>

            <div className="cm-stack">

                {/* ==============================================================
                    SECTION 1: MOBILE NUMBER
                ============================================================== */}
                <div className="cm-section">
                    <div className="cm-input-group">
                        <label>Primary Mobile Number</label>
                        <div className="cm-flex-row">
                            <div className="cm-input-wrapper">
                                <Phone size={18} className="cm-icon" />
                                <input 
                                    type="tel" className="cm-input" 
                                    placeholder="+256 700 000000"
                                    value={phoneState.value}
                                    onChange={(e) => setPhoneState(prev => ({ ...prev, value: e.target.value, status: 'IDLE' }))}
                                    disabled={phoneState.status === 'LOADING' || phoneState.status === 'PENDING_VERIFY'}
                                />
                            </div>
                            
                            {/* Update Button (Only active if value changed and not verifying) */}
                            {phoneState.status !== 'PENDING_VERIFY' && (
                                <button 
                                    className={`ayabus-btn cm-action-btn ${phoneState.value === phoneState.original ? 'cm-btn-disabled' : ''}`}
                                    onClick={handlePhoneRequest}
                                    disabled={phoneState.value === phoneState.original || phoneState.status === 'LOADING'}
                                >
                                    {phoneState.status === 'LOADING' ? <Loader2 size={18} className="spin" /> : 'Update'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* PHONE ERROR */}
                    {phoneState.status === 'ERROR' && (
                        <div className="cm-alert cm-alert-error slide-down"><AlertCircle size={16} />{phoneState.errorMessage}</div>
                    )}
                    {phoneState.status === 'SUCCESS' && (
                        <div className="cm-alert cm-alert-success slide-down"><CheckCircle2 size={16} />Phone number updated securely.</div>
                    )}

                    {/* PHONE OTP GATEWAY */}
                    {phoneState.status === 'PENDING_VERIFY' && (
                        <div className="cm-verify-vault slide-down">
                            <p className="cm-verify-hint">Enter the 6-digit code sent to <strong>{phoneState.value}</strong></p>
                            <div className="cm-flex-row">
                                <input 
                                    type="text" className="cm-otp-input" placeholder="000000" maxLength={6}
                                    value={phoneState.otpCode}
                                    onChange={(e) => setPhoneState(prev => ({ ...prev, otpCode: e.target.value.replace(/\D/g, '') }))}
                                />
                                <button 
                                    className="ayabus-btn cm-verify-btn"
                                    onClick={handlePhoneVerify} disabled={phoneState.otpCode.length < 6}
                                >
                                    Verify <ArrowRight size={16} />
                                </button>
                                <button className="cm-cancel-icon" onClick={cancelPhoneUpdate} title="Cancel Update"><XCircle size={20} /></button>
                            </div>
                            {phoneState.errorMessage && <span className="cm-micro-error">{phoneState.errorMessage}</span>}
                        </div>
                    )}
                </div>

                {/* ==============================================================
                    SECTION 2: EMAIL ADDRESS
                ============================================================== */}
                <div className="cm-section">
                    <div className="cm-input-group">
                        <label>Account Email</label>
                        <div className="cm-flex-row">
                            <div className="cm-input-wrapper">
                                <Mail size={18} className="cm-icon" />
                                <input 
                                    type="email" className="cm-input" 
                                    placeholder="you@example.com"
                                    value={emailState.value}
                                    onChange={(e) => setEmailState(prev => ({ ...prev, value: e.target.value, status: 'IDLE' }))}
                                    disabled={emailState.status === 'LOADING' || emailState.status === 'PENDING_VERIFY'}
                                />
                            </div>
                            
                            {emailState.status !== 'PENDING_VERIFY' && (
                                <button 
                                    className={`ayabus-btn cm-action-btn ${emailState.value === emailState.original ? 'cm-btn-disabled' : ''}`}
                                    onClick={handleEmailRequest}
                                    disabled={emailState.value === emailState.original || emailState.status === 'LOADING'}
                                >
                                    {emailState.status === 'LOADING' ? <Loader2 size={18} className="spin" /> : 'Update'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* EMAIL ERROR */}
                    {emailState.status === 'ERROR' && (
                        <div className="cm-alert cm-alert-error slide-down"><AlertCircle size={16} />{emailState.errorMessage}</div>
                    )}
                    {emailState.status === 'SUCCESS' && (
                        <div className="cm-alert cm-alert-success slide-down"><CheckCircle2 size={16} />Email address updated securely.</div>
                    )}

                    {/* EMAIL MAGIC LINK NOTIFICATION */}
                    {emailState.status === 'PENDING_VERIFY' && (
                        <div className="cm-verify-vault cm-link-vault slide-down">
                            <Mail size={24} className="text-brand" />
                            <div>
                                <h5>Verification Link Sent</h5>
                                <p>We sent a secure link to <strong>{emailState.value}</strong>. Please check your inbox to confirm this change.</p>
                            </div>
                            <button className="cm-cancel-icon" onClick={cancelEmailUpdate}><XCircle size={20} /></button>
                        </div>
                    )}
                </div>

                {/* ==============================================================
                    SECTION 3: PASSWORD OVERRIDE
                ============================================================== */}
                <div className="cm-section">
                    <div className="cm-input-group">
                        <label>Update Password</label>
                        <div className="cm-flex-row">
                            <div className="cm-input-wrapper">
                                <Lock size={18} className="cm-icon" />
                                <input 
                                    type="password" className="cm-input" 
                                    placeholder="Enter new secure password"
                                    value={passwordState.value}
                                    onChange={(e) => setPasswordState(prev => ({ ...prev, value: e.target.value, status: 'IDLE' }))}
                                    disabled={passwordState.status === 'LOADING'}
                                />
                            </div>
                            
                            <button 
                                className={`ayabus-btn cm-action-btn ${passwordState.value.length < 6 ? 'cm-btn-disabled' : ''}`}
                                onClick={handlePasswordUpdate}
                                disabled={passwordState.value.length < 6 || passwordState.status === 'LOADING'}
                            >
                                {passwordState.status === 'LOADING' ? <Loader2 size={18} className="spin" /> : 'Set Password'}
                            </button>
                        </div>
                    </div>

                    {passwordState.status === 'ERROR' && (
                        <div className="cm-alert cm-alert-error slide-down"><AlertCircle size={16} />{passwordState.errorMessage}</div>
                    )}
                    {passwordState.status === 'SUCCESS' && (
                        <div className="cm-alert cm-alert-success slide-down"><KeyRound size={16} />Password has been successfully updated.</div>
                    )}
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .cm-chassis {
                    width: 100%;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.02);
                    overflow: hidden; /* Contains the sections neatly */
                }

                /* --- HEADER --- */
                .cm-header-vault {
                    padding: 32px 32px 24px 32px;
                    border-bottom: 1px solid var(--border-subtle);
                    background: color-mix(in srgb, var(--brand-primary) 2%, transparent);
                }

                .cm-header-flex {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .cm-title { margin: 0 0 4px 0; font-size: 20px; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px; }
                .cm-subtitle { margin: 0; font-size: 14px; color: var(--text-muted); }
                .text-brand { color: var(--brand-primary); }

                /* --- SECTIONS --- */
                .cm-stack {
                    display: flex;
                    flex-direction: column;
                }

                .cm-section {
                    padding: 32px;
                    border-bottom: 1px solid var(--border-subtle);
                }
                .cm-section:last-child { border-bottom: none; }

                /* --- INPUT PHYSICS --- */
                .cm-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .cm-input-group label {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .cm-flex-row {
                    display: flex;
                    gap: 12px;
                    align-items: stretch; /* Ensures button perfectly matches input height */
                }

                .cm-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    flex: 1; /* Takes remaining space */
                }

                .cm-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .cm-input-wrapper:focus-within .cm-icon { color: var(--brand-primary); }

                .cm-input {
                    width: 100%;
                    height: 52px; /* Fat-finger safe */
                    background: var(--bg-body);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 15px;
                    padding: 0 16px 0 44px;
                    transition: all 0.2s;
                }

                .cm-input:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    background: var(--bg-surface);
                    box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .cm-input:disabled { opacity: 0.6; cursor: not-allowed; }

                /* --- ACTIONS --- */
                .cm-action-btn {
                    height: 52px; /* Perfectly matches input height */
                    padding: 0 24px;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .cm-btn-disabled {
                    background: var(--bg-body) !important;
                    color: var(--text-muted) !important;
                    border: 1px solid var(--border-subtle) !important;
                    box-shadow: none !important;
                    cursor: not-allowed !important;
                }

                /* --- ALERTS & VERIFICATION VAULTS --- */
                .cm-alert {
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 16px;
                }
                .cm-alert-error { background: color-mix(in srgb, #EF4444 10%, var(--bg-surface)); color: #EF4444; border: 1px solid color-mix(in srgb, #EF4444 30%, transparent); }
                .cm-alert-success { background: color-mix(in srgb, #10B981 10%, var(--bg-surface)); color: #10B981; border: 1px solid color-mix(in srgb, #10B981 30%, transparent); }

                .cm-verify-vault {
                    margin-top: 20px;
                    padding: 24px;
                    background: color-mix(in srgb, var(--brand-primary) 4%, var(--bg-body));
                    border: 1px solid color-mix(in srgb, var(--brand-primary) 20%, var(--border-subtle));
                    border-radius: var(--radius-lg);
                    position: relative;
                }

                .cm-verify-hint { margin: 0 0 12px 0; font-size: 14px; color: var(--text-main); }
                
                .cm-otp-input {
                    height: 52px;
                    width: 140px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: 4px;
                    background: var(--bg-surface);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                }
                .cm-otp-input:focus { outline: none; border-color: var(--brand-primary); }

                .cm-verify-btn { height: 52px; padding: 0 24px; gap: 8px; }

                .cm-link-vault {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                }
                .cm-link-vault h5 { margin: 0 0 4px 0; font-size: 16px; color: var(--text-main); }
                .cm-link-vault p { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.5; }

                .cm-cancel-icon {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .cm-cancel-icon:hover { color: #EF4444; }

                .cm-micro-error { display: block; margin-top: 8px; font-size: 12px; color: #EF4444; font-weight: 600; }

                /* --- ANIMATIONS --- */
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .fade-in { animation: fadeIn 0.4s ease forwards; }
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
                .slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideDown { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 600px) {
                    .cm-flex-row { flex-direction: column; }
                    .cm-action-btn, .cm-verify-btn { width: 100%; }
                    .cm-otp-input { width: 100%; letter-spacing: 8px; }
                }

                @media (max-width: 480px) {
                    .cm-chassis { border-radius: 0; border-left: none; border-right: none; }
                    .cm-header-vault, .cm-section { padding: 24px 16px; }
                    .cm-verify-vault { padding: 20px 16px; }
                }
            `}</style>
        </div>
    );
};