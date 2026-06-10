/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Flash Booking (Module 2/24)
 * File: src/modules/flash-booking/components/LocationSuggestInput.jsx
 * * DESCRIPTION:
 * A high-performance, zero-latency autocomplete input for bus terminals.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. LOCAL MEMORY FILTER: Uses `useMemo` to filter the local REGIONAL_HUBS 
 * array instantly on the CPU, preventing layout shifts and network lag.
 * 2. CLICK-AWAY LISTENER: Intelligently closes the dropdown if the user 
 * taps anywhere else on the screen (crucial for mobile UX).
 * 3. EXPLICIT CONTRAST: Uses the `brand-primary` color to highlight the 
 * matched letters as the user types, guiding their eye immediately.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { REGIONAL_HUBS } from '../data/regional-hubs';

export const LocationSuggestInput = ({ 
    label, 
    placeholder, 
    value, 
    onChange, 
    icon: Icon = MapPin 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(value || '');
    const wrapperRef = useRef(null);

    // ========================================================================
    // 1. ENGINE: INSTANT FILTRATION
    // ========================================================================
    const filteredHubs = useMemo(() => {
        if (!searchQuery) {
            // If empty, show top 5 heaviest weighted hubs as defaults
            return [...REGIONAL_HUBS]
                .sort((a, b) => b.weight - a.weight)
                .slice(0, 5);
        }
        
        const query = searchQuery.toLowerCase();
        return REGIONAL_HUBS.filter(hub => 
            hub.name.toLowerCase().includes(query) || 
            hub.country.toLowerCase().includes(query)
        ).sort((a, b) => {
            // Prioritize exact starting matches, then fallback to weight
            const aStarts = a.name.toLowerCase().startsWith(query);
            const bStarts = b.name.toLowerCase().startsWith(query);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return b.weight - a.weight;
        }).slice(0, 6); // Cap at 6 results to prevent massive dropdowns
    }, [searchQuery]);

    // ========================================================================
    // 2. ENGINE: CLICK-AWAY DETECTION
    // ========================================================================
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                // If they clicked away without selecting, revert to the true value
                setSearchQuery(value || ''); 
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    // Sync external value changes (e.g., when the Swap button is clicked in the parent)
    useEffect(() => {
        setSearchQuery(value || '');
    }, [value]);

    // ========================================================================
    // 3. HANDLERS
    // ========================================================================
    const handleSelect = (hubName) => {
        setSearchQuery(hubName);
        onChange(hubName);
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setIsOpen(true);
        // Clear parent value if they start typing to enforce selection from the list
        if (value) onChange(''); 
    };

    // Helper to highlight matching text
    const renderHighlightedText = (text, highlight) => {
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, index) => 
            part.toLowerCase() === highlight.toLowerCase() ? 
            <span key={index} className="lsi-highlight">{part}</span> : part
        );
    };

    // ========================================================================
    // 4. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="lsi-chassis" ref={wrapperRef}>
            <div className="lsi-input-group">
                <label className="lsi-label">{label}</label>
                <div className="lsi-input-wrapper">
                    <Icon size={18} className="lsi-icon" />
                    <input 
                        type="text"
                        className="lsi-input"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                        autoComplete="off"
                    />
                </div>
            </div>

            {isOpen && (
                <div className="lsi-dropdown slide-down">
                    {filteredHubs.length > 0 ? (
                        filteredHubs.map(hub => (
                            <div 
                                key={hub.id} 
                                className="lsi-option"
                                onClick={() => handleSelect(hub.name)}
                            >
                                <div className="option-icon">
                                    <Navigation size={14} />
                                </div>
                                <div className="option-text">
                                    <span className="hub-name">
                                        {renderHighlightedText(hub.name, searchQuery)}
                                    </span>
                                    <span className="hub-country">{hub.country}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="lsi-empty">
                            <span className="text-muted">No terminals found in our network.</span>
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================================
                5. COMPONENT STYLES (African Physics)
                Strictly bound to index.css CSS variables.
            ======================================================================== */}
            <style>{`
                .lsi-chassis {
                    position: relative;
                    width: 100%;
                }

                .lsi-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .lsi-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--text-main);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .lsi-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .lsi-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--brand-primary);
                    pointer-events: none;
                }

                /* Mobile Fat-Finger Safety: Minimum 52px height */
                .lsi-input {
                    width: 100%;
                    height: 52px;
                    padding: 0 16px 0 44px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 16px; /* 16px prevents iOS auto-zoom */
                    font-weight: 600;
                    transition: all 0.2s var(--ease-main);
                }

                .lsi-input:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .lsi-input::placeholder {
                    color: var(--text-muted);
                    font-weight: 500;
                }

                /* DROPDOWN PHYSICS */
                .lsi-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    right: 0;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
                    z-index: var(--z-dropdown, 300);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .lsi-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    cursor: pointer;
                    transition: background 0.2s;
                    border-bottom: 1px solid var(--border-subtle);
                }
                .lsi-option:last-child { border-bottom: none; }
                .lsi-option:hover { background: var(--bg-body); }

                .option-icon {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: var(--bg-body);
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .option-text {
                    display: flex;
                    flex-direction: column;
                }
                
                .hub-name {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text-main);
                }
                .hub-country {
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--text-muted);
                }

                /* Emphasize the search match */
                .lsi-highlight {
                    color: var(--brand-primary);
                }

                .lsi-empty {
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                }

                /* ANIMATIONS */
                .slide-down {
                    animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transform-origin: top center;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px) scaleY(0.95); }
                    to { opacity: 1; transform: translateY(0) scaleY(1); }
                }
            `}</style>
        </div>
    );
};