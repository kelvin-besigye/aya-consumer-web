/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Accounts Dashboard (Module 6/24)
 * File: src/modules/accounts/components/ProfileEditor.jsx
 * * DESCRIPTION:
 * The Tier-1 Identity Editor. Handles public-facing data (Name) and 
 * high-priority safety telemetry (Emergency Contacts).
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. KINETIC MEMORY: Automatically pre-fills the form using the global 
 * `AuthContext`, but isolates local edits into a `formData` state to 
 * prevent accidental global overwrites before saving.
 * 2. ZERO-WASTE MUTATIONS: Implements a strict `isDirty` check. The 
 * network engine cannot be fired unless the local state differs from 
 * the database state.
 * 3. INSTANT SYNCHRONIZATION: Upon a successful mutation, it triggers 
 * `refreshProfile()` to sync the new data across all active UI modules.
 */

import React, { useState, useEffect } from 'react';
import { 
    User, Phone, ShieldAlert, Save, 
    Loader2, CheckCircle2, AlertCircle 
} from 'lucide-react';

// LIVE WIRES: Context & Mutations
import { useAuth } from '../../../context/AuthContext';
import { accountMutations } from '../services/account.mutations';

export const ProfileEditor = () => {
    // 1. Hook into the Global Brain
    const { user, passengerProfile, refreshProfile } = useAuth();

    // 2. Local State Machine
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        emergencyName: '',
        emergencyPhone: ''
    });

    const [uiState, setUiState] = useState({
        status: 'IDLE', // 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'
        errorMessage: ''
    });

    const [isDirty, setIsDirty] = useState(false);

    // ========================================================================
    // HYDRATION ENGINE (Pre-fill from Context)
    // ========================================================================
    useEffect(() => {
        if (passengerProfile) {
            setFormData({
                firstName: passengerProfile.first_name || '',
                lastName: passengerProfile.last_name || '',
                emergencyName: passengerProfile.emergency_contact_name || '',
                emergencyPhone: passengerProfile.emergency_contact_phone || ''
            });
            setIsDirty(false); // Reset dirty state on fresh load
        }
    }, [passengerProfile]);

    // ========================================================================
    // KINETIC HANDLERS
    // ========================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
        
        // Clear any previous success/error messages as soon as they start typing again
        if (uiState.status !== 'IDLE') {
            setUiState({ status: 'IDLE', errorMessage: '' });
        }
    };

    // ========================================================================
    // NETWORK IGNITION (Tier 1 Update)
    // ========================================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Failsafe: Don't fire if nothing changed or if user context dropped
        if (!isDirty || !user?.id) return;

        // Basic Validation
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setUiState({ status: 'ERROR', errorMessage: 'First and Last name are strictly required.' });
            return;
        }

        setUiState({ status: 'LOADING', errorMessage: '' });

        // Fire the Tier 1 Engine
        const response = await accountMutations.updatePublicProfile(user.id, formData);

        if (response.success) {
            setUiState({ status: 'SUCCESS', errorMessage: '' });
            setIsDirty(false); // Reset dirty state because DB now matches local state
            
            // CRITICAL: Tell the global context to fetch the fresh data 
            // so the navigation bar updates instantly.
            await refreshProfile();

            // Auto-clear the success toast after 3 seconds
            setTimeout(() => {
                setUiState(prev => prev.status === 'SUCCESS' ? { status: 'IDLE', errorMessage: '' } : prev);
            }, 3000);
        } else {
            setUiState({ status: 'ERROR', errorMessage: response.error });
        }
    };

    // ========================================================================
    // RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="pe-chassis fade-in">
            
            <div className="pe-header-vault">
                <h3 className="pe-title">Personal Identity</h3>
                <p className="pe-subtitle">Manage your public profile and emergency telemetry.</p>
            </div>

            {/* --- TELEMETRY BUBBLES --- */}
            {uiState.status === 'ERROR' && (
                <div className="pe-alert pe-alert-error slide-down">
                    <AlertCircle size={18} />
                    <span>{uiState.errorMessage}</span>
                </div>
            )}

            {uiState.status === 'SUCCESS' && (
                <div className="pe-alert pe-alert-success slide-down">
                    <CheckCircle2 size={18} />
                    <span>Profile successfully synchronized with AyaBus servers.</span>
                </div>
            )}

            <form className="pe-form" onSubmit={handleSubmit}>
                
                {/* --- SECTION 1: PUBLIC IDENTITY --- */}
                <div className="pe-section">
                    <div className="pe-grid">
                        <div className="pe-input-group">
                            <label>Legal First Name</label>
                            <div className="pe-input-wrapper">
                                <User size={18} className="pe-icon" />
                                <input 
                                    type="text" name="firstName" className="pe-input" 
                                    placeholder="e.g. Kato"
                                    value={formData.firstName} onChange={handleChange}
                                    disabled={uiState.status === 'LOADING'}
                                />
                            </div>
                        </div>

                        <div className="pe-input-group">
                            <label>Legal Last Name</label>
                            <div className="pe-input-wrapper">
                                <User size={18} className="pe-icon" />
                                <input 
                                    type="text" name="lastName" className="pe-input" 
                                    placeholder="e.g. Paul"
                                    value={formData.lastName} onChange={handleChange}
                                    disabled={uiState.status === 'LOADING'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="pe-divider" />

                {/* --- SECTION 2: NEXT OF KIN / EMERGENCY --- */}
                <div className="pe-section">
                    <div className="pe-section-header">
                        <ShieldAlert size={18} className="text-warning" />
                        <h4>Emergency Contact (Next of Kin)</h4>
                    </div>
                    <p className="pe-section-desc">
                        Crucial for cross-border and long-distance transit. This person will only be contacted in the event of an operational emergency.
                    </p>

                    <div className="pe-grid">
                        <div className="pe-input-group">
                            <label>Contact Name</label>
                            <div className="pe-input-wrapper">
                                <User size={18} className="pe-icon" />
                                <input 
                                    type="text" name="emergencyName" className="pe-input" 
                                    placeholder="e.g. Sarah Babirye"
                                    value={formData.emergencyName} onChange={handleChange}
                                    disabled={uiState.status === 'LOADING'}
                                />
                            </div>
                        </div>

                        <div className="pe-input-group">
                            <label>Contact Phone Number</label>
                            <div className="pe-input-wrapper">
                                <Phone size={18} className="pe-icon" />
                                <input 
                                    type="tel" name="emergencyPhone" className="pe-input" 
                                    placeholder="+256 700 000000"
                                    value={formData.emergencyPhone} onChange={handleChange}
                                    disabled={uiState.status === 'LOADING'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ACTION FOOTER --- */}
                <div className="pe-footer">
                    <button 
                        type="submit" 
                        className={`ayabus-btn pe-submit-btn ${!isDirty ? 'pe-btn-disabled' : ''}`}
                        disabled={!isDirty || uiState.status === 'LOADING'}
                    >
                        {uiState.status === 'LOADING' ? (
                            <><Loader2 size={18} className="spin" /> Synchronizing...</>
                        ) : (
                            <><Save size={18} /> Save Changes</>
                        )}
                    </button>
                </div>
            </form>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .pe-chassis {
                    width: 100%;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 32px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.02);
                }

                /* --- HEADERS --- */
                .pe-header-vault {
                    margin-bottom: 32px;
                }

                .pe-title {
                    margin: 0 0 8px 0;
                    font-size: 20px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.5px;
                }

                .pe-subtitle {
                    margin: 0;
                    font-size: 14px;
                    color: var(--text-muted);
                }

                /* --- ALERTS --- */
                .pe-alert {
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .pe-alert-error {
                    background: color-mix(in srgb, #EF4444 10%, var(--bg-surface));
                    color: #EF4444;
                    border: 1px solid color-mix(in srgb, #EF4444 30%, transparent);
                }

                .pe-alert-success {
                    background: color-mix(in srgb, #10B981 10%, var(--bg-surface));
                    color: #10B981;
                    border: 1px solid color-mix(in srgb, #10B981 30%, transparent);
                }

                /* --- FORM PHYSICS --- */
                .pe-form {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                .pe-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .pe-section-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pe-section-header h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .pe-section-desc {
                    margin: -12px 0 0 0;
                    font-size: 13px;
                    color: var(--text-muted);
                    line-height: 1.5;
                }

                .text-warning { color: #F59E0B; }

                .pe-divider {
                    border: none;
                    height: 1px;
                    background: var(--border-subtle);
                    margin: 0;
                }

                /* --- GRID & INPUTS --- */
                .pe-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .pe-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .pe-input-group label {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .pe-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .pe-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--text-muted);
                    pointer-events: none;
                    transition: color 0.2s;
                }

                .pe-input-wrapper:focus-within .pe-icon {
                    color: var(--brand-primary);
                }

                .pe-input {
                    width: 100%;
                    height: 52px; /* Fat-finger safe standard */
                    background: var(--bg-body);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 15px;
                    padding: 0 16px 0 44px;
                    transition: all 0.2s;
                }

                .pe-input:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    background: var(--bg-surface);
                    box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .pe-input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* --- FOOTER & BUTTON --- */
                .pe-footer {
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 16px;
                }

                .pe-submit-btn {
                    height: 48px;
                    padding: 0 24px;
                    font-size: 15px;
                    gap: 8px;
                    min-width: 160px;
                }

                .pe-btn-disabled {
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
                @media (max-width: 768px) {
                    .pe-grid { grid-template-columns: 1fr; gap: 20px; }
                }

                @media (max-width: 480px) {
                    .pe-chassis { padding: 24px 16px; border-radius: 0; border-left: none; border-right: none; }
                    .pe-footer { justify-content: stretch; }
                    .pe-submit-btn { width: 100%; }
                }
            `}</style>
        </div>
    );
};