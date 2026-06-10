/**
 * 🌍 AYABUS CONSUMER WEB
 * ------------------------------------------------------------------
 * Module: Booking Funnel (Phase 3 - UI Components)
 * File: PassengerInputs.jsx
 * * DESCRIPTION:
 * The dynamic data-entry matrix for Step 3. Automatically spawns or 
 * destroys passenger input forms based on the exact seats selected 
 * on the ChassisGrid.
 * * WORLD-CLASS ENGINEERING (African Physics):
 * 1. DYNAMIC MANIFEST BINDING: Directly wired to the Zustand store's 
 * `passengerManifest` array. 1 Seat Clicked = 1 Form Rendered.
 * 2. PRIMARY CONTACT ANCHORING: Intelligently detects the first seat 
 * in the array and tags it as the "Primary Passenger", visually 
 * enforcing the required active phone number for dispatcher contact.
 * 3. TOUCH-TARGET INPUTS: All inputs and selects are strictly >= 48px 
 * tall to prevent fat-finger errors on bumpy taxi rides in Kampala.
 * 4. FINANCIAL SYNC: The Luggage dropdown is hardwired to the 'STANDARD' 
 * and 'HEAVY' enum, instantly triggering the price recalculation in the store.
 */

import React from 'react';
import { User, Phone, PhoneForwarded, Luggage, AlertCircle, Info } from 'lucide-react';

export const PassengerInputs = ({ 
    manifest = [], 
    onUpdatePassenger // function(seatId, field, value) 
}) => {

    // ========================================================================
    // 1. FAILSAFE: EMPTY STATE
    // If the user hasn't selected a seat yet, guide them to the chassis.
    // ========================================================================
    if (!manifest || manifest.length === 0) {
        return (
            <div className="pi-empty-state">
                <AlertCircle size={32} className="text-muted" />
                <h3>No Seats Selected</h3>
                <p>Please select at least one seat from the bus layout above to enter passenger details.</p>
            </div>
        );
    }

    // ========================================================================
    // 2. RENDER PAYLOAD
    // ========================================================================
    return (
        <div className="pi-chassis">
            <div className="pi-header">
                <h3>Passenger Information</h3>
                <p className="text-muted">Enter details for the {manifest.length} seat(s) you have selected.</p>
            </div>

            <div className="pi-cards-vault">
                {manifest.map((passenger, index) => {
                    const isPrimary = index === 0;

                    return (
                        <div key={passenger.seatId} className={`pi-card ${isPrimary ? 'is-primary' : ''}`}>
                            
                            {/* --- CARD HEADER (Seat ID & Tag) --- */}
                            <div className="pi-card-header">
                                <div className="pi-seat-badge">
                                    <span className="badge-label">SEAT</span>
                                    <span className="badge-value">{passenger.seatId}</span>
                                </div>
                                {isPrimary ? (
                                    <span className="pi-role-tag primary">Primary Contact</span>
                                ) : (
                                    <span className="pi-role-tag secondary">Passenger {index + 1}</span>
                                )}
                            </div>

                            {/* --- CARD BODY (The Form Grid) --- */}
                            <div className="pi-form-grid">
                                
                                {/* 1. Passenger Name */}
                                <div className="pi-input-group">
                                    <label htmlFor={`name-${passenger.seatId}`}>
                                        <User size={14} /> Full Name <span className="recommended">(Recommended)</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id={`name-${passenger.seatId}`}
                                        className="pi-input" 
                                        placeholder="e.g., John Doe"
                                        value={passenger.passengerName || ''}
                                        onChange={(e) => onUpdatePassenger(passenger.seatId, 'passengerName', e.target.value)}
                                        autoComplete="name"
                                    />
                                </div>

                                {/* 2. Active Phone Number (Crucial for Dispatch/MoMo) */}
                                <div className="pi-input-group">
                                    <label htmlFor={`phone-${passenger.seatId}`}>
                                        <Phone size={14} /> Active Phone Number {isPrimary && <span className="required">*</span>}
                                    </label>
                                    <input 
                                        type="tel" 
                                        id={`phone-${passenger.seatId}`}
                                        className="pi-input" 
                                        placeholder="07XX XXX XXX"
                                        required={isPrimary}
                                        value={passenger.activePhone || ''}
                                        onChange={(e) => onUpdatePassenger(passenger.seatId, 'activePhone', e.target.value)}
                                    />
                                    {isPrimary && (
                                        <div className="pi-hint"><Info size={12}/> The conductor will call this number if you are late.</div>
                                    )}
                                </div>

                                {/* 3. Alternative Contact */}
                                <div className="pi-input-group">
                                    <label htmlFor={`altPhone-${passenger.seatId}`}>
                                        <PhoneForwarded size={14} /> Alternative Contact <span className="recommended">(Recommended)</span>
                                    </label>
                                    <input 
                                        type="tel" 
                                        id={`altPhone-${passenger.seatId}`}
                                        className="pi-input" 
                                        placeholder="07XX XXX XXX"
                                        value={passenger.altContact || ''}
                                        onChange={(e) => onUpdatePassenger(passenger.seatId, 'altContact', e.target.value)}
                                    />
                                </div>

                                {/* 4. Luggage Upsell Engine */}
                                <div className="pi-input-group">
                                    <label htmlFor={`luggage-${passenger.seatId}`}>
                                        <Luggage size={14} /> Luggage Allowance
                                    </label>
                                    <select 
                                        id={`luggage-${passenger.seatId}`}
                                        className="pi-select"
                                        value={passenger.luggage || 'STANDARD'}
                                        onChange={(e) => onUpdatePassenger(passenger.seatId, 'luggage', e.target.value)}
                                    >
                                        <option value="STANDARD">Standard - 1 Bag (Free)</option>
                                        <option value="HEAVY">Heavy - Multiple/Large Bags (+5,000 UGX)</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ========================================================================
                3. COMPONENT-SCOPED STYLES (African Physics)
                Strictly bound to index.css for instant Dark/Light mode syncing.
            ======================================================================== */}
            <style>{`
                .pi-chassis {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                }

                /* --- EMPTY STATE --- */
                .pi-empty-state {
                    background: var(--bg-surface);
                    border: 1px dashed var(--border-subtle);
                    border-radius: var(--radius-lg);
                    padding: 40px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    gap: 12px;
                    color: var(--text-muted);
                }
                .pi-empty-state h3 { margin: 0; color: var(--text-main); font-size: 16px; }
                .pi-empty-state p { margin: 0; font-size: 14px; max-width: 300px; }
                .text-muted { opacity: 0.5; }

                /* --- HEADER --- */
                .pi-header h3 {
                    margin: 0 0 4px 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: var(--text-main);
                }
                .pi-header p {
                    margin: 0;
                    font-size: 14px;
                    color: var(--text-muted);
                }

                /* --- CARDS VAULT --- */
                .pi-cards-vault {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .pi-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                    transition: border-color 0.2s;
                }
                .pi-card:hover { border-color: var(--text-muted); }

                /* Highlighting the primary passenger for visual hierarchy */
                .pi-card.is-primary {
                    border-left: 4px solid var(--brand-primary);
                }

                /* --- CARD HEADER --- */
                .pi-card-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: var(--bg-body);
                    border-bottom: 1px solid var(--border-subtle);
                }

                .pi-seat-badge {
                    display: flex;
                    align-items: center;
                    background: var(--text-main);
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                }
                .badge-label {
                    background: rgba(255,255,255,0.2);
                    color: var(--bg-body);
                    font-size: 10px;
                    font-weight: 800;
                    padding: 4px 8px;
                    letter-spacing: 1px;
                }
                .badge-value {
                    color: var(--bg-body);
                    font-size: 14px;
                    font-weight: 900;
                    padding: 4px 10px;
                }

                .pi-role-tag {
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .pi-role-tag.primary {
                    background: color-mix(in srgb, var(--brand-primary) 15%, transparent);
                    color: var(--brand-primary);
                }
                .pi-role-tag.secondary {
                    background: var(--border-subtle);
                    color: var(--text-muted);
                }

                /* --- FORM GRID --- */
                .pi-form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    padding: 20px;
                }

                .pi-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .pi-input-group label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .pi-input-group label .required { color: #EF4444; }
                .pi-input-group label .recommended { color: var(--text-muted); font-weight: 500; font-size: 11px; }

                /* Core Input Physics (Min 48px height for touch targets) */
                .pi-input, .pi-select {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px;
                    background: var(--bg-input);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    font-size: 15px;
                    font-family: inherit;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .pi-input:focus, .pi-select:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 20%, transparent);
                }
                .pi-input::placeholder { color: var(--text-muted); opacity: 0.6; }

                /* Webkit specific styling for select arrow to match UI */
                .pi-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 16px center;
                    background-size: 16px;
                    cursor: pointer;
                }

                .pi-hint {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    color: var(--text-muted);
                    margin-top: 2px;
                }

                /* --- RESPONSIVE DEGRADATION --- */
                @media (max-width: 768px) {
                    /* On mobile, stack all inputs vertically to maximize screen width */
                    .pi-form-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                }
            `}</style>
        </div>
    );
};