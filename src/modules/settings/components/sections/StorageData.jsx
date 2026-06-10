/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Settings (Module 11/24)
 * File: src/modules/settings/components/sections/StorageData.jsx
 * * DESCRIPTION:
 * The targeted cache management system. Allows users to free up phone 
 * storage by purging temporary itinerary data and UI states.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. SURGICAL PURGE: Iterates through local storage and deletes everything 
 * EXCEPT the `sb-` prefixed Supabase authentication tokens. The user keeps 
 * their storage space without being forcefully logged out.
 * 2. TACTILE FEEDBACK: Provides a delayed, satisfying UI state change 
 * to prove to the user that background cleanup is occurring.
 */

import React, { useState } from 'react';
import { 
    HardDrive, 
    Trash2, 
    CheckCircle2, 
    Loader2 
} from 'lucide-react';

export const StorageData = () => {
    const [isClearing, setIsClearing] = useState(false);
    const [cleared, setCleared] = useState(false);

    const handleClearCache = () => {
        setIsClearing(true);
        setCleared(false);

        // Simulate a slight delay for tactile UI feedback
        setTimeout(() => {
            // SURGICAL PURGE: Loop backwards to safely remove items without breaking the index
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                // Preserve Supabase Auth tokens and theme preferences!
                if (key && !key.startsWith('sb-') && key !== 'ayabus_theme_preference') {
                    localStorage.removeItem(key);
                }
            }
            
            // Safe to completely wipe session storage (temporary data)
            sessionStorage.clear();

            setIsClearing(false);
            setCleared(true);

            // Reset the success message after 3 seconds
            setTimeout(() => setCleared(false), 3000);
        }, 800);
    };

    return (
        <div className="sd-chassis">
            <div className="sd-header">
                <HardDrive size={20} className="sd-brand-icon" />
                <h2>Data & Storage</h2>
            </div>

            <div className="sd-body">
                <div className="sd-info-row">
                    <div className="sd-text-block">
                        <h3>Clear Local Cache</h3>
                        <p>Free up storage space by clearing temporary images and routing data. You will <strong>not</strong> be logged out.</p>
                    </div>
                    
                    <button 
                        className={`ayabus-btn-ghost sd-action-btn ${cleared ? 'sd-success' : ''}`}
                        onClick={handleClearCache}
                        disabled={isClearing || cleared}
                    >
                        {isClearing ? (
                            <><Loader2 size={16} className="sd-spin" /> Purging...</>
                        ) : cleared ? (
                            <><CheckCircle2 size={16} /> Cleared</>
                        ) : (
                            <><Trash2 size={16} /> Clear Data</>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                .sd-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
                    width: 100%;
                }
                .sd-header {
                    display: flex; align-items: center; gap: 12px;
                    padding: 20px 24px; border-bottom: 1px solid var(--border-subtle);
                    background: color-mix(in srgb, var(--bg-surface) 95%, var(--border-subtle));
                }
                .sd-brand-icon { color: var(--brand-primary); }
                .sd-header h2 { margin: 0; font-size: 16px; font-weight: 800; color: var(--text-main); }
                
                .sd-body { padding: 24px; }
                .sd-info-row { display: flex; justify-content: space-between; align-items: center; gap: 24px; }
                
                .sd-text-block h3 { margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: var(--text-main); }
                .sd-text-block p { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.5; }
                .sd-text-block strong { color: var(--text-main); }
                
                .sd-action-btn { flex-shrink: 0; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; font-size: 13px; }
                .sd-success { background: color-mix(in srgb, #10B981 10%, transparent) !important; color: #10B981 !important; border-color: #10B981 !important; }
                .sd-spin { animation: spin 1s linear infinite; }
                
                @media (max-width: 500px) {
                    .sd-info-row { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .sd-action-btn { width: 100%; justify-content: center; }
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};