/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Settings (Module 11/24)
 * File: src/modules/settings/components/sections/SecurityZone.jsx
 * * DESCRIPTION:
 * The critical security area for credential management and data deletion.
 * Interfaces directly with the settingsService cryptographic engine.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. HIGH-FRICTION DELETION: Prevents accidental account deletion by forcing 
 * the user to manually type "DELETE" before unlocking the execution button.
 * 2. LIVE ERROR HANDLING: Catches stale Supabase session errors and 
 * presents them clearly to the user instead of breaking the UI.
 */

import React, { useState } from 'react';
import { 
    ShieldAlert, 
    Key, 
    Trash2, 
    AlertTriangle, 
    Eye, 
    EyeOff,
    Loader2
} from 'lucide-react';

// Live Wire: Connects to the Database Engine built in Phase 1
import { settingsService } from '../../services/settings.service';

export const SecurityZone = ({ userId }) => {
    // --- PASSWORD STATE ---
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);
    const [passMessage, setPassMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // --- DELETION STATE ---
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // ========================================================================
    // 1. CRYPTOGRAPHIC UPDATE
    // ========================================================================
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setPassMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setIsUpdatingPass(true);
        setPassMessage(null);

        const response = await settingsService.updateSecurityPassword(password);

        if (response.success) {
            setPassMessage({ type: 'success', text: 'Password updated securely.' });
            setPassword('');
        } else {
            setPassMessage({ type: 'error', text: response.error });
        }

        setIsUpdatingPass(false);
    };

    // ========================================================================
    // 2. ACCOUNT TERMINATION PROTOCOL
    // ========================================================================
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        
        setIsDeleting(true);
        setDeleteError(null);

        const response = await settingsService.initiateAccountDeletion(userId);

        if (!response.success) {
            setDeleteError(response.error);
            setIsDeleting(false);
        }
        // If successful, the service auto-logs them out and unmounts the app.
    };

    // ========================================================================
    // 3. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="sz-chassis">
            <div className="sz-header">
                <ShieldAlert size={20} className="sz-brand-icon" />
                <h2>Security & Access</h2>
            </div>

            <div className="sz-body">
                
                {/* --- ZONE 1: PASSWORD MANAGEMENT --- */}
                <form onSubmit={handlePasswordUpdate} className="sz-form-zone">
                    <div className="sz-label-row">
                        <label>Update Password</label>
                        <span className="sz-helper-text">Requires a secure connection</span>
                    </div>

                    <div className="sz-input-wrapper">
                        <Key size={18} className="sz-input-icon-left" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="sz-input"
                            disabled={isUpdatingPass}
                        />
                        <button 
                            type="button" 
                            className="sz-input-icon-right"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {passMessage && (
                        <div className={`sz-message ${passMessage.type === 'success' ? 'sz-msg-success' : 'sz-msg-error'}`}>
                            {passMessage.text}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="ayabus-btn-ghost sz-submit-btn"
                        disabled={isUpdatingPass || !password}
                    >
                        {isUpdatingPass ? <Loader2 size={16} className="sz-spin" /> : null}
                        {isUpdatingPass ? 'Encrypting...' : 'Save New Password'}
                    </button>
                </form>

                <div className="sz-divider" />

                {/* --- ZONE 2: HIGH-FRICTION DELETION --- */}
                <div className="sz-danger-zone">
                    <div className="sz-danger-header">
                        <div>
                            <h3>Delete Account</h3>
                            <p>Permanently remove your data and travel history.</p>
                        </div>
                        {!isDeleteOpen && (
                            <button 
                                className="sz-reveal-delete-btn"
                                onClick={() => setIsDeleteOpen(true)}
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        )}
                    </div>

                    {isDeleteOpen && (
                        <div className="sz-friction-panel slide-down">
                            <div className="sz-friction-warning">
                                <AlertTriangle size={16} />
                                <span>This action is irreversible. All AyaMiles, saved tickets, and data will be wiped.</span>
                            </div>

                            <p className="sz-friction-instruct">
                                Type <strong>DELETE</strong> below to confirm.
                            </p>

                            <input 
                                type="text"
                                placeholder="DELETE"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="sz-friction-input"
                                disabled={isDeleting}
                            />

                            {deleteError && (
                                <div className="sz-message sz-msg-error" style={{ marginTop: '12px' }}>
                                    {deleteError}
                                </div>
                            )}

                            <div className="sz-friction-actions">
                                <button 
                                    className="sz-cancel-btn"
                                    onClick={() => { setIsDeleteOpen(false); setDeleteConfirmText(''); setDeleteError(null); }}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="sz-nuke-btn"
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                                >
                                    {isDeleting ? <Loader2 size={16} className="sz-spin" /> : 'Permanently Delete'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <style>{`
                .sz-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
                    width: 100%;
                }
                .sz-header {
                    display: flex; align-items: center; gap: 12px;
                    padding: 20px 24px; border-bottom: 1px solid var(--border-subtle);
                    background: color-mix(in srgb, var(--bg-surface) 95%, var(--border-subtle));
                }
                .sz-brand-icon { color: var(--text-main); }
                .sz-header h2 { margin: 0; font-size: 16px; font-weight: 800; color: var(--text-main); }
                
                .sz-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
                
                /* Form Styling */
                .sz-form-zone { display: flex; flex-direction: column; gap: 12px; }
                .sz-label-row { display: flex; justify-content: space-between; align-items: center; }
                .sz-label-row label { font-size: 14px; font-weight: 700; color: var(--text-main); }
                .sz-helper-text { font-size: 12px; font-weight: 600; color: var(--text-muted); }
                
                .sz-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
                .sz-input-icon-left { position: absolute; left: 16px; color: var(--text-muted); }
                .sz-input-icon-right { 
                    position: absolute; right: 8px; color: var(--text-muted); background: transparent; 
                    border: none; cursor: pointer; padding: 8px; border-radius: var(--radius-sm);
                }
                .sz-input-icon-right:hover { color: var(--text-main); background: var(--bg-body); }
                
                .sz-input {
                    width: 100%; height: 48px; padding: 0 48px;
                    background: var(--bg-input); border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md); color: var(--text-main);
                    font-size: 15px; font-weight: 500; font-family: monospace; transition: all 0.2s;
                }
                .sz-input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 15%, transparent); }
                
                .sz-submit-btn { align-self: flex-start; height: 40px; padding: 0 20px; font-size: 13px; gap: 8px; }
                
                .sz-message { padding: 12px 16px; border-radius: var(--radius-md); font-size: 13px; font-weight: 600; line-height: 1.5; }
                .sz-msg-success { background: color-mix(in srgb, #10B981 10%, transparent); color: #10B981; }
                .sz-msg-error { background: color-mix(in srgb, #EF4444 10%, transparent); color: #EF4444; }
                
                .sz-divider { height: 1px; width: 100%; background: var(--border-subtle); }
                
                /* Danger Zone */
                .sz-danger-zone { display: flex; flex-direction: column; }
                .sz-danger-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
                .sz-danger-header h3 { margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #EF4444; }
                .sz-danger-header p { margin: 0; font-size: 13px; color: var(--text-muted); }
                
                .sz-reveal-delete-btn {
                    display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 16px;
                    background: color-mix(in srgb, #EF4444 10%, transparent); color: #EF4444;
                    border: none; border-radius: var(--radius-md); font-size: 13px; font-weight: 700; cursor: pointer;
                    transition: all 0.2s;
                }
                .sz-reveal-delete-btn:hover { background: #EF4444; color: #FFF; }
                
                .sz-friction-panel {
                    margin-top: 16px; padding: 20px; background: color-mix(in srgb, #EF4444 4%, var(--bg-body));
                    border: 1px solid color-mix(in srgb, #EF4444 20%, transparent); border-radius: var(--radius-md);
                }
                
                .sz-friction-warning { display: flex; align-items: flex-start; gap: 8px; color: #EF4444; font-size: 13px; font-weight: 700; line-height: 1.5; margin-bottom: 16px; }
                .sz-friction-instruct { margin: 0 0 8px 0; font-size: 13px; color: var(--text-main); }
                .sz-friction-instruct strong { letter-spacing: 1px; }
                
                .sz-friction-input {
                    width: 100%; height: 48px; padding: 0 16px;
                    background: var(--bg-surface); border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md); color: var(--text-main); font-weight: 800; letter-spacing: 2px;
                }
                .sz-friction-input:focus { outline: none; border-color: #EF4444; box-shadow: 0 0 0 3px color-mix(in srgb, #EF4444 15%, transparent); }
                
                .sz-friction-actions { display: flex; gap: 12px; margin-top: 20px; justify-content: flex-end; }
                .sz-cancel-btn { background: transparent; border: 1px solid var(--border-subtle); color: var(--text-main); height: 40px; padding: 0 20px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; }
                .sz-cancel-btn:hover { background: var(--bg-surface); }
                
                .sz-nuke-btn {
                    display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 20px;
                    background: #EF4444; color: #FFF; border: none; border-radius: var(--radius-md); font-weight: 700; cursor: pointer;
                }
                .sz-nuke-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                
                .sz-spin { animation: spin 1s linear infinite; }
                .slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
                
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                
                @media (max-width: 500px) {
                    .sz-danger-header { flex-direction: column; align-items: flex-start; }
                    .sz-reveal-delete-btn { width: 100%; justify-content: center; }
                    .sz-friction-actions { flex-direction: column-reverse; }
                    .sz-friction-actions button { width: 100%; justify-content: center; }
                }
            `}</style>
        </div>
    );
};