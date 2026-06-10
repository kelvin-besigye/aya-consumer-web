/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Accounts Dashboard (Module 6/24)
 * File: src/modules/accounts/components/DangerZone.jsx
 * * DESCRIPTION:
 * The GDPR/Data Protection compliant account deletion engine. 
 * Implements high-friction UI to prevent accidental data destruction.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. THE DOUBLE-LOCK: Requires the user to explicitly type "DELETE" 
 * to activate the final network mutation.
 * 2. CASCADING EVICTION: Upon success, it automatically triggers a 
 * Supabase `signOut()`, which updates the global `AuthContext` and 
 * cleanly evicts the user from the secure dashboard.
 * 3. ISOLATED VISUAL HIERARCHY: Uses hostile red borders and backgrounds 
 * to subconsciously warn the user that they are in a destructive zone.
 */

import React, { useState } from 'react';
import { 
    AlertTriangle, 
    Trash2, 
    XCircle, 
    Loader2, 
    LogOut,
    ShieldAlert
} from 'lucide-react';

// LIVE WIRES: Context & Supabase Client
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

export const DangerZone = () => {
    // 1. Global Brain Connection
    const { user, passengerProfile } = useAuth();

    // 2. High-Friction State Machine
    const [step, setStep] = useState(1); // 1 = Warning, 2 = Confirmation Input
    const [confirmText, setConfirmText] = useState('');
    const [uiState, setUiState] = useState({
        status: 'IDLE', // 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'
        errorMessage: ''
    });

    // ========================================================================
    // KINETIC HANDLERS
    // ========================================================================
    const initiateDeletion = () => {
        setStep(2);
        setUiState({ status: 'IDLE', errorMessage: '' });
    };

    const cancelDeletion = () => {
        setStep(1);
        setConfirmText('');
        setUiState({ status: 'IDLE', errorMessage: '' });
    };

    // ========================================================================
    // NETWORK IGNITION (Destruction Protocol)
    // ========================================================================
    const executeAccountDeletion = async () => {
        if (confirmText !== 'DELETE') return;

        setUiState({ status: 'LOADING', errorMessage: '' });

        try {
            // In a real Supabase environment, you cannot delete a user directly 
            // from the client for security reasons. You call a secure RPC 
            // (Remote Procedure Call) or Edge Function.
            const { error: rpcError } = await supabase.rpc('delete_user_account');

            if (rpcError) {
                // If RPC fails (e.g. not set up yet), we throw to catch block
                throw rpcError; 
            }

            setUiState({ status: 'SUCCESS', errorMessage: '' });

            // After 2 seconds of showing the success message, destroy the session.
            // AuthContext will detect this and instantly route them to the GuestPrompt.
            setTimeout(async () => {
                await supabase.auth.signOut();
            }, 2000);

        } catch (error) {
            console.error('[AyaBus Danger Zone] Deletion Failed:', error);
            setUiState({ 
                status: 'ERROR', 
                errorMessage: 'Unable to process deletion right now. Please contact support if the issue persists.' 
            });
        }
    };

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="dz-chassis fade-in">
            
            <div className="dz-header-vault">
                <div className="dz-icon-shield">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="dz-title">Danger Zone</h3>
                    <p className="dz-subtitle">Irreversible account destruction and data erasure.</p>
                </div>
            </div>

            <div className="dz-content">
                
                {/* --- THE CONSEQUENCE MATRIX --- */}
                <div className="dz-warning-box">
                    <ShieldAlert size={20} className="dz-warning-icon" />
                    <div className="dz-warning-text">
                        <h4>If you delete your account:</h4>
                        <ul>
                            <li>All upcoming and past <strong>boarding passes</strong> will be permanently erased.</li>
                            <li>Your wallet balance and <strong>{passengerProfile?.aya_miles_balance || 0} Aya-Miles</strong> will be forfeited immediately.</li>
                            <li>Your personal data will be purged in accordance with GDPR and local data protection laws.</li>
                        </ul>
                    </div>
                </div>

                {/* --- ALERTS --- */}
                {uiState.status === 'ERROR' && (
                    <div className="dz-alert dz-alert-error slide-down">
                        <XCircle size={18} />
                        <span>{uiState.errorMessage}</span>
                    </div>
                )}

                {uiState.status === 'SUCCESS' && (
                    <div className="dz-alert dz-alert-success slide-down">
                        <LogOut size={18} />
                        <span>Account deleted. Disconnecting your session...</span>
                    </div>
                )}

                {/* --- STEP 1: INITIAL REQUEST --- */}
                {step === 1 && uiState.status !== 'SUCCESS' && (
                    <div className="dz-actions slide-down">
                        <button 
                            className="dz-btn dz-btn-outline"
                            onClick={initiateDeletion}
                        >
                            <Trash2 size={18} />
                            Request Account Deletion
                        </button>
                    </div>
                )}

                {/* --- STEP 2: HIGH FRICTION CONFIRMATION --- */}
                {step === 2 && uiState.status !== 'SUCCESS' && (
                    <div className="dz-confirm-vault slide-down">
                        <label className="dz-confirm-label">
                            To permanently delete your account, type <strong>DELETE</strong> below:
                        </label>
                        
                        <div className="dz-input-row">
                            <input 
                                type="text" 
                                className="dz-input" 
                                placeholder="DELETE"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                disabled={uiState.status === 'LOADING'}
                                autoComplete="off"
                            />
                        </div>

                        <div className="dz-confirm-actions">
                            <button 
                                className="dz-btn dz-btn-cancel"
                                onClick={cancelDeletion}
                                disabled={uiState.status === 'LOADING'}
                            >
                                Cancel
                            </button>
                            
                            <button 
                                className={`dz-btn dz-btn-destroy ${confirmText !== 'DELETE' ? 'dz-btn-disabled' : ''}`}
                                onClick={executeAccountDeletion}
                                disabled={confirmText !== 'DELETE' || uiState.status === 'LOADING'}
                            >
                                {uiState.status === 'LOADING' ? (
                                    <><Loader2 size={18} className="spin" /> Processing...</>
                                ) : (
                                    <><Trash2 size={18} /> Permanently Delete</>
                                )}
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .dz-chassis {
                    width: 100%;
                    background: var(--bg-surface);
                    border: 1px solid color-mix(in srgb, #EF4444 30%, var(--border-subtle));
                    border-radius: var(--radius-xl);
                    box-shadow: 0 4px 24px rgba(239, 68, 68, 0.05);
                    overflow: hidden;
                }

                /* --- HEADER --- */
                .dz-header-vault {
                    padding: 24px 32px;
                    border-bottom: 1px solid color-mix(in srgb, #EF4444 20%, var(--border-subtle));
                    background: color-mix(in srgb, #EF4444 4%, transparent);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .dz-icon-shield {
                    width: 48px;
                    height: 48px;
                    border-radius: var(--radius-md);
                    background: color-mix(in srgb, #EF4444 10%, transparent);
                    color: #EF4444;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dz-title { margin: 0 0 4px 0; font-size: 20px; font-weight: 800; color: #EF4444; letter-spacing: -0.5px; }
                .dz-subtitle { margin: 0; font-size: 14px; color: var(--text-muted); }

                /* --- CONTENT --- */
                .dz-content {
                    padding: 32px;
                }

                .dz-warning-box {
                    display: flex;
                    gap: 16px;
                    background: var(--bg-body);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    padding: 20px;
                    margin-bottom: 24px;
                }

                .dz-warning-icon {
                    color: var(--text-muted);
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .dz-warning-text h4 {
                    margin: 0 0 12px 0;
                    font-size: 15px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .dz-warning-text ul {
                    margin: 0;
                    padding-left: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .dz-warning-text li {
                    font-size: 14px;
                    color: var(--text-muted);
                    line-height: 1.5;
                }

                .dz-warning-text strong {
                    color: var(--text-main);
                }

                /* --- ALERTS --- */
                .dz-alert {
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .dz-alert-error { background: color-mix(in srgb, #EF4444 10%, var(--bg-surface)); color: #EF4444; border: 1px solid color-mix(in srgb, #EF4444 30%, transparent); }
                .dz-alert-success { background: color-mix(in srgb, #10B981 10%, var(--bg-surface)); color: #10B981; border: 1px solid color-mix(in srgb, #10B981 30%, transparent); }

                /* --- ACTIONS & INPUTS --- */
                .dz-actions {
                    display: flex;
                    justify-content: flex-start;
                }

                .dz-btn {
                    height: 52px;
                    padding: 0 24px;
                    border-radius: var(--radius-md);
                    font-size: 15px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .dz-btn-outline {
                    background: transparent;
                    color: #EF4444;
                    border: 2px solid color-mix(in srgb, #EF4444 30%, transparent);
                }
                .dz-btn-outline:hover {
                    background: color-mix(in srgb, #EF4444 5%, transparent);
                    border-color: #EF4444;
                }

                /* --- CONFIRMATION VAULT --- */
                .dz-confirm-vault {
                    background: color-mix(in srgb, #EF4444 2%, var(--bg-body));
                    border: 1px solid color-mix(in srgb, #EF4444 20%, var(--border-subtle));
                    border-radius: var(--radius-lg);
                    padding: 24px;
                }

                .dz-confirm-label {
                    display: block;
                    font-size: 14px;
                    color: var(--text-main);
                    margin-bottom: 12px;
                }
                .dz-confirm-label strong { color: #EF4444; }

                .dz-input-row {
                    margin-bottom: 20px;
                }

                .dz-input {
                    width: 100%;
                    max-width: 300px;
                    height: 52px;
                    background: var(--bg-surface);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 16px;
                    font-weight: 800;
                    padding: 0 16px;
                    transition: border-color 0.2s;
                }
                .dz-input:focus {
                    outline: none;
                    border-color: #EF4444;
                    box-shadow: 0 0 0 4px color-mix(in srgb, #EF4444 15%, transparent);
                }

                .dz-confirm-actions {
                    display: flex;
                    gap: 12px;
                }

                .dz-btn-cancel {
                    background: var(--bg-surface);
                    color: var(--text-main);
                    border: 1px solid var(--border-subtle);
                }
                .dz-btn-cancel:hover { background: var(--bg-body); }

                .dz-btn-destroy {
                    background: #EF4444;
                    color: #FFFFFF;
                    border: none;
                    box-shadow: 0 8px 24px color-mix(in srgb, #EF4444 30%, transparent);
                }
                .dz-btn-destroy:hover:not(:disabled) {
                    background: #DC2626;
                    transform: translateY(-2px);
                }

                .dz-btn-disabled {
                    background: var(--bg-body) !important;
                    color: var(--text-muted) !important;
                    border: 1px solid var(--border-subtle) !important;
                    box-shadow: none !important;
                    cursor: not-allowed !important;
                }

                /* --- ANIMATIONS --- */
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .fade-in { animation: fadeIn 0.4s ease forwards; }
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
                .slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideDown { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 600px) {
                    .dz-confirm-actions { flex-direction: column-reverse; }
                    .dz-btn { width: 100%; justify-content: center; }
                    .dz-input { max-width: 100%; text-align: center; letter-spacing: 2px;}
                }

                @media (max-width: 480px) {
                    .dz-chassis { border-radius: 0; border-left: none; border-right: none; }
                    .dz-header-vault, .dz-content { padding: 24px 16px; }
                    .dz-warning-box { flex-direction: column; align-items: center; text-align: center; }
                    .dz-warning-text ul { padding-left: 0; list-style: none; }
                }
            `}</style>
        </div>
    );
};