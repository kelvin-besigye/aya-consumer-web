/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Park Finder (Module 8/24)
 * File: src/modules/park-finder/components/ParkFinderForm.jsx
 * * DESCRIPTION:
 * The intelligent command center for locating boarding points. It utilizes 
 * a cross-filtering matrix to mathematically guarantee a user can never 
 * select a City/Partner combination that results in zero parks.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. ZERO DEAD-ENDS: Selecting a city filters the available partners, and 
 * vice versa. Options that yield 0 results are stripped from the DOM instantly.
 * 2. COLLISION DETECTION: If a partner has multiple terminals in the same city 
 * (e.g., Kampala Kisenyi vs Kampala Namayiba), the form dynamically spawns a 
 * third selector to disambiguate the intent before routing.
 * 3. NATIVE GLASS DOM: Uses standard <select> tags heavily styled with CSS 
 * to ensure native iOS/Android picker wheels activate on mobile, providing 
 * the lowest friction UX possible.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
    MapPin, 
    BusFront, 
    Search, 
    ChevronDown, 
    Map as MapIcon,
    AlertCircle
} from 'lucide-react';

export const ParkFinderForm = ({ 
    matrix = [], 
    dictionaries = { cities: [], partners: [] }, 
    onParkFound, 
    isLoading 
}) => {
    // ========================================================================
    // 1. STATE MACHINE
    // ========================================================================
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedPartner, setSelectedPartner] = useState('');
    const [selectedTerminal, setSelectedTerminal] = useState(''); // Used if >1 park exists

    // ========================================================================
    // 2. THE CROSS-FILTERING MATRIX
    // ========================================================================
    
    // A. Available Cities (Filtered by selected Partner)
    const availableCities = useMemo(() => {
        if (!selectedPartner) return dictionaries.cities;
        // Find all unique cities where the selected partner has a park
        const partnerParks = matrix.filter(p => p.partnerId === selectedPartner);
        return [...new Set(partnerParks.map(p => p.city))].sort();
    }, [selectedPartner, dictionaries.cities, matrix]);

    // B. Available Partners (Filtered by selected City)
    const availablePartners = useMemo(() => {
        if (!selectedCity) return dictionaries.partners;
        // Find all unique partners who have a park in the selected city
        const cityParks = matrix.filter(p => p.city === selectedCity);
        const validPartnerIds = new Set(cityParks.map(p => p.partnerId));
        return dictionaries.partners.filter(p => validPartnerIds.has(p.id));
    }, [selectedCity, dictionaries.partners, matrix]);

    // C. Collision Detection (Find exact matching parks)
    const matchingParks = useMemo(() => {
        if (!selectedCity || !selectedPartner) return [];
        return matrix.filter(p => p.city === selectedCity && p.partnerId === selectedPartner);
    }, [selectedCity, selectedPartner, matrix]);

    // ========================================================================
    // 3. AUTO-RESOLVER HANDLERS
    // ========================================================================
    
    // If user changes city/partner, reset the terminal selection
    useEffect(() => {
        setSelectedTerminal('');
        
        // Auto-select terminal if there is exactly 1 match
        if (matchingParks.length === 1) {
            setSelectedTerminal(matchingParks[0].id);
        }
    }, [matchingParks]);

    // Validate if the currently selected values are still valid after cross-filtering
    useEffect(() => {
        if (selectedCity && !availableCities.includes(selectedCity)) setSelectedCity('');
        if (selectedPartner && !availablePartners.find(p => p.id === selectedPartner)) setSelectedPartner('');
    }, [availableCities, availablePartners, selectedCity, selectedPartner]);

    // ========================================================================
    // 4. KINETIC ACTIONS
    // ========================================================================
    const handleFindPark = () => {
        if (!selectedTerminal) return;
        const targetPark = matrix.find(p => p.id === selectedTerminal);
        if (targetPark) {
            onParkFound(targetPark);
        }
    };

    const isReadyToSearch = selectedCity && selectedPartner && selectedTerminal;

    // ========================================================================
    // 5. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="pff-chassis">
            <div className="pff-header">
                <div className="pff-icon-badge">
                    <MapIcon size={24} className="pff-brand-icon" />
                </div>
                <div>
                    <h2 className="pff-title">Locate Boarding Point</h2>
                    <p className="pff-subtitle">Select your city and bus company to get live coordinates.</p>
                </div>
            </div>

            <div className="pff-form-grid">
                
                {/* --- INPUT: CITY --- */}
                <div className="pff-input-group">
                    <label className="pff-label">Current City</label>
                    <div className="pff-select-wrapper">
                        <MapPin size={20} className="pff-input-icon" />
                        <select 
                            className="pff-select"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Select your city...</option>
                            {availableCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <ChevronDown size={20} className="pff-chevron" />
                    </div>
                </div>

                {/* --- INPUT: BUS COMPANY --- */}
                <div className="pff-input-group">
                    <label className="pff-label">Bus Company</label>
                    <div className="pff-select-wrapper">
                        <BusFront size={20} className="pff-input-icon" />
                        <select 
                            className="pff-select"
                            value={selectedPartner}
                            onChange={(e) => setSelectedPartner(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Select operator...</option>
                            {availablePartners.map(partner => (
                                <option key={partner.id} value={partner.id}>{partner.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={20} className="pff-chevron" />
                    </div>
                </div>

                {/* --- COLLISION RESOLVER: MULTIPLE TERMINALS --- */}
                {matchingParks.length > 1 && (
                    <div className="pff-input-group pff-full-width slide-down">
                        <label className="pff-label pff-warning-label">
                            <AlertCircle size={14} /> 
                            Multiple terminals found. Select specific location:
                        </label>
                        <div className="pff-select-wrapper pff-warning-wrapper">
                            <MapPin size={20} className="pff-input-icon" />
                            <select 
                                className="pff-select"
                                value={selectedTerminal}
                                onChange={(e) => setSelectedTerminal(e.target.value)}
                            >
                                <option value="">Choose terminal...</option>
                                {matchingParks.map(park => (
                                    <option key={park.id} value={park.id}>{park.parkName}</option>
                                ))}
                            </select>
                            <ChevronDown size={20} className="pff-chevron" />
                        </div>
                    </div>
                )}

                {/* --- ACTION TRIGGER --- */}
                <div className="pff-action-row pff-full-width">
                    <button 
                        className={`ayabus-btn pff-submit-btn ${!isReadyToSearch ? 'pff-btn-disabled' : ''}`}
                        onClick={handleFindPark}
                        disabled={!isReadyToSearch || isLoading}
                    >
                        {isLoading ? (
                            <span className="pff-loading-pulse">Synchronizing Network...</span>
                        ) : (
                            <>
                                <Search size={20} />
                                <span>Find My Park</span>
                            </>
                        )}
                    </button>
                </div>

            </div>

            {/* ========================================================================
                COMPONENT-SCOPED STYLES (African Physics)
            ======================================================================== */}
            <style>{`
                .pff-chassis {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-xl);
                    padding: 28px;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.04);
                    position: relative;
                    z-index: 10;
                }

                /* --- HEADER --- */
                .pff-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .pff-icon-badge {
                    width: 52px;
                    height: 52px;
                    border-radius: var(--radius-lg);
                    background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pff-brand-icon {
                    color: var(--brand-primary);
                }

                .pff-title {
                    margin: 0 0 4px 0;
                    font-size: 20px;
                    font-weight: 900;
                    color: var(--text-main);
                    letter-spacing: -0.3px;
                }

                .pff-subtitle {
                    margin: 0;
                    font-size: 14px;
                    color: var(--text-muted);
                }

                /* --- FORM GRID --- */
                .pff-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .pff-full-width {
                    grid-column: 1 / -1;
                }

                /* --- INPUT GEOMETRY --- */
                .pff-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .pff-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .pff-select-wrapper {
                    position: relative;
                    width: 100%;
                }

                .pff-input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .pff-chevron {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .pff-select {
                    width: 100%;
                    height: 56px; /* Fat-finger safe */
                    appearance: none;
                    -webkit-appearance: none;
                    background: var(--bg-input);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    padding: 0 48px; /* Room for icons */
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .pff-select:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 15%, transparent);
                }

                .pff-select:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* --- COLLISION RESOLVER STYLES --- */
                .pff-warning-label {
                    color: #F59E0B; /* Amber for attention */
                }
                .pff-warning-wrapper .pff-select {
                    border-color: color-mix(in srgb, #F59E0B 40%, transparent);
                    background: color-mix(in srgb, #F59E0B 5%, var(--bg-input));
                }

                /* --- SUBMIT BUTTON --- */
                .pff-action-row {
                    margin-top: 8px;
                }

                .pff-submit-btn {
                    width: 100%;
                    height: 56px;
                    font-size: 16px;
                    gap: 12px;
                }

                .pff-btn-disabled {
                    background: var(--bg-input) !important;
                    color: var(--text-muted) !important;
                    border: 1px solid var(--border-subtle) !important;
                    box-shadow: none !important;
                    cursor: not-allowed !important;
                }

                .pff-loading-pulse {
                    animation: pulseText 1.5s infinite;
                }

                /* --- ANIMATIONS --- */
                .slide-down { animation: formSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes formSlideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulseText {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 768px) {
                    .pff-chassis { padding: 20px; border-radius: 0; border-left: none; border-right: none; }
                    .pff-form-grid { grid-template-columns: 1fr; gap: 16px; }
                }
            `}</style>
        </div>
    );
};