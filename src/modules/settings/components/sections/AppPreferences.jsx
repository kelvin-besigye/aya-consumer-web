/**
 * 🌍 AYABUS CONSUMER WEB (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Module: Settings (Module 11/24)
 * File: src/modules/settings/components/sections/AppPreferences.jsx
 * * DESCRIPTION:
 * The UI card responsible for the physical manifestation of the app (Theme) 
 * and localization (Language). It interfaces directly with the vanilla JS 
 * theme manager for zero-latency DOM updates.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. SEGMENTED CONTROLS: Replaces cheap dropdowns with a tactile, 3-way 
 * segmented button for Theme selection.
 * 2. LIVE PUB/SUB SUBSCRIPTION: Uses a `useEffect` to listen to the theme 
 * engine, ensuring the UI perfectly reflects the DOM state without memory leaks.
 * 3. NATIVE LOCALIZATION WRAPPER: Styles a native `<select>` element to match 
 * the AyaBus brand, leveraging the OS's highly optimized native scrolling wheels.
 */

import React, { useState, useEffect } from 'react';
import { 
    Sun, 
    Moon, 
    MonitorSmartphone, 
    Globe2, 
    ChevronDown,
    Palette
} from 'lucide-react';

// Live Wire: The Engine we built in Phase 1
import { themeManager, THEMES } from '../../utils/theme.manager';

export const AppPreferences = ({ currentLanguage, onLanguageChange }) => {
    // ========================================================================
    // 1. STATE & SUBSCRIPTIONS
    // ========================================================================
    const [activeThemePref, setActiveThemePref] = useState(themeManager.getPreference());

    // Connect to the Pub/Sub engine to ensure UI stays in sync if OS changes it
    useEffect(() => {
        const unsubscribe = themeManager.subscribe(({ preference }) => {
            setActiveThemePref(preference);
        });
        
        // Cleanup function prevents zombie listeners and memory leaks
        return () => unsubscribe();
    }, []);

    const handleThemeChange = (newPreference) => {
        themeManager.setTheme(newPreference);
    };

    // ========================================================================
    // 2. CONFIGURATIONS
    // ========================================================================
    const themeOptions = [
        { id: THEMES.LIGHT, label: 'Light', icon: Sun },
        { id: THEMES.DARK, label: 'Dark', icon: Moon },
        { id: THEMES.SYSTEM, label: 'System', icon: MonitorSmartphone }
    ];

    const supportedLanguages = [
        { code: 'en', label: 'English (UK)' },
        { code: 'sw', label: 'Kiswahili' },
        { code: 'lg', label: 'Luganda' }
    ];

    // ========================================================================
    // 3. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="ap-chassis">
            
            <div className="ap-header">
                <Palette size={20} className="ap-brand-icon" />
                <h2>App Preferences</h2>
            </div>

            <div className="ap-body">
                
                {/* --- ROW 1: THEME SEGMENTED CONTROL --- */}
                <div className="ap-setting-group">
                    <div className="ap-label-row">
                        <label>Appearance</label>
                        <span className="ap-helper-text">Changes instantly</span>
                    </div>
                    
                    <div className="ap-segmented-control" role="group" aria-label="Theme selection">
                        {themeOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = activeThemePref === option.id;
                            
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={`ap-segment-btn ${isActive ? 'ap-segment-active' : ''}`}
                                    onClick={() => handleThemeChange(option.id)}
                                    aria-pressed={isActive}
                                >
                                    <Icon size={16} className={`ap-segment-icon ${isActive ? 'ap-icon-active' : ''}`} />
                                    <span>{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="ap-divider" />

                {/* --- ROW 2: LOCALIZATION DROPDOWN --- */}
                <div className="ap-setting-group">
                    <div className="ap-label-row">
                        <label>Language</label>
                        <span className="ap-helper-text">Requires app reload</span>
                    </div>

                    <div className="ap-select-wrapper">
                        <div className="ap-select-icon-left">
                            <Globe2 size={18} />
                        </div>
                        
                        <select 
                            className="ap-native-select"
                            value={currentLanguage || 'en'}
                            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
                        >
                            {supportedLanguages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>

                        <div className="ap-select-icon-right">
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .ap-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
                    width: 100%;
                }

                /* --- HEADER --- */
                .ap-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-subtle);
                    background: color-mix(in srgb, var(--bg-surface) 95%, var(--border-subtle));
                }

                .ap-brand-icon {
                    color: var(--brand-primary);
                }

                .ap-header h2 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                }

                /* --- BODY --- */
                .ap-body {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .ap-setting-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .ap-label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .ap-label-row label {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .ap-helper-text {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                .ap-divider {
                    height: 1px;
                    width: 100%;
                    background: var(--border-subtle);
                }

                /* --- SEGMENTED CONTROL (Theme Buttons) --- */
                .ap-segmented-control {
                    display: flex;
                    background: var(--bg-input);
                    padding: 4px;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border-subtle);
                    width: 100%;
                }

                .ap-segment-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 40px;
                    background: transparent;
                    border: none;
                    border-radius: calc(var(--radius-md) - 4px);
                    color: var(--text-muted);
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .ap-segment-btn:hover:not(.ap-segment-active) {
                    color: var(--text-main);
                    background: color-mix(in srgb, var(--bg-surface) 50%, transparent);
                }

                /* The active \"Pill\" state */
                .ap-segment-active {
                    background: var(--bg-surface);
                    color: var(--text-main);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
                }

                .ap-segment-icon {
                    color: var(--text-muted);
                    transition: color 0.2s;
                }

                .ap-icon-active {
                    color: var(--brand-primary); /* Primary brand color pop when active */
                }

                /* --- NATIVE SELECT WRAPPER (Language) --- */
                .ap-select-wrapper {
                    position: relative;
                    width: 100%;
                    display: flex;
                    align-items: center;
                }

                .ap-select-icon-left {
                    position: absolute;
                    left: 16px;
                    color: var(--text-muted);
                    pointer-events: none; /* Let clicks pass through to the select element */
                }

                .ap-select-icon-right {
                    position: absolute;
                    right: 16px;
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .ap-native-select {
                    width: 100%;
                    height: 48px;
                    padding: 0 44px 0 44px; /* Space for both icons */
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 15px;
                    font-weight: 600;
                    appearance: none; /* Strips the ugly default OS dropdown arrow */
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    cursor: pointer;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .ap-native-select:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .ap-native-select option {
                    /* Note: You cannot heavily style <option> tags natively, 
                       but the OS handles them beautifully anyway */
                    color: var(--text-main);
                    background: var(--bg-surface);
                }

                /* --- RESPONSIVE ADJUSTMENTS --- */
                @media (max-width: 480px) {
                    .ap-header { padding: 16px 20px; }
                    .ap-body { padding: 20px; gap: 20px; }
                    
                    /* On very narrow phones, shrink the gap slightly */
                    .ap-segment-btn { gap: 6px; font-size: 12px; }
                    .ap-segment-btn span { display: none; } /* Hide text on extremely small screens, show icons only */
                }
                
                /* Reveal text if screen is at least 350px wide */
                @media (min-width: 350px) {
                    .ap-segment-btn span { display: inline; }
                }
            `}</style>
        </div>
    );
};