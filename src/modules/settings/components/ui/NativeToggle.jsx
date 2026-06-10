/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Settings (Module 11/24)
 * File: src/modules/settings/components/ui/NativeToggle.jsx
 * * DESCRIPTION:
 * A high-performance, zero-dependency interactive switch primitive. 
 * Used across the Settings and Security modules to manage binary states.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. PURE DOM SEMANTICS: Uses `<button role="switch">` for flawless 
 * a11y (accessibility) and keyboard navigation without hidden inputs.
 * 2. KINETIC SPRING PHYSICS: Applies iOS-grade cubic-bezier transitions 
 * to the thumb for a highly tactile, premium feel.
 * 3. INHERITANCE ENGINE: Completely bound to `index.css` variables, 
 * ensuring it seamlessly morphs between Light and Dark mode globally.
 */

import React from 'react';

export const NativeToggle = ({ 
    isOn, 
    onToggle, 
    label, 
    description, 
    disabled = false,
    id 
}) => {
    
    // Fallback ID for aria-labelledby if one isn't explicitly provided
    const safeId = id || `toggle-${label?.replace(/\s+/g, '-').toLowerCase() || Math.random().toString(36).substring(2, 9)}`;
    const labelId = `${safeId}-label`;
    const descId = `${safeId}-desc`;

    return (
        <div className={`nt-wrapper ${disabled ? 'nt-disabled' : ''}`}>
            
            {/* --- LEFT: TEXT METADATA --- */}
            {(label || description) && (
                <div className="nt-text-matrix">
                    {label && (
                        <label id={labelId} className="nt-label" htmlFor={safeId}>
                            {label}
                        </label>
                    )}
                    {description && (
                        <span id={descId} className="nt-description">
                            {description}
                        </span>
                    )}
                </div>
            )}

            {/* --- RIGHT: THE PHYSICAL SWITCH --- */}
            <button
                id={safeId}
                type="button"
                role="switch"
                aria-checked={isOn}
                aria-labelledby={label ? labelId : undefined}
                aria-describedby={description ? descId : undefined}
                disabled={disabled}
                onClick={onToggle}
                className={`nt-track ${isOn ? 'nt-track-on' : 'nt-track-off'}`}
            >
                <span className={`nt-thumb ${isOn ? 'nt-thumb-on' : 'nt-thumb-off'}`} />
            </button>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .nt-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    width: 100%;
                    padding: 4px 0;
                }

                .nt-disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* --- TEXT MATRIX --- */
                .nt-text-matrix {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    flex: 1; /* Allows text to take up remaining space, pushing switch right */
                }

                .nt-label {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text-main);
                    cursor: pointer;
                    line-height: 1.4;
                }

                .nt-disabled .nt-label {
                    cursor: not-allowed;
                }

                .nt-description {
                    font-size: 13px;
                    color: var(--text-muted);
                    line-height: 1.5;
                }

                /* --- THE TRACK --- */
                .nt-track {
                    position: relative;
                    width: 50px;
                    height: 30px;
                    border-radius: 999px;
                    border: 2px solid transparent; /* Prevents layout shift on focus */
                    padding: 0;
                    margin: 0;
                    cursor: pointer;
                    flex-shrink: 0;
                    /* Smooth color transition */
                    transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s;
                }

                /* Keyboard Focus State (Accessibility Requirement) */
                .nt-track:focus-visible {
                    outline: none;
                    border-color: var(--text-main);
                    box-shadow: 0 0 0 2px var(--bg-body), 0 0 0 4px var(--brand-primary);
                }

                .nt-track-off {
                    background-color: var(--border-subtle);
                }

                .nt-track-on {
                    background-color: var(--brand-primary);
                }

                .nt-disabled .nt-track {
                    cursor: not-allowed;
                }

                /* --- THE THUMB --- */
                .nt-thumb {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 26px;
                    height: 26px;
                    background-color: #FFFFFF; /* Thumbs are always white in iOS design */
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.1);
                    /* The Kinetic Spring Physics */
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s;
                    will-change: transform;
                }

                /* In Dark Mode, a pure white thumb can be too blinding against dark tracks. 
                   We subtly dim it if the system is dark, but leave it white if the toggle is ON */
                [data-theme="dark"] .nt-track-off .nt-thumb {
                    background-color: #E0E0E0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
                }

                [data-theme="dark"] .nt-track-on .nt-thumb {
                    background-color: #FFFFFF;
                }

                .nt-thumb-off {
                    transform: translateX(0);
                }

                /* 50px width - 26px thumb - 4px padding (2px left + 2px right) = 20px translation */
                .nt-thumb-on {
                    transform: translateX(20px);
                }

                /* --- RESPONSIVE ADJUSTMENTS --- */
                @media (max-width: 480px) {
                    .nt-wrapper {
                        gap: 16px; /* Slightly tighter gap on small phones */
                    }
                    .nt-label {
                        font-size: 14px;
                    }
                    .nt-description {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};